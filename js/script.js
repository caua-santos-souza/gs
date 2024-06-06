// Código do menu hambúrguer 
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.ancoras');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active'); 
  nav.classList.toggle('active'); 
});

document.addEventListener("DOMContentLoaded", function() {
  var video = document.getElementById('meuVideo');
  
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
    "São Bernardo", 
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
  const classificacaoAgua = document.createElement('span'); 
  classificacaoAgua.id = 'classificacao-agua'; 
  dadosMonitoramento.appendChild(classificacaoAgua);

  const apiKey = 'd79d091a1312b2203cddb26883585736'; 

  formAnalise.addEventListener('submit', (event) => {
    event.preventDefault();
    const local = localSelect.value;

    if (!local) {
      dadosMonitoramento.innerHTML = `<p>Por favor, selecione um local.</p>`;
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${local}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição à API.');
        }
        return response.json();
      })
      .then(data => {
        localExibido.textContent = local;
        temperatura.textContent = data.main.temp;
        umidade.textContent = data.main.humidity;
        pressao.textContent = data.main.pressure;
        velocidadeVento.textContent = data.wind.speed;

        const classificacao = classificarQualidadeAgua(data.main.temp, data.main.humidity, data.main.pressure, data.wind.speed);
        classificacaoAgua.textContent = classificacao.texto;
        classificacaoAgua.style.color = classificacao.cor; 
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        dadosMonitoramento.innerHTML = `<p>Erro ao buscar dados. Tente novamente mais tarde.</p>`;
      });
  });

  localSelect.addEventListener('change', () => {
    const localSelecionado = localSelect.value;
    formAnalise.querySelector('button').disabled = !localSelecionado;
  });

  //codigo qualidade da água
  function classificarQualidadeAgua(temp, humidade, pressao, velocidadeVento) {
    let pontuacao = 0;

    if (temp >= 18 && temp <= 25) {
      pontuacao += 2;
    } else if ((temp >= 15 && temp < 18) || (temp > 25 && temp <= 28)) {
      pontuacao += 1;
    }

    if (humidade >= 50 && humidade <= 70) {
      pontuacao += 2; 
    } else if ((humidade >= 40 && humidade < 50) || (humidade > 70 && humidade <= 80)) {
      pontuacao += 1; 
    }

    if (pressao >= 1013 && pressao <= 1020) {
      pontuacao += 2; 
    } else if ((pressao >= 1008 && pressao < 1013) || (pressao > 1020 && pressao <= 1025)) {
      pontuacao += 1; 
    }

    if (velocidadeVento >= 1 && velocidadeVento <= 3) {
      pontuacao += 2;
    } else if ((velocidadeVento >= 0.5 && velocidadeVento < 1) || (velocidadeVento > 3 && velocidadeVento <= 5)) {
      pontuacao += 1; 
    }

    if (pontuacao >= 7) {
      return { texto: "Excelente", cor: "lightgreen" }; 
    } else if (pontuacao >= 5) {
      return { texto: "Muito Boa", cor: "green" }; 
    } else if (pontuacao >= 3) {
      return { texto: "Regular", cor: "yellow" }; 
    } else if (pontuacao >= 1) {
      return { texto: "Abaixo do Ideal", cor: "orange" }; 
    } else {
      return { texto: "Irregular", cor: "red" };
    }
  }  
});

// Código do Formulário 
const formContato = document.getElementById('formulario-contato');
const mensagemEnviada = document.getElementById('mensagem-enviada');

formContato.addEventListener('submit', function(event) {
  event.preventDefault(); 

  if (validarFormulario()) {
    mensagemEnviada.style.display = 'block';
    formContato.reset(); 
  }
});

function validarFormulario() {
  let valido = true;

  const nome = document.getElementById('nome').value.trim();
  const erroNome = document.getElementById('erro-nome');
  if (nome === "") {
    erroNome.textContent = "Por favor, insira seu nome.";
    erroNome.style.display = "block";
    valido = false;
  } else {
    erroNome.style.display = "none";
  }

  const email = document.getElementById('email').value.trim();
  const erroEmail = document.getElementById('erro-email');
  if (email === "") {
    erroEmail.textContent = "Por favor, insira seu email.";
    erroEmail.style.display = "block";
    valido = false;
  } else if (!validarEmail(email)) {
    erroEmail.textContent = "Por favor, insira um email válido.";
    erroEmail.style.display = "block";
    valido = false;
  } else {
    erroEmail.style.display = "none";
  }

  const mensagem = document.getElementById('mensagem').value.trim();
  const erroMensagem = document.getElementById('erro-mensagem');
  if (mensagem === "") {
    erroMensagem.textContent = "Por favor, insira sua mensagem.";
    erroMensagem.style.display = "block";
    valido = false;
  } else {
    erroMensagem.style.display = "none";
  }

  return valido;
}

function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
} 