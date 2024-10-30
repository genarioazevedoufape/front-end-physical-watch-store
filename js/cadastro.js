document.getElementById('cancelButton').addEventListener('click', () => {
    window.history.back(); // Volta para a página anterior
});

document.getElementById('cadastroForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData); 

    // Validação do campo CEP
    const cep = data.cep.replace(/\D/g, ''); // Remove formatação
    if (!cep || cep.length !== 8) {
        alert('O campo "cep" é obrigatório e deve ser um CEP válido de 8 dígitos.');
        return; // Interrompe o envio do formulário
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/loja/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: data.name,
                endereco: {
                    cep: cep, // Enviar o CEP sem hífen
                    logradouro: data.logradouro,
                    numero: data.numero,
                    bairro: data.bairro,
                    cidade: data.cidade,
                    estado: data.estado
                },
                coordenadas: {
                    latitude: data.latitude || 0, 
                    longitude: data.longitude || 0  
                }
            })
        });

        const result = await response.json();
        const messageDiv = document.getElementById('message');

        if (response.ok) {
            alert('Loja cadastrada com sucesso!');
            document.getElementById('cadastroForm').reset(); // Limpar o formulário
            document.getElementById('coordenadas').style.display = 'none'; // Ocultar campos de coordenadas
        } else {
            messageDiv.innerHTML = `<p style="color: red;">Erro: ${result.message}</p>`;
            if (result.message.includes('forneça latitude e longitude')) {
                document.getElementById('coordenadas').style.display = 'block'; // Exibir campos de coordenadas
            }
        }
    } catch (error) {
        console.error('Erro ao cadastrar loja:', error);
        messageDiv.innerHTML = `<p style="color: red;">Erro ao cadastrar loja. Tente novamente mais tarde.</p>`;
    }
});

// Máscara para o CEP
document.getElementById('cep').addEventListener('input', function (e) {
    let cep = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número

    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen após o quinto dígito
    }

    e.target.value = cep; // Atualiza o campo de entrada com a máscara
});

// Busca de endereço pelo CEP
document.getElementById('searchCep').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value.replace(/\D/g, ''); // Remove formatação
    if (!cep || cep.length !== 8) {
        alert('Por favor, insira um CEP válido de 8 dígitos.');
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
            alert('CEP não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente mais tarde.');
    }
});
