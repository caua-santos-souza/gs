document.addEventListener("DOMContentLoaded", function() {
  var video = document.getElementById('meuVideo');
  
  // Adiciona um evento de clique para iniciar o vídeo
  document.body.addEventListener('click', function() {
    video.play().catch(error => {
      console.error('Erro ao reproduzir o vídeo:', error);
    });
  });

  const cidadesSaoPauloImportantes = [
    "São Paulo", 
    "Guarulhos", 
    "Campinas", 
    "Santos", 
    "São Bernardo do Campo", 
    "Osasco", 
    "Santo André", 
    "São José dos Campos", 
    "Ribeirão Preto", 
    "Sorocaba", 
    "São Caetano do Sul", 
    "Diadema", 
    "Mogi das Cruzes",
    "Suzano",
    "Jundiaí",
    "Piracicaba",
    "Taubaté",
    "Pindamonhangaba",
    "Indaiatuba",
    "Limeira",
  ];

  const localSelect = document.getElementById('local-select');

  // Adicionando cidades ao select
  cidadesSaoPauloImportantes.forEach(cidade => {
    const option = document.createElement('option');
    option.value = cidade; 
    option.text = cidade; 
    localSelect.add(option);
  });

  const formAnalise = document.getElementById('form-analise');
  const dadosMonitoramento = document.getElementById('dados-monitoramento');
  const localExibido = document.getElementById('local-exibido');
  const temperatura = document.getElementById('temperatura');
  const umidade = document.getElementById('umidade');
  const pressao = document.getElementById('pressao');
  const velocidadeVento = document.getElementById('velocidade-vento');
  const classificacaoAgua = document.createElement('span'); // Elemento para exibir a classificação da água
  classificacaoAgua.id = 'classificacao-agua'; // Definindo o id para ser facilmente selecionado
  dadosMonitoramento.appendChild(classificacaoAgua);

  const apiKey = 'd79d091a1312b2203cddb26883585736'; // Sua chave API gratuita

  formAnalise.addEventListener('submit', (event) => {
    event.preventDefault();
    const local = localSelect.value;
    console.log("Local selecionado:", local);

    if (!local) {
      dadosMonitoramento.innerHTML = `<p>Por favor, selecione um local.</p>`;
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${local}&appid=${apiKey}&units=metric`;
    console.log("URL da API:", apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição à API.');
        }
        return response.json();
      })
      .then(data => {
        console.log("Resposta da API:", data);

        localExibido.textContent = local;
        temperatura.textContent = data.main.temp;
        umidade.textContent = data.main.humidity;
        pressao.textContent = data.main.pressure;
        velocidadeVento.textContent = data.wind.speed;

        // Classificação da qualidade da água
        const classificacao = classificarQualidadeAgua(data.main.temp, data.main.humidity, data.main.pressure, data.wind.speed);
        classificacaoAgua.textContent = classificacao.texto;
        classificacaoAgua.style.color = classificacao.cor; // Aplicando a cor conforme a classificação
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        dadosMonitoramento.innerHTML = `<p>Erro ao buscar dados. Tente novamente mais tarde.</p>`;
      });
  });

  // Habilita/desabilita o botão Analisar com base na seleção da cidade
  localSelect.addEventListener('change', () => {
    const localSelecionado = localSelect.value;
    formAnalise.querySelector('button').disabled = !localSelecionado;
  });

  // Função para classificar a qualidade da água
  function classificarQualidadeAgua(temp, humidade, pressao, velocidadeVento) {
    let pontuacao = 0;

    // Classificação da temperatura
    if (temp >= 18 && temp <= 25) {
      pontuacao += 2; // Excelente
    } else if ((temp >= 15 && temp < 18) || (temp > 25 && temp <= 28)) {
      pontuacao += 1; // Muito Boa
    }

    // Classificação da umidade
    if (humidade >= 50 && humidade <= 70) {
      pontuacao += 2; // Excelente
    } else if ((humidade >= 40 && humidade < 50) || (humidade > 70 && humidade <= 80)) {
      pontuacao += 1; // Muito Boa
    }

    // Classificação da pressão
    if (pressao >= 1013 && pressao <= 1020) {
      pontuacao += 2; // Excelente
    } else if ((pressao >= 1008 && pressao < 1013) || (pressao > 1020 && pressao <= 1025)) {
      pontuacao += 1; // Muito Boa
    }

    // Classificação da velocidade do vento
    if (velocidadeVento >= 1 && velocidadeVento <= 3) {
      pontuacao += 2; // Excelente
    } else if ((velocidadeVento >= 0.5 && velocidadeVento < 1) || (velocidadeVento > 3 && velocidadeVento <= 5)) {
      pontuacao += 1; // Muito Boa
    }

    if (pontuacao >= 7) {
      return { texto: "Excelente", cor: "lightgreen" }; // Excelente, cor verde
    } else if (pontuacao >= 5) {
      return { texto: "Muito Boa", cor: "green" }; // Muito Boa, cor azul
    } else if (pontuacao >= 3) {
      return { texto: "Regular", cor: "yellow" }; // Regular, cor laranja
    } else if (pontuacao >= 1) {
      return { texto: "Abaixo do Ideal", cor: "orange" }; // Abaixo do Ideal, cor amarelo
    } else {
      return { texto: "Irregular", cor: "red" }; // Irregular, cor vermelho
    }
  }
});
