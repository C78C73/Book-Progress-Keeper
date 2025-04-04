document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const bookTitleInput = document.getElementById('book-title-input');
    const bookAuthorInput = document.getElementById('book-author-input');
    const bookImageFile = document.getElementById('book-image-file');
    const addChapterBtn = document.getElementById('add-chapter');
    const chapterInputGroup = document.querySelector('.chapter-input-group');
    const chaptersListElement = document.querySelector('.chapters-list');
    const saveBookBtn = document.getElementById('save-book');
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.progress-filled');
    const progressPercentage = document.querySelector('.progress-percentage');
    const fileNameDisplay = document.querySelector('.file-name');
    
    // Preview elements
    const previewTitle = document.querySelector('.preview-title');
    const previewAuthor = document.querySelector('.preview-author');
    const bookCoverPreview = document.querySelector('.book-cover-preview');
    
    // State management
    let chapters = ['Chapter 1'];
    let completedChapters = [];
    
    // Initialize the page
    initPage();
    
    function initPage() {
        // Add first chapter by default
        renderChapterInputs();
        renderProgressChapters();
        
        // Add event listeners
        bookTitleInput.addEventListener('input', updatePreview);
        bookAuthorInput.addEventListener('input', updatePreview);
        bookImageFile.addEventListener('change', handleImageUpload);
        addChapterBtn.addEventListener('click', addNewChapter);
        saveBookBtn.addEventListener('click', saveBook);
        
        // Delegate event listeners for dynamically created elements
        chapterInputGroup.addEventListener('click', handleChapterInputEvents);
        chaptersListElement.addEventListener('change', handleChapterProgress);
        document.addEventListener('input', updateChapterNames);
    }
    
    function updatePreview() {
        // Update book title and author in preview
        previewTitle.textContent = bookTitleInput.value || 'Book Title';
        previewAuthor.textContent = bookAuthorInput.value ? `by ${bookAuthorInput.value}` : 'by Author Name';
    }
    
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Update file name display
        fileNameDisplay.textContent = file.name;
        
        // Preview image
        const reader = new FileReader();
        reader.onload = function(e) {
            // Remove icon and text
            bookCoverPreview.innerHTML = '';
            
            // Create image element
            const img = document.createElement('img');
            img.src = e.target.result;
            bookCoverPreview.appendChild(img);
            
            // Add animation
            bookCoverPreview.classList.add('image-loaded');
            setTimeout(() => bookCoverPreview.classList.remove('image-loaded'), 500);
        };
        reader.readAsDataURL(file);
    }
    
    function addNewChapter() {
        // Add new chapter to state
        chapters.push(`Chapter ${chapters.length + 1}`);
        
        // Update UI
        renderChapterInputs();
        renderProgressChapters();
        
        // Animation for add button
        addChapterBtn.classList.add('btn-pulse');
        setTimeout(() => addChapterBtn.classList.remove('btn-pulse'), 500);
    }
    
    function renderChapterInputs() {
        // Clear existing inputs
        chapterInputGroup.innerHTML = '';
        
        // Add chapter inputs
        chapters.forEach((chapter, index) => {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'form-group chapter-input-container';
            inputContainer.dataset.index = index;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'chapter-input';
            input.value = chapter;
            input.placeholder = 'Enter chapter name';
            input.required = true;
            input.dataset.index = index;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove-chapter';
            removeBtn.dataset.index = index;
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            // Only allow removing if there's more than one chapter
            if (chapters.length > 1) {
                inputContainer.appendChild(input);
                inputContainer.appendChild(removeBtn);
            } else {
                inputContainer.appendChild(input);
            }
            
            chapterInputGroup.appendChild(inputContainer);
            
            // Apply staggered animation delay
            inputContainer.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    function renderProgressChapters() {
        // Clear existing chapters
        chaptersListElement.innerHTML = '';
        
        // Add chapters to progress section
        chapters.forEach((chapter, index) => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item';
            chapterItem.dataset.index = index;
            
            const isCompleted = completedChapters.includes(index);
            
            chapterItem.innerHTML = `
                <label class="chapter-checkbox">
                    <input type="checkbox" data-index="${index}" ${isCompleted ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
                <div class="chapter-info">
                    <div class="chapter-name">${chapter}</div>
                    <div class="chapter-date">${isCompleted ? getFormattedDate() : 'Not completed yet'}</div>
                </div>
            `;
            
            chaptersListElement.appendChild(chapterItem);
            
            // Apply staggered animation delay
            chapterItem.style.animationDelay = `${index * 0.1}s`;
        });
        
        // Update progress bar
        updateProgressBar();
    }
    
    function handleChapterInputEvents(event) {
        // Handle remove button clicks
        if (event.target.closest('.btn-remove-chapter')) {
            const button = event.target.closest('.btn-remove-chapter');
            const index = parseInt(button.dataset.index);
            removeChapter(index);
        }
    }
    
    function updateChapterNames(event) {
        // Update chapter names when input changes
        if (event.target.classList.contains('chapter-input')) {
            const index = parseInt(event.target.dataset.index);
            chapters[index] = event.target.value || `Chapter ${index + 1}`;
            
            // Update progress section
            const chapterNameElement = chaptersListElement.querySelector(`.chapter-item[data-index="${index}"] .chapter-name`);
            if (chapterNameElement) {
                chapterNameElement.textContent = chapters[index];
            }
        }
    }
    
    function removeChapter(index) {
        // Remove chapter from state
        chapters.splice(index, 1);
        
        // Update completed chapters indices
        completedChapters = completedChapters.filter(i => i !== index).map(i => i > index ? i - 1 : i);
        
        // Update UI
        renderChapterInputs();
        renderProgressChapters();
    }
    
    function handleChapterProgress(event) {
        if (event.target.type === 'checkbox') {
            const index = parseInt(event.target.dataset.index);
            const dateElement = event.target.closest('.chapter-item').querySelector('.chapter-date');
            
            if (event.target.checked) {
                // Mark chapter as completed
                if (!completedChapters.includes(index)) {
                    completedChapters.push(index);
                }
                dateElement.textContent = getFormattedDate();
            } else {
                // Mark chapter as not completed
                completedChapters = completedChapters.filter(i => i !== index);
                dateElement.textContent = 'Not completed yet';
            }
            
            // Update progress bar with animation
            updateProgressBar();
        }
    }
    
    function updateProgressBar() {
        const progress = chapters.length > 0 ? (completedChapters.length / chapters.length) * 100 : 0;
        progressPercentage.textContent = `${Math.round(progress)}%`;
        
        // Animate progress bar
        progressBar.style.width = `${progress}%`;
    }
    
    function getFormattedDate() {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function saveBook() {
        // Validate form
        if (!validateForm()) return;
        
        // Show loader
        loader.style.display = 'flex';
        saveBookBtn.style.display = 'none';
        
        // Simulate saving process
        setTimeout(() => {
            // Hide loader
            loader.style.display = 'none';
            saveBookBtn.style.display = 'flex';
            
            // Show success message
            alert('Book saved successfully!');
            
            // Redirect to home page
            window.location.href = 'index.html';
        }, 2000);
    }
    
    function validateForm() {
        // Basic form validation
        if (!bookTitleInput.value.trim()) {
            alert('Please enter a book title');
            bookTitleInput.focus();
            return false;
        }
        
        if (!bookAuthorInput.value.trim()) {
            alert('Please enter a book author');
            bookAuthorInput.focus();
            return false;
        }
        
        if (!bookImageFile.files[0]) {
            alert('Please select a book cover image');
            return false;
        }
        
        return true;
    }
});