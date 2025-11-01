document.addEventListener("DOMContentLoaded", () => {
    const card = document.getElementById("simulador-card");
    if (!card) return;
    const form = document.getElementById("simulacao-form");
    const profissao = document.getElementById("profissao");
    const postoGroup = document.getElementById("posto-group");
    const posto = document.getElementById("posto");
    const idade = document.getElementById("idade");
    const capital = document.getElementById("capital");
    const coverageList = document.querySelector(".coverage-list");
    const premioTotal = document.getElementById("premio-total");
    const btnInterest = document.getElementById("btn-mostrar-form-final");
    const contratacaoSection = document.getElementById("contratacao-section");
    const resumoHiddenInput = document.getElementById("form-final-resumo");
    
    const todasOpcoesCapital = [
        { value: "100000", text: "R$ 100.000,00" },
        { value: "200000", text: "R$ 200.000,00" },
        { value: "300000", text: "R$ 300.000,00" },
        { value: "500000", text: "R$ 500.000,00" },
        { value: "750000", text: "R$ 750.000,00" },
        { value: "1000000", text: "R$ 1.000.000,00" },
        { value: "1500000", text: "R$ 1.500.000,00" },
        { value: "2000000", text: "R$ 2.000.000,00" },
        { value: "3000000", text: "R$ 3.000.000,00" },
    ];

    function atualizarOpcoesCapital(limiteMaximo) {
        const valorSelecionadoAnteriormente = capital.value;
        capital.innerHTML = "";
        const opcoesFiltradas = todasOpcoesCapital.filter((opcao) => parseInt(opcao.value) <= limiteMaximo);
        opcoesFiltradas.forEach((opt) => {
            const optionElement = document.createElement("option");
            optionElement.value = opt.value;
            optionElement.textContent = opt.text;
            capital.appendChild(optionElement);
        });
        if (opcoesFiltradas.some((opt) => opt.value === valorSelecionadoAnteriormente)) {
            capital.value = valorSelecionadoAnteriormente;
        } else {
            capital.value = opcoesFiltradas.length > 0 ? opcoesFiltradas[opcoesFiltradas.length - 1].value : "";
        }
    }

    function aplicarRegrasDeCapital() {
        const profissaoVal = profissao.value;
        const postoVal = posto.value;
        if (profissaoVal === "Guarda civil" || postoVal === "Soldado" || postoVal === "Cabo") {
            atualizarOpcoesCapital(500000);
        } else if (
            postoVal === "Tenente coronel" ||
            postoVal === "Coronel" ||
            postoVal === "Major" ||
            profissaoVal === "Policial Federal"
        ) {
            atualizarOpcoesCapital(3000000);
        } else if (profissaoVal === "Policial Rodoviário Federal") {
            atualizarOpcoesCapital(2000000);
        } else {
            atualizarOpcoesCapital(1000000);
        }
    }

    // CORREÇÃO: Nova função calcPremium usando TABELA_PRECOS
    function calcPremium() {
        const capitalMorte = Number(capital.value) || 300000;
        const age = Number(idade.value) || 35;
        
        // Verificar se idade está dentro dos limites suportados
        if (age < 16 || age > 85) {
            return 0;
        }

        let total = 0;

        // 1. Prêmio de Morte
        const ageKeyMorte = age.toString();
        if (TABELA_PRECOS.morte[ageKeyMorte] && TABELA_PRECOS.morte[ageKeyMorte][capitalMorte]) {
            total += TABELA_PRECOS.morte[ageKeyMorte][capitalMorte];
        }

        // 2. Prêmio de IPA (se marcado)
        const cipa = document.getElementById("cobertura-ipa");
        if (cipa && cipa.checked) {
            const capitalInvalidez = Math.min(capitalMorte, 1000000);
            
            // Determinar faixa etária para IPA
            let faixaEtaria;
            if (age >= 16 && age <= 60) {
                faixaEtaria = "16-60";
            } else if (age >= 61 && age <= 69) {
                faixaEtaria = "61-69";
            } else if (age >= 70 && age <= 75) {
                faixaEtaria = "70-75";
            } else if (age >= 76 && age <= 80) {
                faixaEtaria = "76-80";
            } else {
                faixaEtaria = "81-85";
            }

            if (TABELA_PRECOS.ipa[faixaEtaria] && TABELA_PRECOS.ipa[faixaEtaria][capitalInvalidez]) {
                total += TABELA_PRECOS.ipa[faixaEtaria][capitalInvalidez];
            }
        }

        // 3. Prêmio de IFPD (se marcado)
        const cifpd = document.getElementById("cobertura-ifpd");
        if (cifpd && cifpd.checked) {
            const capitalInvalidez = Math.min(capitalMorte, 1000000);
            const ageKeyIFPD = age.toString();
            
            if (TABELA_PRECOS.ifpd[ageKeyIFPD] && TABELA_PRECOS.ifpd[ageKeyIFPD][capitalInvalidez]) {
                total += TABELA_PRECOS.ifpd[ageKeyIFPD][capitalInvalidez];
            }
        }

        // 4. Prêmio de Funeral (se marcado)
        const cfun = document.getElementById("cobertura-funeral");
        if (cfun && cfun.checked) {
            const ageKeyFuneral = age.toString();
            const capitalFuneral = 7000; // Capital fixo para Funeral
            
            if (TABELA_PRECOS.funeral[ageKeyFuneral] && TABELA_PRECOS.funeral[ageKeyFuneral][capitalFuneral]) {
                total += TABELA_PRECOS.funeral[ageKeyFuneral][capitalFuneral];
            }
        }

        return total;
    }

    // CORREÇÃO: Função para determinar faixa etária (usada na UI)
    function getFaixaEtaria(age) {
        if (age >= 16 && age <= 60) return "16-60";
        if (age >= 61 && age <= 69) return "61-69";
        if (age >= 70 && age <= 75) return "70-75";
        if (age >= 76 && age <= 80) return "76-80";
        if (age >= 81 && age <= 85) return "81-85";
        return "16-60";
    }

    // CORREÇÃO: Função atualizada para mostrar capital limitado na UI
    function updateSummaryAndPremium() {
        const summaryEl = document.getElementById("wizard-summary");
        const premiumEl = document.getElementById("wizard-premium");
        const prof = profissao.options[profissao.selectedIndex]?.text || "";
        const postotxt = posto && posto.value ? posto.value : "";
        const idadetxt = idade.value || "";
        const capitalMorte = Number(capital.value) || 300000;
        const captxt = capital.options[capital.selectedIndex]?.text || "";
        const capitalInvalidez = Math.min(capitalMorte, 1000000);
        const capitalInvalidezTxt = formatBRL(capitalInvalidez);

        const coverages = [];
        const cipa = document.getElementById("cobertura-ipa");
        const cifpd = document.getElementById("cobertura-ifpd");
        const cfun = document.getElementById("cobertura-funeral");
        
        if (cipa && cipa.checked) coverages.push(`IPA (${capitalInvalidezTxt})`);
        if (cifpd && cifpd.checked) coverages.push(`IFPD (${capitalInvalidezTxt})`);
        if (cfun && cfun.checked) coverages.push("Funeral (R$ 7.000,00)");

        // CORREÇÃO: Atualizar valores na etapa 4 (coberturas)
        const valorIpa = document.getElementById("valor-ipa");
        const valorIfpd = document.getElementById("valor-ifpd");
        if (valorIpa) valorIpa.textContent = capitalInvalidezTxt;
        if (valorIfpd) valorIfpd.textContent = capitalInvalidezTxt;

        const html = `
            <strong>Profissão:</strong> ${prof}${postotxt ? " — " + postotxt : ""}<br>
            <strong>Idade:</strong> ${idadetxt}<br>
            <strong>Capital (Morte):</strong> ${captxt}<br>
            <strong>Capital (IPA/IFPD):</strong> ${capitalInvalidezTxt}<br>
            <strong>Coberturas escolhidas:</strong> ${coverages.length ? coverages.join(", ") : "Nenhuma adicional"}
        `;
        if (summaryEl) summaryEl.innerHTML = html;

        const p = calcPremium();
        if (premiumEl) premiumEl.textContent = formatBRL(p);
    }

    const formatBRL = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

    form.style.display = "none";
    if (coverageList) coverageList.style.display = "none";
    if (premioTotal && premioTotal.parentElement) premioTotal.parentElement.style.display = "none";
    if (btnInterest) btnInterest.style.display = "none";

    const wizard = document.createElement("div");
    wizard.className = "wizard";
    const progressWrap = document.createElement("div");
    progressWrap.className = "wizard-progress";
    const progressBar = document.createElement("div");
    progressBar.className = "bar";
    progressWrap.appendChild(progressBar);
    wizard.appendChild(progressWrap);

    const stepsContainer = document.createElement("div");
    stepsContainer.className = "wizard-steps";
    wizard.appendChild(stepsContainer);

    function createStep(titleHtml = "") {
        const step = document.createElement("div");
        step.className = "wizard-step";
        if (titleHtml) {
            const h = document.createElement("h3");
            h.innerHTML = titleHtml;
            h.style.marginBottom = "12px";
            step.appendChild(h);
        }
        const content = document.createElement("div");
        content.className = "wizard-content";
        step.appendChild(content);
        return { step, content };
    }

    function createFieldWrapper(id, node) {
        const wrapper = document.createElement("div");
        wrapper.id = id;
        if (node) {
            node.style.display = "";
            wrapper.appendChild(node);
        }
        wrapper.style.marginBottom = "8px";
        return wrapper;
    }

    const s1 = createStep("Qual é a sua profissão?");
    stepsContainer.appendChild(s1.step);
    s1.content.appendChild(createFieldWrapper("profession-wrapper", profissao));
    s1.content.appendChild(createFieldWrapper("posto-wrapper", postoGroup));

    const s2 = createStep("Qual a sua idade?");
    stepsContainer.appendChild(s2.step);
    s2.content.appendChild(createFieldWrapper("idade-wrapper", idade));

    const s3 = createStep("Escolha o capital segurado (morte)");
    stepsContainer.appendChild(s3.step);
    s3.content.appendChild(createFieldWrapper("capital-wrapper", capital));

    const s4 = createStep("Personalize suas coberturas (opcional)");
    stepsContainer.appendChild(s4.step);
    s4.content.appendChild(createFieldWrapper("coverage-wrapper", coverageList));

    const s5 = createStep("Resumo da sua Proteção");
    stepsContainer.appendChild(s5.step);
    const resumoBlock = document.createElement("div");
    resumoBlock.className = "resumo-block";
    resumoBlock.innerHTML = `
        <div style="margin-bottom:12px">Resumo da simulação:</div>
        <div id="wizard-summary" style="margin-bottom:12px"></div>
        <div class="premium" style="margin-bottom:12px">Prêmio Mensal: <strong id="wizard-premium">R$ 0,00</strong></div>
    `;
    s5.content.appendChild(resumoBlock);

    const steps = Array.from(stepsContainer.children);
    const stepCount = steps.length;
    let currentStep = 0;

    function addNav(stepElement, idx) {
        const nav = document.createElement("div");
        nav.className = "wizard-nav";
        const back = document.createElement("button");
        back.type = "button";
        back.className = "btn btn-secondary";
        back.textContent = "Voltar";
        back.style.visibility = idx === 0 ? "hidden" : "visible";
        back.addEventListener("click", () => goToStep(idx - 1));
        const next = document.createElement("button");
        next.type = "button";
        next.className = "btn";
        next.textContent = idx === stepCount - 1 ? "Contratar" : "Próximo";
        next.addEventListener("click", () => {
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

    // CORREÇÃO: goToStep atualizado para chamar updateSummaryAndPremium em todas as etapas
    function goToStep(i) {
        if (i < 0 || i >= stepCount) return;
        if (i === 2) {
            aplicarRegrasDeCapital();
        }
        steps.forEach((s, idx) => {
            s.classList.toggle("active", idx === i);
        });
        currentStep = i;
        updateProgress();
        // CORREÇÃO: Atualizar sempre, não apenas na última etapa
        updateSummaryAndPremium();
    }

    function validateStep(idx) {
        if (idx === 0 && !profissao.value) {
            alert("Selecione sua profissão para continuar.");
            return !1;
        }
        if (idx === 1 && (!idade.value || idade.value < 16 || idade.value > 85)) {
            alert("Informe uma idade válida (16 a 85).");
            return !1;
        }
        if (idx === 2 && !capital.value) {
            alert("Selecione o capital segurado.");
            return !1;
        }
        return !0;
    }

    function updateProgress() {
        const pct = Math.round((currentStep / (stepCount - 1)) * 100);
        progressBar.style.width = pct + "%";
    }

    function finishWizard() {
        updateSummaryAndPremium();
        const prof = profissao.options[profissao.selectedIndex]?.text || "";
        const postotxt = posto && posto.value ? posto.value : "";
        const idadetxt = idade.value || "";
        const capitalMorte = Number(capital.value) || 300000;
        const captxt = capital.options[capital.selectedIndex]?.text || "";
        const capitalInvalidez = Math.min(capitalMorte, 1000000);
        const capitalInvalidezTxt = formatBRL(capitalInvalidez);

        const coverages = [];
        const cipa = document.getElementById("cobertura-ipa");
        const cifpd = document.getElementById("cobertura-ifpd");
        const cfun = document.getElementById("cobertura-funeral");
        if (cipa && cipa.checked) coverages.push(`IPA (${capitalInvalidezTxt})`);
        if (cifpd && cifpd.checked) coverages.push(`IFPD (${capitalInvalidezTxt})`);
        if (cfun && cfun.checked) coverages.push("Funeral (R$ 7.000,00)");

        const premium = calcPremium();
        const resumoText = `Profissão: ${prof}${postotxt ? " — " + postotxt : ""} | Idade: ${idadetxt} | Capital Morte: ${captxt} | Capital IPA/IFPD: ${capitalInvalidezTxt} | Coberturas: ${coverages.length ? coverages.join(", ") : "Nenhuma"} | Prêmio: ${formatBRL(premium)}`;
        
        if (resumoHiddenInput) {
            resumoHiddenInput.value = resumoText;
        }
        if (contratacaoSection) {
            contratacaoSection.classList.remove("hidden");
        }
        goToStep(stepCount - 1);

        const profissaoSelecionada = profissao.value;
        const ocupacaoFinalInput = document.getElementById("ocupacao-final");
        if (ocupacaoFinalInput) {
            ocupacaoFinalInput.value = profissaoSelecionada;
            ocupacaoFinalInput.readOnly = !0;
            ocupacaoFinalInput.style.backgroundColor = "#e9ecef";
            ocupacaoFinalInput.style.cursor = "not-allowed";
        }
    }

    card.insertBefore(wizard, form);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("iniciar") === "true") {
        goToStep(0);
    } else {
        goToStep(0);
    }

    // CORREÇÃO: Adicionar event listeners para atualização dinâmica
    profissao.addEventListener("change", () => {
        const val = profissao.value.toLowerCase();
        if (
            val.includes("policial militar") ||
            val.includes("bombeiro militar") ||
            val.includes("militar forças armadas")
        ) {
            postoGroup.classList.remove("hidden");
        } else {
            postoGroup.classList.add("hidden");
            posto.value = "";
        }
        aplicarRegrasDeCapital();
        updateSummaryAndPremium(); // CORREÇÃO: Atualizar prêmio
    });

    posto.addEventListener("change", () => {
        aplicarRegrasDeCapital();
        updateSummaryAndPremium(); // CORREÇÃO: Atualizar prêmio
    });

    idade.addEventListener("change", updateSummaryAndPremium); // CORREÇÃO: Novo listener
    idade.addEventListener("input", updateSummaryAndPremium); // CORREÇÃO: Novo listener

    capital.addEventListener("change", updateSummaryAndPremium); // CORREÇÃO: Novo listener

    // CORREÇÃO: Listeners para as coberturas
    const cipa = document.getElementById("cobertura-ipa");
    const cifpd = document.getElementById("cobertura-ifpd");
    const cfun = document.getElementById("cobertura-funeral");
    
    if (cipa) cipa.addEventListener("change", updateSummaryAndPremium);
    if (cifpd) cifpd.addEventListener("change", updateSummaryAndPremium);
    if (cfun) cfun.addEventListener("change", updateSummaryAndPremium);

    if (contratacaoSection) {
        contratacaoSection.addEventListener("click", (e) => {
            const cardEl = contratacaoSection.querySelector("#contratacao-card");
            if (cardEl && !cardEl.contains(e.target)) {
                contratacaoSection.classList.add("hidden");
            }
        });
    }

    const finalForm = document.getElementById("contratacao-form");
    const cpfInput = document.getElementById("cpf-final");
    const cepInput = document.getElementById("cep-final");
    const ruaInput = document.getElementById("rua-final");
    const bairroInput = document.getElementById("bairro-final");
    const cidadeInput = document.getElementById("cidade-final");
    const ufInput = document.getElementById("uf-final");

    if (cpfInput) {
        cpfInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = value.slice(0, 14);
        });
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf === "" || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return !1;
        let soma = 0,
            resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return !1;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return !1;
        return !0;
    }

    if (cepInput) {
        cepInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/^(\d{5})(\d)/, "$1-$2");
            e.target.value = value.slice(0, 9);
            if (value.length === 9) {
                buscarCEP(value);
            }
        });
    }

    const buscarCEP = async (cep) => {
        const cepLimpo = cep.replace(/\D/g, "");
        const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
        try {
            cepInput.style.cursor = "wait";
            const response = await fetch(url);
            const data = await response.json();
            cepInput.style.cursor = "default";
            if (data.erro) {
                alert("CEP não encontrado. Verifique o número digitado.");
                return;
            }
            ruaInput.value = data.logradouro;
            bairroInput.value = data.bairro;
            cidadeInput.value = data.localidade;
            ufInput.value = data.uf;
            document.getElementById("numero-final").focus();
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            alert("Não foi possível buscar o CEP. Tente novamente.");
            cepInput.style.cursor = "default";
        }
    };

    const dataNascimentoInput = document.getElementById("data-nascimento");
    if (dataNascimentoInput) {
        dataNascimentoInput.addEventListener("input", function (e) {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 8) {
                value = value.substring(0, 8);
            }
            if (value.length > 4) {
                value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{2})/, "$1/$2");
            }
            e.target.value = value;
        });
    }

    if (finalForm) {
        finalForm.addEventListener("submit", (e) => {
            if (cpfInput && !validarCPF(cpfInput.value)) {
                e.preventDefault();
                alert("Por favor, insira um CPF válido.");
                cpfInput.focus();
                cpfInput.style.borderColor = "red";
                setTimeout(() => {
                    cpfInput.style.borderColor = "";
                }, 3000);
            }
        });
    }

    aplicarRegrasDeCapital();
});