document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const prevButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const searchInputHomepage = document.getElementById('homepage-search-input'); // Campo de busca na homepage
    const searchInputPage = document.getElementById('search-input-page'); // Campo de busca na página de resultados
    const searchResultsInfo = document.getElementById('search-results-info');
    const searchQuerySpan = document.getElementById('search-query');

    let allPosts = [];
    let filteredPosts = [];
    const postsPerPage = 10;
    let currentPage = 1;

    // Função para obter o parâmetro 'q' da URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Função para atualizar a URL da página de busca
    function updateSearchUrl(query) {
        const currentUrl = new URL(window.location.href);
        if (query) {
            currentUrl.searchParams.set('q', query);
        } else {
            currentUrl.searchParams.delete('q');
        }
        window.history.pushState({ path: currentUrl.href }, '', currentUrl.href);
    }

    function fetchPosts(initialQuery = '') {
        fetch('/posts_data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                performSearch(initialQuery); // Realiza a busca inicial com a query da URL
            })
            .catch(error => {
                console.error('Erro ao carregar posts:', error);
                if (postsContainer) {
                    postsContainer.innerHTML = '<p>Erro ao carregar posts para busca. Tente novamente mais tarde.</p>';
                }
            });
    }

    function renderPosts() {
        if (!postsContainer) return; // Garante que o container existe na página atual

        postsContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        const ul = document.createElement('ul');
        if (postsToShow.length === 0) {
             ul.innerHTML = '<p>Nenhum post encontrado para esta busca.</p>';
        }

        postsToShow.forEach(post => {
            const li = document.createElement('li');
            const postUrl = post.url.startsWith('/') ? post.url : `/${post.url}`;
            li.innerHTML = `
                <a href="${postUrl}">${post.title}
                <small>— ${new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
                </a>
            `;
            ul.appendChild(li);
        });
        postsContainer.appendChild(ul);
    }

    function updatePaginationControls() {
        if (!pageInfo || !prevButton || !nextPageButton) return;

        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        prevButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages || filteredPosts.length === 0;

        if (filteredPosts.length <= postsPerPage) {
            prevButton.style.display = 'none';
            nextPageButton.style.display = 'none';
            pageInfo.style.display = 'none';
        } else {
            prevButton.style.display = '';
            nextPageButton.style.display = '';
            pageInfo.style.display = '';
        }
    }

    // Nova função para realizar a filtragem
    function performSearch(query) {
        if (query === '') {
            filteredPosts = [...allPosts];
            if (searchResultsInfo) searchResultsInfo.style.display = 'none';
        } else {
            filteredPosts = allPosts.filter(post =>
                (post.title && post.title.toLowerCase().includes(query)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(query))
            );
            if (searchQuerySpan) searchQuerySpan.textContent = query;
            if (searchResultsInfo) searchResultsInfo.style.display = 'block';
        }
        currentPage = 1;
        renderPosts();
        updatePaginationControls();
    }

    // Event Listeners

    // Campo de busca na homepage
    if (searchInputHomepage) {
        searchInputHomepage.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Impede o envio do formulário padrão
                const query = searchInputHomepage.value.trim();
                window.location.href = `/search/?q=${encodeURIComponent(query)}`;
            }
        });
         // Preencher o campo de busca se houver uma query na URL (para o caso de voltar/avançar no histórico)
         const initialQuery = getQueryParam('q');
         if (initialQuery) {
             searchInputHomepage.value = initialQuery;
         }
    }

    // Campo de busca na página de resultados (/search)
    if (searchInputPage) {
        // Preencher o campo de busca na página de resultados com a query da URL
        const initialQuery = getQueryParam('q');
        if (initialQuery) {
            searchInputPage.value = initialQuery;
        }

        // Lógica de busca ao digitar na página de resultados
        searchInputPage.addEventListener('keyup', function() {
            const query = searchInputPage.value.toLowerCase().trim();
            updateSearchUrl(query); // Atualiza a URL com a nova busca
            performSearch(query);
        });
    }

    // Listeners para os botões de paginação
    if (prevButton) prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
            updatePaginationControls();
        }
    });

    if (nextPageButton) nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
            updatePaginationControls();
        }
    });

    // Inicia o carregamento dos posts APENAS na página /search/
    if (window.location.pathname === '/search/') {
        const initialQuery = getQueryParam('q');
        fetchPosts(initialQuery ? initialQuery.toLowerCase() : ''); // Passa a query inicial para busca
    } else {
        // Para outras páginas que não /search/, se precisar renderizar algo sem busca, faça aqui
        // Por exemplo, na homepage, você não mostra posts paginados por padrão, mas pode querer outros elementos.
        // Para sua homepage atual, ela não tem um posts-container para renderizar nada, o que é OK.
    }
});
