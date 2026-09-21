const API_URL = '/api/books';
let quill;
let currentBooks = []; // Локальный кэш для хранения списка книг

// Вызывается автоматически сразу после загрузки страницы в браузере
document.addEventListener("DOMContentLoaded", () => {
    // Инициализируем визуальный HTML-редактор Quill
    quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['clean'] // Кнопка сброса форматирования
            ]
        }
    });

    // Загружаем начальный список книг
    loadBooks();
});

// 1. ЗАГРУЗКА И ПОИСК КНИГ (Пункт 5 задания)
async function loadBooks() {
    const search = document.getElementById('searchInput').value.trim();
    // Если есть поисковый запрос, добавляем его в URL как query-параметр
    const url = search ? `${API_URL}?query=${encodeURIComponent(search)}` : API_URL;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка сервера при получении данных');

        currentBooks = await response.json();

        const tbody = document.querySelector('#booksTable tbody');
        tbody.innerHTML = ''; // Очищаем таблицу перед заполнением

        currentBooks.forEach(book => {
            const tr = document.createElement('tr');

            // Клик по строке (кроме кнопки «Удалить») открывает карточку для редактирования
            tr.onclick = (e) => {
                if (e.target.tagName !== 'BUTTON') openModalForUpdate(book.id);
            };

            tr.innerHTML = `
                <td><strong>${escapeHtml(book.title)}</strong></td>
                <td>${escapeHtml(book.author)}</td>
                <td>${book.publishYear}</td>
                <td>${escapeHtml(book.isbn || '-')}</td>
                <td>
                    <button class="btn-danger" onclick="deleteBook(${book.id})">Удалить</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        alert('Не удалось загрузить список книг: ' + err.message);
    }
}

// 2. ПОДГОТОВКА КАРТОЧКИ К СОЗДАНИЮ (Пункт 3 задания)
function openModalForCreate() {
    document.getElementById('bookId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('publishYear').value = '';
    document.getElementById('isbn').value = '';
    quill.setContents([]); // Очищаем HTML-редактор

    document.getElementById('modalTitle').innerText = 'Добавление новой книги';
    document.getElementById('bookModal').style.display = 'flex';
}

// 3. ПОДГОТОВКА КАРТОЧКИ К РЕДАКТИРОВАНИЮ (Пункт 3 задания)
function openModalForUpdate(id) {
    const book = currentBooks.find(b => b.id === id);
    if (!book) return;

    document.getElementById('bookId').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('publishYear').value = book.publishYear;
    document.getElementById('isbn').value = book.isbn || '';

    // Извлекаем чистый HTML из XML-структуры <content>...HTML...</content>
    let htmlContent = '';
    if (book.tableOfContents) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(book.tableOfContents, "text/xml");
        const contentNode = xmlDoc.getElementsByTagName("content")[0];
        // Если тег найден, берем его внутреннее содержимое
        if (contentNode) {
            htmlContent = contentNode.innerHTML;
        }
    }

    // Загружаем извлеченный HTML в визуальный редактор
    quill.clipboard.dangerouslyPasteHTML(htmlContent);

    document.getElementById('modalTitle').innerText = 'Редактирование книги';
    document.getElementById('bookModal').style.display = 'flex';
}

// Закрытие карточки
function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// 4. СОХРАНЕНИЕ / ИЗМЕНЕНИЕ ДАННЫХ (Пункт 2 и 4 задания)
async function saveBook() {
    const id = document.getElementById('bookId').value;
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const publishYear = parseInt(document.getElementById('publishYear').value);
    const isbn = document.getElementById('isbn').value.trim();

    // Валидация обязательных полей на клиенте
    if (!title || !author || !publishYear) {
        alert('Пожалуйста, заполните обязательные поля: Название, Автор и Год.');
        return;
    }

    // Получаем сгенерированный HTML-код из визуального редактора Quill
    const htmlText = quill.root.innerHTML;

    // ПУНКТ 4: Оборачиваем HTML в валидную строку XML перед отправкой в EF Core
    const xmlTableOfContents = `<content>${htmlText}</content>`;

    const bookData = {
        title: title,
        author: author,
        publishYear: publishYear,
        isbn: isbn || null,
        tableOfContents: xmlTableOfContents
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) throw new Error('Ошибка сохранения на стороне сервера');

        closeModal();
        loadBooks(); // Обновляем таблицу на экране
    } catch (err) {
        alert('Не удалось сохранить изменения: ' + err.message);
    }
}

// 5. УДАЛЕНИЕ КНИГИ (Пункт 2 задания)
async function deleteBook(id) {
    if (!confirm('Вы действительно хотите удалить эту книгу из домашней библиотеки?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Ошибка сервера при удалении');

        loadBooks(); // Перезагружаем список
    } catch (err) {
        alert('Не удалось удалить книгу: ' + err.message);
    }
}

// Вспомогательная функция безопасности для защиты от XSS-уязвимостей
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
