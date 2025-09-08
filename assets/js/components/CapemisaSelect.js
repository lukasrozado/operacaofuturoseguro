class CapemisaSelect {
  constructor(elementId, options) {
    this.root = document.getElementById(elementId);
    if (!this.root) return;
    
    this.options = options;
    this.filteredOptions = options.slice();
    this.isOpen = false;
    this.focusIndex = -1;

    // Mapeia os elementos internos para fácil acesso
    this.elements = {
      header: this.root.querySelector('.cs-header'),
      panel: this.root.querySelector('.cs-panel'),
      filter: this.root.querySelector('.cs-filter'),
      list: this.root.querySelector('.cs-items'),
      hiddenInput: document.getElementById(this.root.id.replace('seletor-', '')),
      displayValue: this.root.querySelector('.cs-value'),
    };
    
    this.elements.header.setAttribute('aria-controls', this.elements.list.id || (this.elements.list.id = `${elementId}-list`));
    this.addEventListeners();
  }

  addEventListeners() {
    this.elements.header.addEventListener('click', () => this.togglePanel());
    this.elements.filter.addEventListener('input', () => this.filterItems());

    // Delegação de eventos
    this.elements.list.addEventListener('click', (e) => {
      if (e.target && e.target.nodeName === 'LI' && e.target.dataset.index) {
        this.chooseItem(parseInt(e.target.dataset.index, 10));
      }
    });

    this.elements.list.addEventListener('mousemove', (e) => {
        if (e.target && e.target.nodeName === 'LI' && e.target.dataset.index) {
            this.setFocus(parseInt(e.target.dataset.index, 10));
        }
    });

    // Eventos do teclado
    this.root.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('click', (e) => {
      if (!this.root.contains(e.target)) this.closePanel();
    });
  }

  buildList() {
    this.elements.list.innerHTML = '';
    if (this.filteredOptions.length === 0) {
      this.elements.list.innerHTML = `<li class="cs-nores">Nenhuma opção</li>`;
      return;
    }
    this.filteredOptions.forEach((text, i) => {
      const li = document.createElement('li');
      li.textContent = text;
      li.dataset.index = i;
      li.setAttribute('role', 'option');
      this.elements.list.appendChild(li);
    });
    this.updateFocus();
  }
  
  togglePanel() { this.isOpen ? this.closePanel() : this.openPanel(); }
  
  openPanel() {
    this.isOpen = true;
    this.elements.panel.hidden = false;
    this.elements.header.setAttribute('aria-expanded', 'true');
    this.elements.filter.value = '';
    this.filteredOptions = this.options.slice();
    this.buildList();
    this.elements.filter.focus();
  }

  closePanel() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.elements.panel.hidden = true;
    this.elements.header.setAttribute('aria-expanded', 'false');
    this.focusIndex = -1;
    this.clearFocus();
  }

  chooseItem(index) {
    const value = this.filteredOptions[index];
    this.elements.displayValue.textContent = value;
    if(this.elements.hiddenInput) this.elements.hiddenInput.value = value;
    
    Array.from(this.elements.list.children).forEach(li => li.removeAttribute('aria-selected'));
    if(this.elements.list.children[index]) this.elements.list.children[index].setAttribute('aria-selected', 'true');
    
    this.closePanel();
    this.elements.header.focus();
  }
  
  filterItems() {
    const query = this.elements.filter.value.trim().toLowerCase();
    this.filteredOptions = this.options.filter(o => o.toLowerCase().includes(query));
    this.focusIndex = 0;
    this.buildList();
  }

  setFocus(index) {
      if(this.focusIndex === index) return;
      this.focusIndex = index;
      this.updateFocus();
  }

  updateFocus() {
    this.clearFocus();
    if (this.focusIndex >= 0 && this.elements.list.children[this.focusIndex]) {
      const focusedEl = this.elements.list.children[this.focusIndex];
      focusedEl.classList.add('focused');
      focusedEl.scrollIntoView({ block: 'nearest' });
    }
  }
  
  clearFocus() { Array.from(this.elements.list.children).forEach(li => li.classList.remove('focused')); }

  handleKeyDown(e) {
    if (e.key === ' ' && document.activeElement === this.elements.header) { e.preventDefault(); this.togglePanel(); }
    if (e.key === 'Enter' && document.activeElement === this.elements.header) { this.togglePanel(); }

    if (!this.isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusIndex = Math.min(this.filteredOptions.length - 1, this.focusIndex + 1);
        this.updateFocus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusIndex = Math.max(0, this.focusIndex - 1);
        this.updateFocus();
        break;
      case 'Enter':
        e.preventDefault();
        if (this.filteredOptions.length > 0 && this.focusIndex >= 0) {
          this.chooseItem(this.focusIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.closePanel();
        this.elements.header.focus();
        break;
    }
  }
}

// Inicializa o componente
document.addEventListener('DOMContentLoaded', () => {
  const sportOptions = [
    "Nenhuma", "Air Race","Alpinismo","Artes marciais e demais lutas","Automobilismo",
    "Balonismo","Base jumping","Bungee jumping","Ciclismo","Corrida",
    "Escalada","Natação","Parapente","Paraquedismo","Tiro esportivo","Vela"
  ];
  
  // Cria uma nova instância do seletor.
  // Para criar outra, basta chamar a linha abaixo com um novo ID e novas opções.
  new CapemisaSelect('seletor-atividade', sportOptions);
});
