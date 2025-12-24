document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const postsContainerHome = document.getElementById('posts-container-home');
    const postsContainerSearch = document.getElementById('posts-container');
    const postsContainerPage = document.getElementById('posts-container-page');
    const searchInputHomepage = document.getElementById('homepage-search-input');
    const searchInputPage = document.getElementById('search-input-page');
    const searchResultsInfo = document.getElementById('search-results-info');
    const searchQuerySpan = document.getElementById('search-query');

    // Legacy pagination controls (to hide)
    const legacyControls = document.querySelectorAll('.pagination-controls');

    let allPosts = [];
    const postsPerPage = 10;

    // =============================================================
    // Helpers
    // =============================================================

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function updateSearchUrl(query) {
        if (window.location.pathname === '/search/') {
            const currentUrl = new URL(window.location.href);
            if (query) {
                currentUrl.searchParams.set('q', query);
            } else {
                currentUrl.searchParams.delete('q');
            }
            window.history.pushState({ path: currentUrl.href }, '', currentUrl.href);
        }
    }

    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner hidden';
        spinner.innerHTML = '<div class="spinner"></div>';
        return spinner;
    }

    // =============================================================
    // Infinite Scroll Logic
    // =============================================================

    function initInfiniteScroll(container, initialPosts, isSearchPage = false, initialQuery = '') {
        let currentPosts = [...initialPosts];
        let currentPage = 1;
        let isLoading = false;

        // Hide legacy controls
        legacyControls.forEach(control => control.style.display = 'none');

        // Create Load More / Spinner element
        const spinner = createLoadingSpinner();
        container.after(spinner);

        // Filter for Search Page
        if (isSearchPage && initialQuery) {
            currentPosts = initialPosts.filter(post =>
                (post.title && post.title.toLowerCase().includes(initialQuery)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(initialQuery))
            );
            if (searchQuerySpan) searchQuerySpan.textContent = initialQuery;
            if (searchResultsInfo) searchResultsInfo.style.display = 'block';
        } else if (isSearchPage && !initialQuery) {
            if (searchResultsInfo) searchResultsInfo.style.display = 'none';
        }

        // Observer for Infinite Scroll
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                loadMorePosts();
            }
        }, { rootMargin: '100px' });

        function loadMorePosts() {
            const startIndex = (currentPage - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;

            // Checks if we have reached the end
            if (startIndex >= currentPosts.length) {
                spinner.classList.add('hidden');
                observer.disconnect();
                return;
            }

            isLoading = true;
            spinner.classList.remove('hidden');

            const postsToRender = currentPosts.slice(startIndex, endIndex);

            // Simulate network delay for UX (optional, can be removed)
            setTimeout(() => {
                renderPosts(postsToRender);
                currentPage++;
                isLoading = false;

                // If there are more posts, observe the spinner/last element again
                if (currentPage * postsPerPage < currentPosts.length) {
                    // Keep observing
                } else {
                    spinner.classList.add('hidden');
                    observer.disconnect();
                }
            }, 300);
        }

        function renderPosts(posts) {
            const ul = container.querySelector('ul') || document.createElement('ul');
            if (!container.contains(ul)) container.appendChild(ul);

            if (posts.length === 0 && currentPage === 1) {
                ul.innerHTML = '<p style="text-align:center; padding: 20px;">Nenhum post encontrado.</p>';
                return;
            }

            posts.forEach(post => {
                const li = document.createElement('li');
                const postUrl = post.url.startsWith('/') ? post.url : `/${post.url}`;

                // Use .card style for list items in search/home if in list view, 
                // or just standard list item style. Using specific style for post list.
                li.innerHTML = `
                    <a href="${postUrl}">${post.title}
                    <small>— ${new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
                    </a>
                `;
                ul.appendChild(li);
            });
        }

        // Initial Render
        container.innerHTML = ''; // Clear container
        loadMorePosts(); // Load first page
        observer.observe(spinner); // Start observing trigger

        // Search Input Logic (Re-init on search)
        if (isSearchPage && searchInputPage) {
            searchInputPage.addEventListener('keyup', function () {
                const query = searchInputPage.value.toLowerCase().trim();
                updateSearchUrl(query);

                // Reset state
                currentPage = 1;
                container.innerHTML = '';

                currentPosts = initialPosts.filter(post =>
                    (post.title && post.title.toLowerCase().includes(query)) ||
                    (post.excerpt && post.excerpt.toLowerCase().includes(query))
                );

                if (searchQuerySpan) searchQuerySpan.textContent = query;
                if (searchResultsInfo) searchResultsInfo.style.display = 'block';

                observer.disconnect();
                observer.observe(spinner); // Re-attach observer
                loadMorePosts();
            });
        }
    }

    // =============================================================
    // Fetch & Init
    // =============================================================
    fetch('/posts_data.json')
        .then(res => res.json())
        .then(data => {
            allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            const initialQuery = getQueryParam('q');

            if (window.location.pathname === '/' && postsContainerHome) {
                initInfiniteScroll(postsContainerHome, allPosts, false);
            } else if (window.location.pathname === '/search/' && postsContainerSearch) {
                if (searchInputPage && initialQuery) searchInputPage.value = initialQuery;
                initInfiniteScroll(postsContainerSearch, allPosts, true, initialQuery);
            } else if (window.location.pathname === '/posts/' && postsContainerPage) {
                initInfiniteScroll(postsContainerPage, allPosts, false);
            }
        })
        .catch(err => console.error('Error loading posts:', err));

    // Homepage Search Redirect
    if (searchInputHomepage) {
        searchInputHomepage.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.location.href = `/search/?q=${encodeURIComponent(this.value.trim())}`;
            }
        });
    }
});
