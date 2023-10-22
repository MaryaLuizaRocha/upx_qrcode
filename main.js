// Configurar o Firebase
const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_DOMÍNIO.firebaseapp.com',
  projectId: 'SEU_ID_DO_PROJETO',
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar o Firestore
const db = firebase.firestore();

const cameraContainer = document.getElementById('cameraContainer');
const videoElement = document.getElementById('camera');

// Adicionar um event listener para abrir a câmera ao carregar a página
window.addEventListener('load', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    cameraContainer.style.display = 'block';

    const codeReader = new ZXing.BrowserQRCodeReader();

    codeReader.decodeFromStream(stream, 'video', (result, error) => {
      if (result) {
        // Resultado do QR code lido
        const codigoEquipamento = result.text;

        // Consultar o Firebase para obter os dados do equipamento
        db.collection('equipamentos')
          .doc(codigoEquipamento)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              const resultDiv = document.getElementById('result');
              resultDiv.innerHTML = `<p>Código do Equipamento: ${codigoEquipamento}</p>`;
              resultDiv.innerHTML += `<p>Nome do Equipamento: ${data.nome}</p>`;
              resultDiv.innerHTML += `<p>Data de Calibragem: ${data.dataCalibragem}</p>`;
              resultDiv.innerHTML += `<p>Data da Próxima Calibragem: ${data.dataProximaCalibragem}</p>`;
            } else {
              console.log('Equipamento não encontrado.');
            }
          })
          .catch((error) => {
            console.error('Erro ao consultar o Firebase:', error);
          });
      }
    });
  } catch (error) {
    console.error('Erro ao acessar a câmera: ', error);
  }
});
