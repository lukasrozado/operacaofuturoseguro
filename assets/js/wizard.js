document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('simulador-card');
  if (!card) return;

  const form = document.getElementById('simulacao-form');
  const profissao = document.getElementById('profissao');
  const postoGroup = document.getElementById('posto-group');
  const posto = document.getElementById('posto');
  const idade = document.getElementById('idade');
  const capital = document.getElementById('capital');
  const coverageList = document.querySelector('.coverage-list');
  const premioTotal = document.getElementById('premio-total');
  const btnInterest = document.getElementById('btn-mostrar-form-final');

  // modal de contratação
  const contratacaoSection = document.getElementById('contratacao-section');
  const resumoHiddenInput = document.getElementById('form-final-resumo');

  // esconde elementos originais que iremos controlar via wizard
  form.style.display = 'none';
  if (coverageList) coverageList.style.display = 'none';
  if (premioTotal && premioTotal.parentElement) premioTotal.parentElement.style.display = 'none';
  if (btnInterest) btnInterest.style.display = 'none';

  // cria wrapper wizard
  const wizard = document.createElement('div');
  wizard.className = 'wizard';

  // progresso
  const progressWrap = document.createElement('div');
  progressWrap.className = 'wizard-progress';
  const progressBar = document.createElement('div');
  progressBar.className = 'bar';
  progressWrap.appendChild(progressBar);
  wizard.appendChild(progressWrap);

  // elementos existentes
  const titulo = card.querySelector('h2');
  const subtitulo = card.querySelector('.card-subtitle');

  // evita duplicar o subtítulo (esconde o original no card)
  if (subtitulo) subtitulo.style.display = 'none';

  // container steps
  const stepsContainer = document.createElement('div');
  stepsContainer.className = 'wizard-steps';
  wizard.appendChild(stepsContainer);

  function createStep(titleHtml = '') {
    const step = document.createElement('div');
    step.className = 'wizard-step';
    if (titleHtml) {
      const h = document.createElement('h3');
      h.innerHTML = titleHtml;
      h.style.marginBottom = '12px';
      step.appendChild(h);
    }
    const content = document.createElement('div');
    content.className = 'wizard-content';
    step.appendChild(content);
    return { step, content };
  }

  // STEP 0 - Intro / CTA
  const s0 = createStep('');
  s0.content.innerHTML = `
    <p class="card-subtitle" style="margin-bottom:18px">${subtitulo ? subtitulo.textContent : 'Responda rápido para ver o valor.'}</p>
    <button class="btn" id="wizard-start">Começar</button>
  `;
  stepsContainer.appendChild(s0.step);

  // STEP 1 - Profissão
  const s1 = createStep('Qual é a sua profissão?');
  stepsContainer.appendChild(s1.step);
  s1.content.appendChild(createFieldWrapper('profession-wrapper', profissao));
  s1.content.appendChild(createFieldWrapper('posto-wrapper', postoGroup));

  // STEP 2 - Idade
  const s2 = createStep('Qual a sua idade?');
  stepsContainer.appendChild(s2.step);
  s2.content.appendChild(createFieldWrapper('idade-wrapper', idade));

  // STEP 3 - Capital
  const s3 = createStep('Escolha o capital segurado (morte)');
  stepsContainer.appendChild(s3.step);
  s3.content.appendChild(createFieldWrapper('capital-wrapper', capital));

  // STEP 4 - Coberturas
  const s4 = createStep('Personalize suas coberturas (opcional)');
  stepsContainer.appendChild(s4.step);
  s4.content.appendChild(createFieldWrapper('coverage-wrapper', coverageList));

  // STEP 5 - Resumo
  const s5 = createStep('Resumo');
  stepsContainer.appendChild(s5.step);
  const resumoBlock = document.createElement('div');
  resumoBlock.className = 'resumo-block';
  resumoBlock.innerHTML = `
    <div style="margin-bottom:12px">Resumo da simulação:</div>
    <div id="wizard-summary" style="margin-bottom:12px"></div>
    <div class="premium" style="margin-bottom:12px">Prêmio Mensal: <strong id="wizard-premium">R$ 0,00</strong></div>
  `;
  s5.content.appendChild(resumoBlock);

  // helper cria wrapper e move node existente para dentro
  function createFieldWrapper(id, node) {
    const wrapper = document.createElement('div');
    wrapper.id = id;
    if (node) {
      node.style.display = '';
      wrapper.appendChild(node);
    }
    wrapper.style.marginBottom = '8px';
    return wrapper;
  }

  // Steps array
  const steps = Array.from(stepsContainer.children);
  const stepCount = steps.length;
  let currentStep = 0;

  // adiciona nav (NEXT/BACK) apenas para steps 1..N-1 (não adiciona para step 0)
  function addNav(stepElement, idx) {
    if (idx === 0) return; // não adiciona nav no intro
    const nav = document.createElement('div');
    nav.className = 'wizard-nav';
    const back = document.createElement('button');
    back.className = 'btn btn-secondary';
    back.textContent = 'Voltar';
    back.addEventListener('click', () => goToStep(idx - 1));
    const next = document.createElement('button');
    next.className = 'btn';
    next.textContent = (idx === stepCount - 1) ? 'Finalizar' : 'Próximo';
    next.addEventListener('click', () => {
      if (idx === stepCount - 1) {
        finishWizard();
      } else {
        if (!validateStep(idx)) return;
        goToStep(idx + 1);
      }
    });
    nav.appendChild(back);
    nav.appendChild(next);
    stepElement.appendChild(nav);
  }

  // adiciona navs (começando do idx 1)
  steps.forEach((st, i) => addNav(st, i));

  // start button handler
  stepsContainer.querySelector('#wizard-start').addEventListener('click', () => goToStep(1));

  function goToStep(i) {
    if (i < 0 || i >= stepCount) return;
    steps.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
    });
    currentStep = i;
    updateProgress();
    if (i === stepCount - 1) updateSummaryAndPremium();
  }

  function validateStep(idx) {
    // valida o step anterior ao avançar (idx é o índice atual do step que possui nav)
    if (idx === 1) { // antes de ir ao passo 2, validar profissão
      if (!profissao.value) { alert('Selecione sua profissão para continuar.'); return false; }
    }
    if (idx === 2) {
      if (!idade.value || idade.value < 16 || idade.value > 100) { alert('Informe uma idade válida (16 - 100).'); return false; }
    }
    if (idx === 3) {
      if (!capital.value) { alert('Selecione o capital segurado.'); return false; }
    }
    return true;
  }

  function updateProgress() {
    const pct = Math.round(((currentStep) / (stepCount - 1)) * 100);
    progressBar.style.width = pct + '%';
  }

  function calcPremium() {
    const cap = Number(capital.value) || 300000;
    const age = Number(idade.value) || 35;
    let base = cap * 0.00045;
    const ageFactor = 1 + Math.max(0, (age - 30)) * 0.01;
    base = base * ageFactor;
    let extras = 0;
    const cipa = document.getElementById('cobertura-ipa');
    const cifpd = document.getElementById('cobertura-ifpd');
    const cfun = document.getElementById('cobertura-funeral');
    if (cipa && cipa.checked) extras += 0.1;
    if (cifpd && cifpd.checked) extras += 0.1;
    if (cfun && cfun.checked) extras += 0.02;
    const total = base * (1 + extras);
    return Math.max(0, Math.round(total));
  }

  function formatBRL(n) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }

  function updateSummaryAndPremium() {
    const summaryEl = document.getElementById('wizard-summary');
    const premiumEl = document.getElementById('wizard-premium');
    const prof = profissao.options[profissao.selectedIndex]?.text || '';
    const postotxt = (posto && posto.value) ? posto.value : '';
    const idadetxt = idade.value || '';
    const captxt = capital.options[capital.selectedIndex]?.text || '';
    const coverages = [];
    const cipa = document.getElementById('cobertura-ipa');
    const cifpd = document.getElementById('cobertura-ifpd');
    const cfun = document.getElementById('cobertura-funeral');
    if (cipa && cipa.checked) coverages.push('IPA');
    if (cifpd && cifpd.checked) coverages.push('IFPD');
    if (cfun && cfun.checked) coverages.push('Funeral');
    const html = `
      <strong>Profissão:</strong> ${prof}${postotxt ? ' — ' + postotxt : ''}<br>
      <strong>Idade:</strong> ${idadetxt}<br>
      <strong>Capital:</strong> ${captxt}<br>
      <strong>Coberturas escolhidas:</strong> ${coverages.length ? coverages.join(', ') : 'Nenhuma adicional'}
    `;
    if (summaryEl) summaryEl.innerHTML = html;
    const p = calcPremium();
    if (premiumEl) premiumEl.textContent = formatBRL(p);
    if (premioTotal) premioTotal.textContent = formatBRL(p);
  }

  /* -----------------------
     Aqui: ao finalizar, ABRIMOS O MODAL de contratação
     ----------------------- */
  function finishWizard() {
    // última validação (garante capital válido)
    if (!validateStep(3)) { goToStep(3); return; }

    // atualiza resumo e prêmio
    updateSummaryAndPremium();

    // monta texto resumido para o input escondido do formulário
    const prof = profissao.options[profissao.selectedIndex]?.text || '';
    const postotxt = (posto && posto.value) ? posto.value : '';
    const idadetxt = idade.value || '';
    const captxt = capital.options[capital.selectedIndex]?.text || '';
    const coverages = [];
    const cipa = document.getElementById('cobertura-ipa');
    const cifpd = document.getElementById('cobertura-ifpd');
    const cfun = document.getElementById('cobertura-funeral');
    if (cipa && cipa.checked) coverages.push('IPA');
    if (cifpd && cifpd.checked) coverages.push('IFPD');
    if (cfun && cfun.checked) coverages.push('Funeral');
    const premium = calcPremium();

    const resumoText = `Profissão: ${prof}${postotxt ? ' — ' + postotxt : ''} | Idade: ${idadetxt} | Capital: ${captxt} | Coberturas: ${coverages.length ? coverages.join(', ') : 'Nenhuma'} | Prêmio: ${formatBRL(premium)}`;

    if (resumoHiddenInput) {
      resumoHiddenInput.value = resumoText; // preenche o campo escondido do form para envio
    }

    // ABRIR modal de contratação (remove classe 'hidden')
    if (contratacaoSection) {
      contratacaoSection.classList.remove('hidden');
      // opcional: desabilita scroll do fundo
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // foco no primeiro input do modal
      setTimeout(() => {
        const firstInput = contratacaoSection.querySelector('input[name="Nome Completo"], input[type="text"], input:not([type])');
        if (firstInput) firstInput.focus();
      }, 150);
    }

    // Navega para o último passo visual do wizard (resumo)
    goToStep(stepCount - 1);
  }

  // insere wizard no DOM antes do form original
  card.insertBefore(wizard, form);

  // inicia no passo 0
  goToStep(0);

  // lógica para mostrar/ocultar posto ao mudar profissão
  profissao.addEventListener('change', () => {
    const val = profissao.value.toLowerCase();
    if (val.includes('policial') || val.includes('bombeiro') || val.includes('militar')) {
      postoGroup.classList.remove('hidden');
    } else {
      postoGroup.classList.add('hidden');
    }
  });

  // recalcula premio automaticamente quando algo mudar
  [profissao, posto, idade, capital].forEach(el => {
    if (!el) return;
    el.addEventListener('change', () => {
      const p = calcPremium();
      if (premioTotal) premioTotal.textContent = formatBRL(p);
    });
  });

  /* Fecha modal ao clicar fora do card (útil para testes) */
  if (contratacaoSection) {
    contratacaoSection.addEventListener('click', (e) => {
      const cardEl = contratacaoSection.querySelector('#contratacao-card');
      if (!cardEl) return;
      if (!cardEl.contains(e.target)) {
        // fecha
        contratacaoSection.classList.add('hidden');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    });
  }

});
