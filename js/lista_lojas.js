    // Função para buscar as lojas do backend
    async function fetchLojas() {
        try {
          const response = await fetch('http://localhost:3000/loja/listar'); 
  
          if (!response.ok) {
            throw new Error('Erro ao buscar as lojas');
          }
  
          const lojas = await response.json();
          displayLojas(lojas);
        } catch (error) {
          console.error(error.message);
          document.getElementById('store-list').innerHTML = '<p>Erro ao carregar as lojas. Tente novamente mais tarde.</p>';
        }
      }
  
  // Função para exibir as lojas na página
  function displayLojas(lojas) {
    const storeListDiv = document.getElementById('store-list');
  
    if (lojas.length > 0) {
      storeListDiv.innerHTML = lojas.map(loja => `
        <div class="store">
          <div class="store-completo">
            <h2>${loja.nome}</h2>
            <p>
              Logradouro: ${loja.endereco.logradouro}<br>
              Número: ${loja.endereco.numero}<br>
              Bairro: ${loja.endereco.bairro}<br>
              CEP: ${loja.endereco.cep}<br>
              Cidade: ${loja.endereco.cidade}<br>
              Estado: ${loja.endereco.estado}<br>
            </p>
          </div>
          <div class="buttons">
            <button class="update-btn" data-id="${loja._id}">ATUALIZAR INFORMAÇÕES</button>
            <button class="delete-btn" data-id="${loja._id}">DELETAR LOJA</button> 
          </div>
        </div>
      `).join('');
  
      // Adicione um listener de clique para os botões de atualizar
      const updateButtons = storeListDiv.querySelectorAll('.update-btn');
      updateButtons.forEach(button => {
        button.addEventListener('click', () => {
          const lojaId = button.getAttribute('data-id'); 
          window.location.href = `editar_loja.html?id=${lojaId}`; 
        });
      });
  
      // Adicione um listener de clique para os botões de deletar
      const deleteButtons = storeListDiv.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          const lojaId = button.getAttribute('data-id');
          deleteLoja(lojaId);
        });
      });
    } else {
      storeListDiv.innerHTML = '<p>Nenhuma loja cadastrada.</p>';
    }
  }
  
      // Função para deletar uma loja
      async function deleteLoja(id) {
        if (confirm('Tem certeza que deseja deletar esta loja?')) {
          try {
            const response = await fetch(`http://localhost:3000/loja/${id}`, {
              method: 'DELETE',
            });
            console.log(`Response status: ${response.status}`);
  
            if (!response.ok) {
              throw new Error('Erro ao deletar a loja');
            }
  
            // Recarregar a lista de lojas após a deleção
            fetchLojas();
          } catch (error) {
            console.error(error.message);
            alert('Erro ao deletar a loja. Tente novamente mais tarde.');
          }
        }
      }
      // Chamada da função para buscar e exibir as lojas quando a página carregar
      document.addEventListener('DOMContentLoaded', fetchLojas);