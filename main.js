import firebaseConfig from './firebaseConfig';

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar a Firestore
const db = firebase.firestore();

const videoElement = document.getElementById('camera');
const startButton = document.getElementById('startButton');
const resultDiv = document.getElementById('result');

// Configurar QuaggaJS para leitura do QR code
Quagga.init({
    inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: videoElement,
        constraints: {
            facingMode: 'environment',
        },
    },
    decoder: {
        readers: ['code_128_reader'],
    },
});

startButton.addEventListener('click', () => {
    Quagga.start();
});

Quagga.onDetected((result) => {
    const code = result.codeResult.code;
    resultDiv.innerHTML = `<p>Código lido: ${code}</p>`;

    // Consultar o Firebase para obter os dados do equipamento
    db.collection('equipamentos')
        .doc(code)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                resultDiv.innerHTML += `<p>Nome do equipamento: ${data.nome}</p>`;
                resultDiv.innerHTML += `<p>Data de Calibragem: ${data.dataCalibragem}</p>`;
                resultDiv.innerHTML += `<p>Data da Próxima Calibragem: ${data.dataProximaCalibragem}</p>`;
            } else {
                resultDiv.innerHTML += '<p>Equipamento não encontrado.</p>';
            }
        })
        .catch((error) => {
            console.error('Erro ao consultar o Firebase: ', error);
        });
});

Quagga.onProcessed(() => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (Quagga.ImageDebug) {
        Quagga.ImageDebug.drawPath(Quagga.ctx.path, { x: 0, y: 1 }, drawingCtx, {
            color: 'red',
            lineWidth: 2,
        });
    }

    if (Quagga.ImageDebug) {
        Quagga.ImageDebug.drawPath(Quagga.ctx.result, { x: 0, y: 1 }, drawingCtx, {
            color: 'green',
            lineWidth: 2,
        });
    }
});

// Parar a leitura do QR code quando a página é fechada
window.addEventListener('beforeunload', () => {
    Quagga.stop();
});
