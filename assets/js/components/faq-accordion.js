export function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return; // Não faz nada se não houver FAQ na página

    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            
            // Fecha outros itens abertos antes de abrir o novo
            faqItems.forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });

            // Abre ou fecha o item clicado
            faqItem.classList.toggle('active');
        });
    });
}