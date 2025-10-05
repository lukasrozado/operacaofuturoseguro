
```
# Operação Futuro Seguro - Site Institucional

Site de captura de leads e simulação de seguro de vida especializado para agentes de segurança pública, desenvolvido para a Blá Corretora de Seguros.

## 🎯 Visão Geral

O **Operação Futuro Seguro** é uma plataforma digital especializada em seguros de vida para profissionais de segurança pública (policiais, bombeiros, militares, etc.). O site oferece:

- **Simulação em tempo real** de seguros de vida.
- **Captura qualificada** de leads interessados.
- **Processo otimizado** de contratação.
- Experiência **mobile-first** e totalmente responsiva.

## 🚀 Funcionalidades

- **Página Principal (`index.html`):**
    - Hero Section com *call-to-action* direto.
    - Seção de confiança com valores institucionais.
    - Detalhamento das coberturas do seguro.
    - FAQ interativo com efeito *accordion*.
    - Otimização SEO avançada com *Schema Markup* para *rich snippets*.

- **Simulador (`simulacao.html`):**
    - Wizard interativo em 5 passos para uma experiência guiada.
    - Cálculo dinâmico de prêmios com base nas seleções.
    - Regras de capital personalizadas por profissão e posto.
    - Formulário de contratação completo com validação de CPF e CEP em tempo real.

- **Página de Agradecimento (`obrigado.html`):**
    - Confirmação de envio da proposta.
    - Redirecionamento estratégico para WhatsApp Business.

## 💻 Tecnologias Utilizadas

### Frontend
- **HTML5** (Semântico e Acessível)
- **CSS3** (Metodologia BEM)
- **JavaScript Vanilla** (ES6+)
- **Google Fonts** (Montserrat)

### Backend & Integrações
- **Formspree:** Processamento e recebimento dos formulários.
- **ViaCEP API:** Consulta de endereços e preenchimento automático.
- **Google Analytics 4:** Monitoramento de tráfego e conversões.
- **WhatsApp Business API:** Canal de comunicação direto com o lead.

### Otimizações
- Imagens em formato **WebP**.
- **Lazy Loading** nativo para imagens.
- **Preload/Prefetch** para recursos críticos.
- Compressão de arquivos **CSS/JS**.

## 📁 Estrutura do Projeto

```text
operacaofuturoseguro/
├── 📄 index.html
├── 📄 simulacao.html
├── 📄 obrigado.html
├── 📄 sobre.html
├── 📄 sitemap.xml
├── 📄 robots.txt
├── 📄 CNAME
├── 📄 .nojekyll
├── 📄 README.md
├── 📁 assets/
│   ├── 📁 css/
│   ├── 📁 js/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── atividades.js   # Dados de atividades esportivas
│   │   ├── data.js         # Dados da seguradora
│   │   └── main.js         # Script principal
│   ├── 📁 images/
│   └── 📁 fonts/
└── 📁 components/           # Componentes HTML reutilizáveis (header, footer)

```

## ⚙️ Instalação e Configuração

**Pré-requisitos:**

-   Um servidor web (Apache, Nginx) ou um serviço de hospedagem de sites estáticos (GitHub Pages, Vercel, etc.).
    
-   Um domínio configurado.
    

**Passos para Configuração:**

1.  **Clone o repositório:**
    
    Bash
    
    ```
    git clone [url-do-repositorio]
    
    ```
    
2.  **Configure as integrações:**
    
    -   **Formspree:** Atualize o endpoint do formulário no arquivo `simulacao.html`.
        
    -   **Google Analytics:** Insira seu ID de rastreamento (`G-XXXXXXXXXX`) nos arquivos HTML.
        
    -   **WhatsApp:** Substitua o número de telefone padrão em todos os links e scripts.
        
3.  **Personalize os dados:**
    
    -   Edite o arquivo `assets/js/data.js` para atualizar informações da seguradora, coberturas e limites.
        
    -   Modifique `assets/js/atividades.js` para gerenciar a lista de atividades esportivas.
        

## 📝 Formulários e Integrações

O fluxo de captura de leads foi projetado para maximizar a conversão:

1.  **Simulação:** O usuário preenche dados básicos para obter um cálculo.
    
2.  **Interesse:** Ao ver a proposta, o lead expressa interesse e avança.
    
3.  **Contratação:** Um formulário completo coleta dados pessoais, profissionais, endereço (com autocomplete do ViaCEP) e declarações de saúde.
    

**Fluxo de Dados:**

```
Usuário → Formulário → Formspree → E-mail & WhatsApp → CRM

```

## 🔍 Otimizações e SEO

O projeto foi construído com as melhores práticas de SEO para garantir alta visibilidade nos motores de busca:

-   **Meta Tags:** Títulos e descrições otimizados para cada página.
    
-   **Open Graph & Twitter Cards:** Melhoram a aparência dos links quando compartilhados em redes sociais.
    
-   **Schema Markup:** Implementado `InsuranceAgency`, `FAQPage` e `ContactPoint` para habilitar _rich snippets_ nos resultados de busca.
    
-   **Performance:** Foco em velocidade com imagens otimizadas, carregamento assíncrono de recursos e compressão de arquivos.
    
-   **Acessibilidade:** Uso de atributos ARIA, navegação por teclado e bom contraste de cores.
    

## 🌐 Deploy e Hospedagem

O projeto está configurado para deploy contínuo via **GitHub Pages**, utilizando o arquivo `CNAME` para o domínio customizado (`operacaofuturoseguro.com.br`) e `.nojekyll` para desabilitar o processamento do Jekyll.

## 🛠 Manutenção e Atualizações

Para atualizações comuns:

-   **Dados da Seguradora:** Modifique o objeto `seguradoraConfig` em `assets/js/data.js`.
    
-   **Atividades Esportivas:** Edite o array `atividadesList` em `assets/js/atividades.js`.
    
-   **Informações de Contato:** Atualize o número de WhatsApp nos arquivos HTML e no schema markup.
    

## 📞 Suporte e Contato

**Blá Corretora de Seguros Ltda** Rua Noronha Torrezao, 181 - Santa Rosa

Niterói - RJ, 24240-185

📞 +55 (21) 97943-0036

----------

**Licença:** Proprietário - Blá Corretora de Seguros Ltda

**Versão:** 2.0.0