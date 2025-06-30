```liquid
        ---
        layout: default
        title: Latest Posts
        permalink: /posts/ # Mantenha este permalink
        ---

        <h1>{{ page.title }}</h1>

        <div class="post-list">
          <ul>
          {% for post in paginator.posts %}
            <li>
              <a href="{{ post.url | relative_url }}">{{ post.title }}
              <small>— {{ post.date | date: "%d %b %Y" }}</small>
              </a>
            </li>
          {% endfor %}
          </ul>
        </div>

        <div class="pagination">
          {% if paginator.previous_page %}
            <a href="{{ paginator.previous_page_path | relative_url }}" class="previous-page">&laquo; Anterior</a>
          {% else %}
            <span class="previous-page disabled">&laquo; Anterior</span>
          {% endif %}

          <span class="page_number ">Página {{ paginator.page }} de {{ paginator.total_pages }}</span>

          {% if paginator.next_page %}
            <a href="{{ paginator.next_page_path | relative_url }}" class="next-page">Próxima &raquo;</a>
          {% else %}
            <span class="next-page disabled">Próxima &raquo;</span>
          {% endif %}
        </div>
        ```
      * O `permalink: /posts/` combinado com o arquivo `index.md` dentro do diretório `posts/` fará com que a primeira página da paginação seja `https://celozaga.github.io/posts/`. As páginas subsequentes serão `https://celozaga.github.io/posts/page2/`, etc., conforme configurado no `_config.yml`.

5.  **Confirme o `_config.yml`:**

      * Certifique-se de que seu `_config.yml` ainda tem a configuração de paginação correta:
        ```yaml
        # ... (seu conteúdo existente)
        plugins:
          - jekyll-sitemap
          - jekyll-paginate

        # Configurações de Paginação
        paginate: 10 # Ou o número de posts por página que desejar
        paginate_path: "/posts/page:num/"
        ```
