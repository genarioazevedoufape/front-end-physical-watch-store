document.getElementById('cadastroForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData); 

    try {
        const response = await fetch('http://127.0.0.1:3000/loja/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: data.name,
                endereco: {
                    cep: data.cep,
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
            messageDiv.innerHTML = `<p style="color: green; font-size: 30">Loja cadastrada com sucesso!</p>`;
            document.getElementById('coordenadas').style.display = 'none'; // Ocultar campos de coordenadas
        } else {
            messageDiv.innerHTML = `<p style="color: red;">Erro: ${result.message}</p>`;
            if (result.message.includes('forneça latitude e longitude')) {
                document.getElementById('coordenadas').style.display = 'block'; // Exibir campos de coordenadas
            }
        }
    } catch (error) {
        console.error('Erro ao cadastrar loja:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = `<p style="color: red;">Erro ao cadastrar loja. Tente novamente mais tarde.</p>`;
    }
});

document.getElementById('searchCep').addEventListener('click', async () => {
    const cep = document.getElementById('cep').value;
    if (!cep) {
        alert('Por favor, insira um CEP válido.');
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
