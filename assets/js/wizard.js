// /assets/js/wizard.js - VERSÃO COMPLETA COM CPF E CEP

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
        const profissaoSelecionada = profissao.value;
        // Encontra o campo de "Ocupação Principal" no formulário final
        const ocupacaoFinalInput = document.getElementById('ocupacao-final');
        if (ocupacaoFinalInput) {
              // Preenche o campo com o valor
              ocupacaoFinalInput.value = profissaoSelecionada;
              // Torna o campo somente leitura (bloqueado)
              ocupacaoFinalInput.readOnly = true;
              // Adiciona um estilo visual para indicar que está bloqueado
              ocupacaoFinalInput.style.backgroundColor = '#e9ecef';
              ocupacaoFinalInput.style.cursor = 'not-allowed';
          }
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

    // ==================================================================
    //  NOVA LÓGICA INTEGRADA PARA O FORMULÁRIO FINAL (CPF E CEP)
    // ==================================================================
    
    const finalForm = document.getElementById('final-form');
    const cpfInput = document.getElementById('cpf-final');
    const cepInput = document.getElementById('cep-final');
    const ruaInput = document.getElementById('rua-final');
    const bairroInput = document.getElementById('bairro-final');
    const cidadeInput = document.getElementById('cidade-final');
    const ufInput = document.getElementById('uf-final');

    // --- LÓGICA DA MÁSCARA E VALIDAÇÃO DE CPF ---
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value.slice(0, 14);
        });
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    // --- LÓGICA DA BUSCA DE ENDEREÇO POR CEP ---
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value.slice(0, 9);
            if (value.length === 9) {
                buscarCEP(value);
            }
        });
    }

    const buscarCEP = async (cep) => {
        const cepLimpo = cep.replace(/\D/g, '');
        const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
        try {
            cepInput.style.cursor = 'wait'; // Mostra que está carregando
            const response = await fetch(url);
            const data = await response.json();
            cepInput.style.cursor = 'default';

            if (data.erro) {
                alert('CEP não encontrado. Verifique o número digitado.');
                return;
            }
            ruaInput.value = data.logradouro;
            bairroInput.value = data.bairro;
            cidadeInput.value = data.localidade;
            ufInput.value = data.uf;
            document.getElementById('numero-final').focus();
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Não foi possível buscar o CEP. Tente novamente.');
            cepInput.style.cursor = 'default';
        }
    };

    // --- VALIDAÇÃO GERAL DO FORMULÁRIO ANTES DO ENVIO ---
    if (finalForm) {
        finalForm.addEventListener('submit', (e) => {
            // 1. Valida o CPF
            if (cpfInput && !validarCPF(cpfInput.value)) {
                e.preventDefault(); // Impede o envio
                alert('Por favor, insira um CPF válido.');
                cpfInput.focus();
                cpfInput.style.borderColor = 'red';
                setTimeout(() => { cpfInput.style.borderColor = ''; }, 3000);
            }
        });
    }
});