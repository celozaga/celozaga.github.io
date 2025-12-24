---
layout: default
title: Search
permalink: /search/
---

<h1>{{ page.title }}</h1>

<section class="search-results-section">
  <input type="text" id="search-input-page" class="input" placeholder="Pesquisar novamente...">
  <p id="search-results-info">Exibindo resultados para: "<span id="search-query"></span>"</p>
  <div id="posts-container" class="post-list">
    </div>
  <div class="pagination-controls">
    <button id="prev-page" class="btn" disabled>&laquo; Anterior</button>
    <span id="page-info">Página 1 de 1</span>
    <button id="next-page" class="btn" disabled>Próxima &raquo;</button>
  </div>
</section>
