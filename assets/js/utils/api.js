export async function buscarCEP(cep, formElements) {
    const { cepInput, ruaInput, bairroInput, cidadeInput, ufInput, numeroInput } = formElements;
    const cepLimpo = cep.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

    try {
        cepInput.style.cursor = 'wait';
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
        numeroInput.focus();
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Não foi possível buscar o CEP. Tente novamente.');
        cepInput.style.cursor = 'default';
    }
}