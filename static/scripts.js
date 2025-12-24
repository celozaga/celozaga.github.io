// ======================
// Função para alternar seções e tabs
// ======================

/**
 * Mostra a seção correspondente e marca a tab clicada como ativa.
 * @param {Event} event - O evento de clique.
 * @param {string} sectionId - O ID da seção a ser exibida.
 */
function showSection(event, sectionId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove a classe 'active' de todas as tabs
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Exibe a seção desejada
    document.getElementById(sectionId).classList.add('active');

    // Marca a tab clicada como ativa
    event.currentTarget.classList.add('active');
}

/**
 * Alterna a visibilidade do menu lateral e do overlay.
 */
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    sideMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

