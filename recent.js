document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const recentBooksContainer = document.getElementById('recent-books-container');
    const emptyMessage = document.getElementById('empty-message');
    const searchInput = document.getElementById('search-input');
    
    // Initialize the page
    initRecentBooks();
    
    function initRecentBooks() {
        // Fetch books from localStorage
        const books = getBooks();
        
        // Display books or empty message
        if (books.length > 0) {
            // Sort books by date added (newest first)
            books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            
            // Display books
            displayBooks(books);
            emptyMessage.style.display = 'none';
            
            // Setup search functionality
            setupSearch(books);
        } else {
            // Show empty message
            emptyMessage.style.display = 'flex';
        }
    }
    
    function getBooks() {
        // Get books from localStorage or return empty array
        try {
            const books = JSON.parse(localStorage.getItem('books')) || [];
            return books;
        } catch (error) {
            console.error('Error loading books:', error);
            return [];
        }
    }
    
    function displayBooks(books) {
        // Clear container except for empty message
        const elements = recentBooksContainer.querySelectorAll('.book-card');
        elements.forEach(element => element.remove());
        
        // Display up to 8 most recent books
        const recentBooks = books.slice(0, 8);
        
        recentBooks.forEach((book, index) => {
            const bookCard = createBookCard(book);
            recentBooksContainer.appendChild(bookCard);
            
            // Apply staggered animation delay for smoother appearance
            setTimeout(() => {
                bookCard.style.opacity = '1';
            }, index * 100);
        });
    }
    
    function createBookCard(book) {
        // Calculate progress
        const completedCount = book.chapters.filter(chapter => chapter.completed).length;
        const totalChapters = book.chapters.length;
        const progressPercentage = totalChapters > 0 ? 
            Math.round((completedCount / totalChapters) * 100) : 0;
            
        // Format date
        const formattedDate = new Date(book.dateAdded).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create book card element
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.style.opacity = '0'; // Start invisible for animation
        bookCard.dataset.id = book.id;
        
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${book.coverImage}" alt="${book.title}">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-progress">
                    <div class="progress-text">
                        <span class="progress-label">Progress</span>
                        <span class="progress-value">${progressPercentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-filled" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                <p class="book-date">Added on ${formattedDate}</p>
            </div>
        `;
        
        // Add click event to navigate to book details
        bookCard.addEventListener('click', () => {
            window.location.href = `book-details.html?id=${book.id}`;
        });
        
        return bookCard;
    }
    
    function setupSearch(books) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Show all recent books if search is empty
                displayBooks(books);
                return;
            }
            
            // Filter books by title or author
            const filteredBooks = books.filter(book => 
                book.title.toLowerCase().includes(searchTerm) || 
                book.author.toLowerCase().includes(searchTerm)
            );
            
            // Update display
            if (filteredBooks.length > 0) {
                displayBooks(filteredBooks);
                emptyMessage.style.display = 'none';
            } else {
                // Show message for no matches
                const elements = recentBooksContainer.querySelectorAll('.book-card');
                elements.forEach(element => element.remove());
                
                const noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'empty-message';
                noResultsMsg.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No books match your search</p>
                `;
                recentBooksContainer.appendChild(noResultsMsg);
            }
        });
    }
});