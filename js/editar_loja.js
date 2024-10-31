document.getElementById('cancelButton').addEventListener('click', () => {
    window.history.back(); // Volta para a página anterior
});

// Função para buscar dados da loja pelo ID e preencher o formulário
async function fetchLojaPorId(id) {
    try {
        const response = await fetch(`http://localhost:3000/loja/buscar/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar a loja');
        }
        const loja = await response.json();
        populateForm(loja);
    } catch (error) {
        console.error(error.message);
        alert('Erro ao carregar os dados da loja. Tente novamente mais tarde.');
    }
}
// Função para preencher o formulário com os dados da loja
function populateForm(loja) {
    document.getElementById('name').value = loja.nome;
    document.getElementById('cep').value = loja.endereco.cep;
    document.getElementById('logradouro').value = loja.endereco.logradouro;
    document.getElementById('numero').value = loja.endereco.numero;
    document.getElementById('bairro').value = loja.endereco.bairro;
    document.getElementById('cidade').value = loja.endereco.cidade;
    document.getElementById('estado').value = loja.endereco.estado;
    document.getElementById('longitude').value = loja.coordenadas.longitude;
    document.getElementById('latitude').value = loja.coordenadas.latitude;
    document.getElementById('horarioFuncionamento').value = loja.informacoes.horarioFuncionamento;
    document.getElementById('diasFuncionamento').value = loja.informacoes.diasFuncionamento;
}

// Obtém o ID da loja a partir da URL e chama a função de busca
const urlParams = new URLSearchParams(window.location.search);
const lojaId = urlParams.get('id');
fetchLojaPorId(lojaId);

// Evento para buscar o endereço pelo CEP
document.querySelector('.search-button').addEventListener('click', async () => {
    document.getElementById('longitude').value = '';
    document.getElementById('latitude').value = '';

    const cep = document.getElementById('cep').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (!cep || cep.length !== 8) {
        alert('Por favor, insira um CEP válido de 8 dígitos.');
        return;
    }

    try {
        const response = await fetch(`http://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado.');
            return;
        }

        // Preenche o formulário com os dados retornados do ViaCEP
        document.getElementById('logradouro').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('estado').value = data.uf;

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente mais tarde.');
        return;
    }
});

// Evento para submissão do formulário e atualização da loja
document.querySelector('.form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = new URLSearchParams(window.location.search).get('id');
    const nome = document.getElementById('name').value;
    const endereco = {
        cep: document.getElementById('cep').value.replace(/\D/g, ''), // Remove hífen antes de enviar
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
    };
    const coordenadas = {
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
    };

    try {
        const response = await fetch(`http://localhost:3000/loja/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, endereco, coordenadas }),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar a loja');
        }
        alert('Loja atualizada com sucesso!');
    } catch (error) {
        console.error(error.message);
        alert('Coordenadas não encontradas para o CEP fornecido. Por favor, forneça latitude e longitude.');

        // Exibe os campos de coordenadas caso estejam faltando
        document.getElementById('label-coordenadas').style.display = 'block';
        document.getElementById('longitude').style.display = "block";
        document.getElementById('latitude').style.display = "block";
    }
});

// Adiciona máscara de CEP ao campo de entrada
document.getElementById('cep').addEventListener('input', function (e) {
    let cep = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número

    // Adiciona o hífen após o quinto dígito para formatar como XXXXX-XXX
    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    e.target.value = cep; // Atualiza o campo de entrada com a máscara
});
