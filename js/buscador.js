// Função para exibir o modal com uma mensagem específica
function showModal(message, isSuccess) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    const modalImage = document.getElementById("modal-image");

    // Alterar imagem com base no resultado
    if (isSuccess) {
        modalImage.src = "../img/triste.png";
        modalImage.alt = "Atualização bem-sucedida";
    } else {
        modalImage.src = "../img/erro.png";
        modalImage.alt = "Erro na atualização";
    }

    modalMessage.textContent = message;
    modal.style.display = "block";
}
// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// Fecha o modal ao clicar fora dele
window.addEventListener('click', function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
});

// Evento para buscar lojas ao clicar no botão
document.getElementById('searchButton').addEventListener('click', async () => {
    const cep = document.getElementById('cepInput').value.replace('-', ''); 
    
    // Verifica se o CEP possui exatamente 8 dígitos
    if (!/^\d{8}$/.test(cep)) {
        showModal('Por favor, insira um CEP válido de 8 dígitos.');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/loja/localizar/${cep}`);

        // Caso não encontre lojas no raio de 100 km
        if (response.status === 404) {
            showModal('Nenhuma loja encontrada dentro de um raio de 100 km.', true);
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
        showModal(error.message, false); // Exibe a mensagem de erro em caso de falha
    }
});

// Evento para aplicar a máscara de CEP
document.getElementById('cepInput').addEventListener('input', function (e) {
    let cep = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número

    // Adiciona o hífen após o quinto dígito para formatar como XXXXX-XXX
    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    e.target.value = cep; 
});
