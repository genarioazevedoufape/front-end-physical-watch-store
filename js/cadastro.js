// Função para abrir e fechar os modais
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fecha o modal ao clicar fora da área do modal
window.addEventListener("click", (event) => {
    const openModals = document.querySelectorAll('.modal'); 
    openModals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Cancelar ação e voltar
document.getElementById('cancelButton').addEventListener('click', () => {
    window.history.back(); 
});

document.getElementById('cadastroForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Validação do campo CEP
    const cep = data.cep.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
        document.getElementById('errorMessage').textContent = 'O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.';
        openModal('errorModal');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/loja/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: data.name,
                endereco: {
                    cep: cep,
                    logradouro: data.logradouro,
                    numero: data.numero,
                    bairro: data.bairro,
                    cidade: data.cidade,
                    estado: data.estado
                },
                coordenadas: {
                    latitude: data.latitude || 0,
                    longitude: data.longitude || 0
                },
                informacoes: {
                    horarioFuncionamento: data.horarioFuncionamento,
                    diasFuncionamento: data.diasFuncionamento
                }
            })
        });

        const result = await response.json();

        if (response.ok) {
            openModal('successModal');
            document.getElementById('cadastroForm').reset();
            document.getElementById('coordenadas').style.display = 'none';
        } else {
            document.getElementById('errorMessage').textContent = `Erro: ${result.message}`;
            openModal('errorModal');
            if (result.message.includes('forneça latitude e longitude')) {
                document.getElementById('coordenadas').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Erro ao cadastrar loja:', error);
        document.getElementById('errorMessage').textContent = 'Erro ao cadastrar loja. Tente novamente mais tarde.';
        openModal('errorModal');
    }
});

// Máscara para o CEP
document.getElementById('cep').addEventListener('input', function (e) {
    let cep = e.target.value.replace(/\D/g, '');

    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    }

    e.target.value = cep;
});

// Busca de endereço pelo CEP
document.getElementById('searchCep').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
        document.getElementById('errorMessage').textContent = 'Por favor, insira um CEP válido de 8 dígitos.';
        openModal('errorModal');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
            document.getElementById('logradouro').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('estado').value = data.uf;
        } else {
            document.getElementById('errorMessage').textContent = 'CEP não encontrado.';
            openModal('errorModal');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        document.getElementById('errorMessage').textContent = 'Erro ao buscar CEP. Tente novamente mais tarde.';
        openModal('errorModal');
    }
});
