// /assets/js/wizard.js - VERSÃO CORRIGIDA SEM O BOTÃO "COMEÇAR"

document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('simulador-card');
    if (!card) return;

    // --- SELEÇÃO DOS ELEMENTOS (SEU CÓDIGO ORIGINAL) ---
    const form = document.getElementById('simulacao-form');
    const profissao = document.getElementById('profissao');
    const postoGroup = document.getElementById('posto-group');
    const posto = document.getElementById('posto');
    const idade = document.getElementById('idade');
    const capital = document.getElementById('capital');
    const coverageList = document.querySelector('.coverage-list');
    const premioTotal = document.getElementById('premio-total');
    const btnInterest = document.getElementById('btn-mostrar-form-final');
    const contratacaoSection = document.getElementById('contratacao-section');
    const resumoHiddenInput = document.getElementById('form-final-resumo');

    // Esconde elementos originais que serão controlados pelo wizard
    form.style.display = 'none';
    if (coverageList) coverageList.style.display = 'none';
    if (premioTotal && premioTotal.parentElement) premioTotal.parentElement.style.display = 'none';
    if (btnInterest) btnInterest.style.display = 'none';

    // --- CRIAÇÃO DA ESTRUTURA DO WIZARD (SEU CÓDIGO ORIGINAL) ---
    const wizard = document.createElement('div');
    wizard.className = 'wizard';
    const progressWrap = document.createElement('div');
    progressWrap.className = 'wizard-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'bar';
    progressWrap.appendChild(progressBar);
    wizard.appendChild(progressWrap);
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'wizard-steps';
    wizard.appendChild(stepsContainer);
    
    // Helper para criar o passo
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

    // Helper para mover os campos do formulário
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

    // --- DEFINIÇÃO DOS PASSOS (SEM O PASSO 0) ---
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
    const s5 = createStep('Resumo da sua Proteção');
    stepsContainer.appendChild(s5.step);
    const resumoBlock = document.createElement('div');
    resumoBlock.className = 'resumo-block';
    resumoBlock.innerHTML = `
        <div style="margin-bottom:12px">Resumo da simulação:</div>
        <div id="wizard-summary" style="margin-bottom:12px"></div>
        <div class="premium" style="margin-bottom:12px">Prêmio Mensal: <strong id="wizard-premium">R$ 0,00</strong></div>
    `;
    s5.content.appendChild(resumoBlock);

    // --- LÓGICA DO WIZARD (AJUSTADA) ---
    const steps = Array.from(stepsContainer.children);
    const stepCount = steps.length;
    let currentStep = 0;

    function addNav(stepElement, idx) {
        const nav = document.createElement('div');
        nav.className = 'wizard-nav';
        
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'btn btn-secondary';
        back.textContent = 'Voltar';
        back.style.visibility = (idx === 0) ? 'hidden' : 'visible'; // Esconde o "Voltar" no primeiro passo
        back.addEventListener('click', () => goToStep(idx - 1));

        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'btn';
        next.textContent = (idx === stepCount - 1) ? 'Contratar' : 'Próximo';
        
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
    steps.forEach(addNav);

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
        if (idx === 0 && !profissao.value) { 
            alert('Selecione sua profissão para continuar.'); return false; 
        }
        if (idx === 1 && (!idade.value || idade.value < 16 || idade.value > 85)) { 
            alert('Informe uma idade válida (16 a 85).'); return false; 
        }
        if (idx === 2 && !capital.value) { 
            alert('Selecione o capital segurado.'); return false; 
        }
        return true;
    }

    function updateProgress() {
        const pct = Math.round(((currentStep) / (stepCount - 1)) * 100);
        progressBar.style.width = pct + '%';
    }

    // A sua função de cálculo original (mantida)
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

    const formatBRL = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

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
    }
    
    function finishWizard() {
        // ... (sua função finishWizard original, sem alterações) ...
        updateSummaryAndPremium();
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
            resumoHiddenInput.value = resumoText;
        }
        if (contratacaoSection) {
            contratacaoSection.classList.remove('hidden');
        }
        goToStep(stepCount - 1);
    }

    // --- INICIALIZAÇÃO DO WIZARD (LÓGICA ALTERADA) ---
    card.insertBefore(wizard, form);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('iniciar') === 'true') {
        goToStep(0); // Inicia direto na primeira pergunta se veio da index.html
    } else {
        // Caso o usuário acesse simulacao.html diretamente, também inicia na primeira pergunta
        goToStep(0);
    }

    // --- SEUS EVENT LISTENERS ORIGINAIS (MANTIDOS) ---
    profissao.addEventListener('change', () => {
        const val = profissao.value.toLowerCase();
        if (val.includes('policial') || val.includes('bombeiro') || val.includes('militar')) {
            postoGroup.classList.remove('hidden');
        } else {
            postoGroup.classList.add('hidden');
            posto.value = ''; 
        }
    });

    if (contratacaoSection) {
        contratacaoSection.addEventListener('click', (e) => {
            const cardEl = contratacaoSection.querySelector('#contratacao-card');
            if (cardEl && !cardEl.contains(e.target)) {
                contratacaoSection.classList.add('hidden');
            }
        });
    }
});