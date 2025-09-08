import { initFaqAccordion } from './components/faq-accordion.js';

/**
 * Carrega um componente HTML de uma URL e o insere em um elemento da página.
 * @param {string} elementId O ID do elemento onde o componente será inserido.
 * @param {string} url O caminho para o arquivo .html do componente.
 */
const loadComponent = (elementId, url) => {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Erro ao carregar: ${url}`);
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            }
        })
        .catch(error => console.error(error));
};

// Quando o DOM estiver completamente carregado, executa as funções.
document.addEventListener("DOMContentLoaded", () => {
    // Carrega os componentes reutilizáveis
    loadComponent("main-header", "components/header.html");
    loadComponent("main-footer", "components/footer.html");
    loadComponent("main-social", "components/social.html");

    // Inicializa as funcionalidades da página
    initFaqAccordion();
    // Você pode criar e chamar aqui a função para o lazy-loading também
});