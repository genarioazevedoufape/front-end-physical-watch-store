    // Recuperar todas as lojas do localStorage
    const lojas = JSON.parse(localStorage.getItem('lojasProximas'));
    const storeListDiv = document.getElementById('store-list');

    if (lojas && lojas.length > 0) {
      // Exibir informações de todas as lojas
      lojas.forEach(loja => {
        storeListDiv.innerHTML += `
          <div class="store">
            <div class="adress">
              <h2>${loja.nome}</h2>
              <p>
                Logradouro: ${loja.endereco.logradouro}<br>
                Número: ${loja.endereco.numero}<br>
                Bairro: ${loja.endereco.bairro}<br>
                CEP: ${loja.endereco.cep}<br>
                Cidade: ${loja.endereco.cidade}<br>
                Estado: ${loja.endereco.estado}
              </p>
            </div>
            <div class="informacoes-distancia">
              <div class="informacoes" id="informacoes">
                <p><strong>Funciona de:</strong> ${loja.informacoes.diasFuncionamento}</p>
                <p><strong>Horário de funcionamento das:</strong> ${loja.informacoes.horarioFuncionamento} horas</p>
              </div>
              <div class="distance">
                <img src="https://img.icons8.com/?size=100&id=13800&format=png&color=000000" alt="Location Pin">
                <p><strong>${loja.distancia}</strong> de distância</p>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      storeListDiv.innerHTML = '<p>Nenhuma loja encontrada.</p>';
    }