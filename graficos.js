// Copyright (c) Lara Raquel Rodrigues Branco Arsénio, 2025
// Licensed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
// Inclui Chart.js (MIT License): https://github.com/chartjs/Chart.js/blob/master/LICENSE

document.addEventListener('DOMContentLoaded', function () {
  try {
    // Verifica se os elementos canvas existem
    const canvasMediaQ = document.getElementById('graficoMediaQ');
    const canvasDesvioQ = document.getElementById('graficoDesvioQ');
    if (!canvasMediaQ || !canvasDesvioQ) {
      throw new Error('Elementos canvas não encontrados');
    }

    // Define altura máxima de 300px via CSS
    canvasMediaQ.style.maxHeight = '300px';
    canvasDesvioQ.style.maxHeight = '300px';

    // Função para calcular a mediana
    function mediana(arr) {
      const sorted = arr.slice().sort((a, b) => a - b);
      const meio = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 ? (sorted[meio - 1] + sorted[meio]) / 2 : sorted[meio];
    }

    // Gera número aleatório com distribuição normal (Box-Muller)
    function normalRandom(mean = 0.5, stdDev = 0.2) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return Math.max(0, Math.min(1, mean + stdDev * z)); // Limita a [0, 1]
    }

    // Simula votação direta
    function simularDemocracia(n, testes = 1000) {
      let Qs = [];
      for (let i = 0; i < testes; i++) {
        let prefs = Array(n)
          .fill()
          .map(() => normalRandom(0.5, 0.2));
        let Q = mediana(prefs) * 100;
        Qs.push(Q);
      }
      let mediaQ = Qs.reduce((sum, q) => sum + q, 0) / testes;
      let desvioQ = Math.sqrt(Qs.reduce((sum, q) => sum + (q - mediaQ) ** 2, 0) / testes);
      return { mediaQ, desvioQ };
    }

    // Simula votação com mega-votos
    function simularMegaVotos(n, tamanhoGrupo, testes = 1000) {
      let Qs = [];
      const m = Math.ceil(n / tamanhoGrupo);
      for (let i = 0; i < testes; i++) {
        let megaPrefs = [];
        for (let j = 0; j < m; j++) {
          let grupoPrefs = Array(Math.min(tamanhoGrupo, n - j * tamanhoGrupo))
            .fill()
            .map(() => normalRandom(0.5, 0.2));
          let pGrupo = mediana(grupoPrefs);
          megaPrefs.push(pGrupo);
        }
        let Q = mediana(megaPrefs) * 100;
        Qs.push(Q);
      }
      let desvioQ = Math.sqrt(Qs.reduce((sum, q) => sum + (q - 50) ** 2, 0) / testes);
      return { desvioQ };
    }

    // Gera dados para os gráficos
    function gerarDadosGraficos() {
      const ns = [50, 200, 1256, 10000, 1000000];
      let mediasQ = [], desviosQ = [], desviosQMega = [], tamanhosGrupo = [];
      ns.forEach(n => {
        const { mediaQ, desvioQ } = simularDemocracia(n);
        // Tamanho do grupo dinâmico, próximo ao ponto de ruptura, mas limitado
        const tamanhoGrupo = Math.min(n, 1000);
        const { desvioQ: desvioQMega } = simularMegaVotos(n, tamanhoGrupo);
        mediasQ.push(mediaQ);
        desviosQ.push(desvioQ);
        desviosQMega.push(desvioQMega);
        tamanhosGrupo.push(tamanhoGrupo);
        console.log(
          `n=${n}, Q médio=${mediaQ.toFixed(2)}, Desvio Q=${desvioQ.toFixed(2)}, ` +
          `Desvio Q (mega-votos, grupo=${tamanhoGrupo})=${desvioQMega.toFixed(2)}`
        );
      });
      return { ns, mediasQ, desviosQ, desviosQMega, tamanhosGrupo };
    }

    // Plota os gráficos
    function plotarGraficos() {
      const { ns, mediasQ, desviosQ, desviosQMega, tamanhosGrupo } = gerarDadosGraficos();

      // Gráfico 1: Média de Q (Problema - votação direta)
      const ctx1 = canvasMediaQ.getContext('2d');
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ns,
          datasets: [
            { label: 'Média de Q (Votação Direta)', data: mediasQ, borderColor: 'blue', fill: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          maxHeight: 300, // Mantido, mas ignorado pelo Chart.js
          scales: {
            x: { title: { display: true, text: 'Escala (n)' } },
            y: { title: { display: true, text: 'Qualidade de Vida (Q)' }, min: 0, max: 100 }
          },
          plugins: {
            title: { display: true, text: 'Convergência para o MDC: Votação Direta' }
          }
        }
      });

      // Gráfico 2: Desvio de Q (Solução Megavotos - mitigação da entropia)
      const ctx2 = canvasDesvioQ.getContext('2d');
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: ns,
          datasets: [
            { label: 'Desvio de Q (Votação Direta)', data: desviosQ, borderColor: 'red', fill: false },
            { 
              label: 'Desvio de Q (Mega-Votos)', 
              data: desviosQMega, 
              borderColor: 'orange', 
              fill: false,
              pointStyle: 'circle',
              pointRadius: 5,
              pointHoverRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          maxHeight: 300, // Mantido, mas ignorado pelo Chart.js
          scales: {
            x: { title: { display: true, text: 'Escala (n)' } },
            y: { title: { display: true, text: 'Desvio de Q (Entropia)' }, min: 0, max: 15 }
          },
          plugins: {
            title: { display: true, text: 'Mitigação da Entropia: Mega-Votos vs. Votação Direta' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  const label = context.dataset.label;
                  const value = context.parsed.y.toFixed(2);
                  const tamanhoGrupo = tamanhosGrupo[index];
                  return `${label}: ${value} (grupo=${tamanhoGrupo})`;
                }
              }
            }
          }
        }
      });
    }

    // Executa a geração e plotagem dos gráficos
    plotarGraficos();
  } catch (error) {
    console.error('Erro ao renderizar gráficos:', error);
  }
});
