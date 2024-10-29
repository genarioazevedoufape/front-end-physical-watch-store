document.getElementById('searchButton').addEventListener('click', async () => {
  const cep = document.getElementById('cepInput').value;

  if (!/^\d{8}$/.test(cep)) {
      alert('Por favor, insira um CEP válido de 8 dígitos.');
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/loja/localizar/${cep}`);

      if (response.status === 404) {
          alert('Nenhuma loja encontrada dentro de um raio de 100 km.');
          return;
      }

      if (!response.ok) {
          throw new Error('Erro ao localizar lojas. Verifique o CEP e tente novamente.');
      }

      const data = await response.json();

      if (data.lojas && data.lojas.length > 0) {
          localStorage.setItem('lojasProximas', JSON.stringify(data.lojas));
          window.location.href = 'loja_proxima.html';
      }
  } catch (error) {
      alert(error.message);
  }
});
