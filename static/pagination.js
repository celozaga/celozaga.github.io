document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const prevButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    let allPosts = [];
    const postsPerPage = 10; // Número de posts por página, ajustável
    let currentPage = 1;

    function fetchPosts() {
        fetch('/posts_data.json') // Caminho para o JSON gerado pelo Jekyll
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Ordene os posts do mais novo para o mais antigo (data decrescente)
                allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                renderPosts();
                updatePaginationControls();
            })
            .catch(error => {
                console.error('Erro ao carregar posts:', error);
                postsContainer.innerHTML = '<p>Erro ao carregar posts. Verifique o console para detalhes.</p>';
            });
    }

    function renderPosts() {
        postsContainer.innerHTML = ''; // Limpa o container
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = allPosts.slice(startIndex, endIndex);

        const ul = document.createElement('ul');
        if (postsToShow.length === 0 && allPosts.length > 0) {
             // Caso esteja em uma página muito alta sem posts, volta para a última página válida
            currentPage = Math.ceil(allPosts.length / postsPerPage);
            if (currentPage < 1) currentPage = 1; // Garante que não vá para página 0
            renderPosts();
            return;
        } else if (allPosts.length === 0) {
            ul.innerHTML = '<p>Nenhum post encontrado.</p>';
        }

        postsToShow.forEach(post => {
            const li = document.createElement('li');
            // Use relative_url se os links do JSON já não forem relativos
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
        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        prevButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages || allPosts.length === 0;

        // Mostra/esconde os botões e info da página
        if (allPosts.length <= postsPerPage) { // Se todos os posts cabem em uma página
            prevButton.style.display = 'none';
            nextPageButton.style.display = 'none';
            pageInfo.style.display = 'none';
        } else {
            prevButton.style.display = '';
            nextPageButton.style.display = '';
            pageInfo.style.display = '';
        }
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
            updatePaginationControls();
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
            updatePaginationControls();
        }
    });

    // Inicia o carregamento dos posts quando a página é carregada
    fetchPosts();
});
