// Evento para buscar lojas ao clicar no botão
document.getElementById('searchButton').addEventListener('click', async () => {
    const cep = document.getElementById('cepInput').value.replace('-', ''); // Remove o hífen para garantir que o CEP tenha 8 dígitos
    
    // Verifica se o CEP possui exatamente 8 dígitos
    if (!/^\d{8}$/.test(cep)) {
        alert('Por favor, insira um CEP válido de 8 dígitos.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/loja/localizar/${cep}`);

        // Caso não encontre lojas no raio de 100 km
        if (response.status === 404) {
            alert('Nenhuma loja encontrada dentro de um raio de 100 km.');
            return;
        }

        // Se a resposta não for bem-sucedida, lança um erro
        if (!response.ok) {
            throw new Error('Erro ao localizar lojas. Verifique o CEP e tente novamente.');
        }

        const data = await response.json();

        // Armazena as lojas encontradas no localStorage e redireciona para a página de exibição
        if (data.lojas && data.lojas.length > 0) {
            localStorage.setItem('lojasProximas', JSON.stringify(data.lojas));
            window.location.href = 'loja_proxima.html';
        }
    } catch (error) {
        alert(error.message); // Exibe a mensagem de erro em caso de falha
    }
});

// Evento para aplicar a máscara de CEP
document.getElementById('cepInput').addEventListener('input', function (e) {
    let cep = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número

    // Adiciona o hífen após o quinto dígito para formatar como XXXXX-XXX
    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    e.target.value = cep; // Atualiza o campo de entrada com a máscara
});
