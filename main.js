import firebaseConfig from './firebaseConfig';

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar a Firestore
const db = firebase.firestore();

const videoElement = document.getElementById('camera');
const startButton = document.getElementById('startButton');
const resultDiv = document.getElementById('result');

const cameraContainer = document.getElementById('cameraContainer');

// Adicionar um event listener para o botão "Iniciar Leitura"
startButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    cameraContainer.style.display = 'block';

    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        constraints: {
          ...stream.getVideoTracks()[0].getSettings(),
          facingMode: 'environment',
        },
      },
      decoder: {
        readers: ['code_128_reader'],
      },
    });

    Quagga.start();
  } catch (error) {
    console.error('Erro ao acessar a câmera: ', error);
  }
});


