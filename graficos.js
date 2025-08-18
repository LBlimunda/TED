// Copyright (c) Lara Raquel Rodrigues Branco Arsénio, 2025
// Licensed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
// Inclui Chart.js (MIT License): https://github.com/chartjs/Chart.js/blob/master/LICENSE

document.addEventListener('DOMContentLoaded', function () {
  try {
    const canvasMediaQ = document.getElementById('graficoMediaQ');
    const canvasDesvioQ = document.getElementById('graficoDesvioQ');
    if (!canvasMediaQ || !canvasDesvioQ) throw new Error('Elementos canvas não encontrados');

    canvasMediaQ.style.maxHeight = '300px';
    canvasDesvioQ.style.maxHeight = '300px';

    function mediana(arr) {
      const sorted = arr.slice().sort((a, b) => a - b);
      const meio = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[meio - 1] + sorted[meio]) / 2 : sorted[meio];
    }

    function normalRandom(mean = 0.5, stdDev = 0.2) {
      const u1 = Math.random(), u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return Math.max(0, Math.min(1, mean + stdDev * z));
    }

    function simularDemocracia(n, testes = n === 1256 ? 1000 : 500) {
      if (n >= 10000) return { mediaQ: 50, desvioQ: 100 * Math.sqrt(0.1256 / n) };
      let Qs = [];
      for (let i = 0; i < testes; i++) {
        let prefs = Array(n).fill().map(() => normalRandom(0.5, 0.2));
        Qs.push(mediana(prefs) * 100);
      }
      let mediaQ = Qs.reduce((sum, q) => sum + q, 0) / testes;
      let desvioQ = Math.sqrt(Qs.reduce((sum, q) => sum + (q - mediaQ) ** 2, 0) / testes);
      return { mediaQ, desvioQ };
    }

    function simularMegaVotos(n, tamanhoGrupo, testes = 500) {
      let Qs = [];
      const m = Math.ceil(n / tamanhoGrupo), maxM = Math.min(m, 50);
      for (let i = 0; i < testes; i++) {
        let megaPrefs = [];
        for (let j = 0; j < maxM; j++) {
          let grupoPrefs = Array(Math.min(tamanhoGrupo, n - j * tamanhoGrupo))
            .fill()
            .map(() => normalRandom(0.5, 0.2));
          megaPrefs.push(mediana(grupoPrefs));
        }
        Qs.push(mediana(megaPrefs) * 100);
      }
      let desvioQ = Math.sqrt(Qs.reduce((sum, q) => sum + (q - 50) ** 2, 0) / testes);
      if (m > maxM) desvioQ *= Math.sqrt(m / maxM);
      return { desvioQ };
    }

    function gerarDadosGraficos() {
      const ns = [50, 200, 1256, 10000, 1000000];
      let mediasQ = [], desviosQ = [], desviosQMega = [], tamanhosGrupo = [];
      ns.forEach(n => {
        const { mediaQ, desvioQ } = simularDemocracia(n);
        const tamanhoGrupo = Math.min(n, 1000);
        const { desvioQ: desvioQMega } = simularMegaVotos(n, tamanhoGrupo);
        mediasQ.push(mediaQ);
        desviosQ.push(desvioQ);
        desviosQMega.push(desvioQMega);
        tamanhosGrupo.push(tamanhoGrupo);
        console.log(`n=${n}, Q médio=${mediaQ.toFixed(2)}, Desvio Q=${desvioQ.toFixed(2)}, Desvio Q (mega-votos, grupo=${tamanhoGrupo})=${desvioQMega.toFixed(2)}`);
      });
      return { ns, mediasQ, desviosQ, desviosQMega, tamanhosGrupo };
    }

    function plotarGraficos() {
      const { ns, mediasQ, desviosQ, desviosQMega, tamanhosGrupo } = gerarDadosGraficos();

      const ctx1 = canvasMediaQ.getContext('2d');
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ns,
          datasets: [
            { label: 'Média de Q (Votação Direta)', data: mediasQ, borderColor: 'blue', fill: false, pointRadius: 5 },
            {
              label: 'Faixa de Confiança (±SD)', data: mediasQ.map((mq, i) => [mq - desviosQ[i], mq + desviosQ[i]]),
              borderColor: 'rgba(0, 0, 255, 0.2)', backgroundColor: 'rgba(0, 0, 255, 0.1)', fill: true, type: 'line', pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false, maxHeight: 300,
          scales: { x: { title: { display: true, text: 'Escala (n)' } }, y: { title: { display: true, text: 'Qualidade de Vida (Q)' }, min: 0, max: 100 } },
          plugins: {
            title: { display: true, text: 'Convergência para o MDC: Votação Direta' },
            annotation: {
              annotations: [{ type: 'line', xMin: 1256, xMax: 1256, borderColor: 'grey', borderWidth: 1, label: { content: 'Ponto de Ruptura', enabled: true } }]
            }
          }
        }
      });

      const ctx2 = canvasDesvioQ.getContext('2d');
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: ns,
          datasets: [
            { label: 'Desvio de Q (Votação Direta)', data: desviosQ, borderColor: 'red', fill: false, pointRadius: 5 },
            { label: 'Desvio de Q (Mega-Votos)', data: desviosQMega, borderColor: 'orange', fill: false, pointStyle: 'circle', pointRadius: 5, pointHoverRadius: 8 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false, maxHeight: 300,
          scales: { x: { title: { display: true, text: 'Escala (n)' } }, y: { title: { display: true, text: 'Desvio de Q (Entropia)' }, min: 0, max: 15 } },
          plugins: {
            title: { display: true, text: 'Mitigação da Entropia: Mega-Votos vs. Votação Direta' },
            tooltip: {
              callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)} (grupo=${tamanhosGrupo[context.dataIndex]})` }
            }
          }
        }
      });
    }

    plotarGraficos();
  } catch (error) {
    console.error('Erro ao renderizar gráficos:', error);
  }
});
