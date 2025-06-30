document.addEventListener('DOMContentLoaded', function() {
    // Elementos da Homepage
    const postsContainerHome = document.getElementById('posts-container-home');
    const prevButtonHome = document.getElementById('prev-page-home');
    const nextPageButtonHome = document.getElementById('next-page-home');
    const pageInfoHome = document.getElementById('page-info-home');
    const searchInputHomepage = document.getElementById('homepage-search-input');

    // Elementos da Página de Busca (/search/)
    const postsContainerSearch = document.getElementById('posts-container');
    const prevButtonSearch = document.getElementById('prev-page');
    const nextPageButtonSearch = document.getElementById('next-page');
    const pageInfoSearch = document.getElementById('page-info');
    const searchInputPage = document.getElementById('search-input-page');
    const searchResultsInfo = document.getElementById('search-results-info');
    const searchQuerySpan = document.getElementById('search-query');

    let allPosts = []; // Todos os posts brutos do JSON
    const postsPerPage = 10; // Número de posts por página, ajustável

    // =============================================================
    // Funções Comuns
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

    function fetchAllPostsAndInitialize(initialQuery = '') {
        fetch('/posts_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));

                if (window.location.pathname === '/') {
                    // Inicializa paginação da HOME
                    initPagination(postsContainerHome, prevButtonHome, nextPageButtonHome, pageInfoHome, allPosts, false);
                } else if (window.location.pathname === '/search/') {
                    // Inicializa paginação da BUSCA
                    initPagination(postsContainerSearch, prevButtonSearch, nextPageButtonSearch, pageInfoSearch, allPosts, true, initialQuery);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar posts:', error);
                if (postsContainerHome) postsContainerHome.innerHTML = '<p>Erro ao carregar posts da homepage.</p>';
                if (postsContainerSearch) postsContainerSearch.innerHTML = '<p>Erro ao carregar posts para busca.</p>';
            });
    }

    // =============================================================
    // Lógica de Paginação Reutilizável
    // =============================================================

    function initPagination(container, prevBtn, nextBtn, infoSpan, initialPosts, isSearchPage = false, initialQuery = '') {
        let currentPosts = [...initialPosts]; // Posts para a instância atual (todos ou filtrados)
        let currentPage = 1;

        // Para página de busca, aplique a query inicial
        if (isSearchPage && initialQuery) {
            currentPosts = initialPosts.filter(post =>
                (post.title && post.title.toLowerCase().includes(initialQuery)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(initialQuery))
            );
            if (searchQuerySpan) searchQuerySpan.textContent = initialQuery;
            if (searchResultsInfo) searchResultsInfo.style.display = 'block';
        } else if (isSearchPage && !initialQuery) {
            // Se é página de busca e não tem query, limpa resultados da busca.
            // Mas queremos mostrar todos os posts na home se não houver busca.
            if (searchResultsInfo) searchResultsInfo.style.display = 'none';
        }


        function renderPage() {
            container.innerHTML = '';
            const startIndex = (currentPage - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const postsToRender = currentPosts.slice(startIndex, endIndex);

            const ul = document.createElement('ul');
            if (postsToRender.length === 0 && currentPosts.length === 0) {
                ul.innerHTML = '<p>Nenhum post encontrado.</p>';
            } else if (postsToRender.length === 0 && currentPosts.length > 0) {
                // Se não há posts para renderizar na página atual, mas há posts no total,
                // significa que a página atual está além da última página de posts.
                // Isso pode acontecer se a última página tinha 1 post e ele foi deletado, por exemplo.
                // Redefine para a última página válida.
                currentPage = Math.max(1, Math.ceil(currentPosts.length / postsPerPage));
                renderPage(); // Tenta renderizar novamente a página válida
                return;
            }


            postsToRender.forEach(post => {
                const li = document.createElement('li');
                const postUrl = post.url.startsWith('/') ? post.url : `/${post.url}`;
                li.innerHTML = `
                    <a href="${postUrl}">${post.title}
                    <small>— ${new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
                    </a>
                `;
                ul.appendChild(li);
            });
            container.appendChild(ul);
            updateControls();
        }

        function updateControls() {
            const totalPages = Math.ceil(currentPosts.length / postsPerPage);
            infoSpan.textContent = `Página ${currentPage} de ${totalPages}`;

            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages || currentPosts.length === 0;

            if (currentPosts.length <= postsPerPage) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                infoSpan.style.display = 'none';
            } else {
                prevBtn.style.display = '';
                nextBtn.style.display = '';
                infoSpan.style.display = '';
            }
        }

        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage();
            }
        });

        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(currentPosts.length / postsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderPage();
            }
        });

        // Lógica de busca para a página de busca (/search/)
        if (isSearchPage && searchInputPage) {
             searchInputPage.addEventListener('keyup', function() {
                const query = searchInputPage.value.toLowerCase().trim();
                updateSearchUrl(query); // Atualiza a URL com a nova busca
                currentPosts = initialPosts.filter(post =>
                    (post.title && post.title.toLowerCase().includes(query)) ||
                    (post.excerpt && post.excerpt.toLowerCase().includes(query))
                );
                if (searchQuerySpan) searchQuerySpan.textContent = query;
                if (searchResultsInfo) searchResultsInfo.style.display = 'block';
                currentPage = 1;
                renderPage();
            });
        }

        renderPage(); // Renderiza a página inicial na primeira carga
    }

    // =============================================================
    // Inicialização Principal
    // =============================================================

    // Listener para o campo de busca na homepage (redireciona para /search)
    if (searchInputHomepage) {
        searchInputHomepage.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const query = searchInputHomepage.value.trim();
                window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            }
        });
    }

    // Preencher o campo de busca da página de resultados se houver query na URL
    const initialQueryFromUrl = getQueryParam('q');
    if (searchInputPage && initialQueryFromUrl) {
        searchInputPage.value = initialQueryFromUrl;
    }


    // Inicia o processo de buscar todos os posts e inicializar a paginação apropriada
    fetchAllPostsAndInitialize(initialQueryFromUrl);
});
