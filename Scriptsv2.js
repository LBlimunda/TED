// Copyright (c) Lara Raquel Rodrigues Branco Arsénio, 2025
// Licensed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
// Inclui Chart.js (MIT License): https://github.com/chartjs/Chart.js/blob/master/LICENSE

// Inicialização dos gráficos
let histogramChart, normalChart;

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

// Função para gerar pontos da curva normal
function generateNormalCurve(mean, stdDev, minX, maxX, numPoints) {
    const step = (maxX - minX) / (numPoints - 1);
    const xValues = Array.from({length: numPoints}, (_, i) => minX + i * step);
    const yValues = xValues.map(x => (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)));
    return { x: xValues, y: yValues };
}

// Função principal (mantida idêntica ao original, exceto pela fórmula)
window.onload = function() {
    const n = parseInt(document.getElementById('sampleSize').value) || 100;
    const mu = parseFloat(document.getElementById('populationProp').value) || 0.5;
    const numSims = 1000; // Simulações para o histograma
    const qnValues = [];

    // Gerar simulações para Q_n
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

    // Calcular estatísticas
    const meanQn = qnValues.reduce((a, b) => a + b, 0) / numSims;
    const varianceQn = qnValues.reduce((a, b) => a + Math.pow(b - meanQn, 2), 0) / numSims;
    const stdDevQn = Math.sqrt(varianceQn);
    const theoreticalStdDev = 50 / (fMu(mu) * Math.sqrt(n));

    // Atualizar resultados
    document.getElementById('result').innerHTML = `
        <strong>Resultados:</strong><br>
        Média de Q_n: ${meanQn.toFixed(2)}<br>
        Desvio Padrão Simulado: ${stdDevQn.toFixed(2)}<br>
        Desvio Padrão Teórico: ${theoreticalStdDev.toFixed(2)}<br>
        Erro Relativo: ${((stdDevQn - theoreticalStdDev) / theoreticalStdDev * 100).toFixed(2)}%
    `;

    // Atualizar Histograma (idêntico ao original)
    const histogramCtx = document.getElementById('histogramChart').getContext('2d');
    if (histogramChart) histogramChart.destroy();
    const histData = {
        labels: Array.from({length: 20}, (_, i) => (i * 5)), // Bins de 0 a 100
        datasets: [{
            label: 'Distribuição de Q_n',
            data: createHistogramData(qnValues, 5),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    histogramChart = new Chart(histogramCtx, {
        type: 'bar',
        data: histData,
        options: { 
            scales: { 
                y: { beginAtZero: true },
                x: { title: { display: true, text: 'Q_n' } }
            }
        }
    });

    // Atualizar Curva Normal Teórica (idêntico ao original)
    const normalCtx = document.getElementById('normalChart').getContext('2d');
    if (normalChart) normalChart.destroy();
    const normalCurve = generateNormalCurve(meanQn, theoreticalStdDev, 0, 100, 100);
    const normalData = {
        labels: normalCurve.x,
        datasets: [{
            label: 'Distribuição Normal Teórica',
            data: normalCurve.y,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };
    normalChart = new Chart(normalCtx, {
        type: 'line',
        data: normalData,
        options: { 
            scales: { 
                y: { beginAtZero: true },
                x: { title: { display: true, text: 'Q_n' } }
            }
        }
    });
};
