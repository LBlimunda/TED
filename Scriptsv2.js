// Inicialização dos gráficos
let histogramChart, entropyChart;

// Função para gerar número aleatório normal (Box-Muller)
function randomNormal(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z;
}

// Função para calcular mediana
function median(values) {
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2;
}

// Função f(μ) = √μ
function fMu(mu) {
    return Math.sqrt(mu);
}

// Função para criar dados do histograma
function createHistogramData(values, binSize) {
    const bins = {};
    values.forEach(val => {
        const bin = Math.floor(val / binSize) * binSize;
        bins[bin] = (bins[bin] || 0) + 1;
    });
    const sortedBins = Object.keys(bins).sort((a, b) => a - b).map(Number);
    return sortedBins.map(bin => bins[bin] || 0);
}

// Função principal da simulação
function runSimulation() {
    const maxN = Math.min(parseInt(document.getElementById('maxSampleSize').value) || 100, 1000); // Validação
    const mu = Math.min(Math.max(parseFloat(document.getElementById('populationProp').value) || 0.5, 0.01), 0.99); // Validação
    const numSims = 1000; // Simulações por n
    const nValues = Array.from({length: Math.floor(maxN / 10) + 1}, (_, i) => (i + 1) * 10); // n = 10, 20, ..., maxN
    const stdDevs = [];
    let lastQnValues = [];

    // Simulações para cada n
    for (let n of nValues) {
        let qnValues = [];
        for (let i = 0; i < numSims; i++) {
            let props = [];
            for (let j = 0; j < n; j++) {
                // Gerar preferência p_i com distribuição normal (média 0.5, desvio 0.2)
                let pi = randomNormal(0.5, 0.2);
                pi = Math.min(Math.max(pi, 0), 1); // Limitar a [0, 1]
                props.push(pi);
            }
            const qn = 100 * median(props);
            qnValues.push(qn);
        }
        const meanQn = qnValues.reduce((a, b) => a + b, 0) / numSims;
        const varianceQn = qnValues.reduce((a, b) => a + Math.pow(b - meanQn, 2), 0) / numSims;
        stdDevs.push(Math.sqrt(varianceQn));
        if (n === maxN) lastQnValues = qnValues;
    }

    // Calcular desvios teóricos e erro
    const theoreticalStdDevs = nValues.map(n => 50 / (fMu(mu) * Math.sqrt(n)));
    const errors = stdDevs.map((sim, i) => Math.abs(sim - theoreticalStdDevs[i]) / theoreticalStdDevs[i] * 100);
    const entropyPoint = errors.findIndex(e => e > 20); // Entropia: erro relativo > 20%
    const entropyN = entropyPoint !== -1 ? nValues[entropyPoint] : 'não detectado';

    // Atualizar resultados
    document.getElementById('result').innerHTML = `
        <strong>Resultados da Simulação:</strong><br>
        Ponto de Entropia Democrática (n onde Q_n se torna instável): ${entropyN}<br>
        Desvio Padrão Simulado (n=${maxN}): ${stdDevs[stdDevs.length - 1].toFixed(2)}<br>
        Desvio Padrão Teórico (n=${maxN}): ${theoreticalStdDevs[theoreticalStdDevs.length - 1].toFixed(2)}<br>
        Erro Relativo (n=${maxN}): ${errors[errors.length - 1].toFixed(2)}%
    `;

    // Atualizar histograma
    const histogramCtx = document.getElementById('histogramChart').getContext('2d');
    if (histogramChart) histogramChart.destroy();
    const histData = {
        labels: Array.from({length: 20}, (_, i) => (i * 5)), // Bins de 0 a 100
        datasets: [{
            label: `Frequência de Q_n (n=${maxN})`,
            data: createHistogramData(lastQnValues, 5),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    histogramChart = new Chart(histogramCtx, {
        type: 'bar',
        data: histData,
        options: { scales: { y: { beginAtZero: true } } }
    });

    // Atualizar gráfico de entropia
    const entropyCtx = document.getElementById('entropyChart').getContext('2d');
    if (entropyChart) entropyChart.destroy();
    const entropyData = {
        labels: nValues,
        datasets: [
            {
                label: 'Desvio Padrão Simulado',
                data: stdDevs,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
                tension: 0.1
            },
            {
                label: 'Desvio Padrão Teórico',
                data: theoreticalStdDevs,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.1
            }
        ]
    };
    entropyChart = new Chart(entropyCtx, {
        type: 'line',
        data: entropyData,
        options: { scales: { y: { beginAtZero: true }, x: { title: { display: true, text: 'Tamanho da Amostra (n)' } } } }
    });
}

// Inicialização no carregamento da página
window.onload = function() {
    runSimulation(); // Executa simulação inicial
    document.getElementById('simulateButton').addEventListener('click', runSimulation); // Listener para o botão
};
