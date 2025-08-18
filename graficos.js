// Copyright (c) Lara Raquel Rodrigues Branco Arsénio, 2025
// Licensed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
// Inclui Chart.js (MIT License): https://github.com/chartjs/Chart.js/blob/master/LICENSE

function mediana(arr) {
        const sorted = arr.slice().sort((a, b) => a - b);
        const meio = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[meio - 1] + sorted[meio]) / 2 : sorted[meio];
}

      function simularDemocracia(n, testes = 1000) {
        let Qs = [];
        for (let i = 0; i < testes; i++) {
          let prefs = Array(n).fill().map(() => Math.max(0, Math.min(1, 0.5 + 0.2 * (Math.random() - 0.5) * 2)));
          let Q = mediana(prefs) * 100;
          Qs.push(Q);
        }
        let mediaQ = Qs.reduce((sum, q) => sum + q, 0) / testes;
        let desvioQ = Math.sqrt(Qs.reduce((sum, q) => sum + (q - mediaQ) ** 2, 0) / testes);
        return { mediaQ, desvioQ };
      }

      function gerarDadosGraficosBase() {
        const ns = [50, 200, 1256, 10000, 1000000];
        let mediasQ = [], desviosQ = [];
        ns.forEach(n => {
          const { mediaQ, desvioQ } = simularDemocracia(n);
          mediasQ.push(mediaQ);
          desviosQ.push(desvioQ);
          console.log(`n=${n}, Q médio=${mediaQ.toFixed(2)}, Desvio Q=${desvioQ.toFixed(2)}`);
        });
        return { ns, mediasQ, desviosQ };
      }

      function plotarGraficos() {
        const { ns, mediasQ, desviosQ } = gerarDadosGraficosBase();
        const ctx1 = document.getElementById('graficoMediaQ').getContext('2d');
        new Chart(ctx1, {
          type: 'line',
          data: {
            labels: ns,
            datasets: [{ label: 'Média de Q', data: mediasQ, borderColor: 'blue', fill: false }]
          },
          options: {
            scales: { x: { title: { display: true, text: 'Escala (n)' } }, y: { title: { display: true, text: 'Qualidade de Vida (Q)' }, min: 0, max: 100 } },
            plugins: { title: { display: true, text: 'Convergência de Q no Teorema da Entropia Democrática' } }
          }
        });

        const ctx2 = document.getElementById('graficoDesvioQ').getContext('2d');
        new Chart(ctx2, {
          type: 'line',
          data: {
            labels: ns,
            datasets: [{ label: 'Desvio de Q', data: desviosQ, borderColor: 'red', fill: false }]
          },
          options: {
            scales: { x: { title: { display: true, text: 'Escala (n)' } }, y: { title: { display: true, text: 'Desvio de Q' }, min: 0 } },
            plugins: { title: { display: true, text: 'Colapso da Variabilidade (Entropia Absoluta)' } }
          }
        });
      }

function simularMegaVotos(n, tamanhoGrupo = 1256, testes = 1000) {
  let Qs = [];
  const m = Math.ceil(n / tamanhoGrupo);
  for (let i = 0; i < testes; i++) {
    let megaPrefs = [];
    for (let j = 0; j < m; j++) {
      let grupoPrefs = Array(Math.min(tamanhoGrupo, n - j * tamanhoGrupo)).fill()
        .map(() => Math.max(0, Math.min(1, 0.5 + 0.2 * (Math.random() - 0.5) * 2)));
      let pGrupo = mediana(grupoPrefs);
      megaPrefs.push(pGrupo);
    }
    let Q = mediana(megaPrefs) * 100;
    Qs.push(Q);
  }
  let mediaQ = Qs.reduce((sum, q) => sum + q, 0) / testes;
  let desvioQ = Math.sqrt(Qs.reduce((sum, q) => sum + (q - mediaQ) ** 2, 0) / testes);
 
  return { mediaQ, desvioQ };
}

/*function gerarDadosGraficos() {
  const ns = [50, 200, 1256, 10000, 1000000];
  let mediasQ = [], desviosQ = [], mediasQMega = [], desviosQMega = [];
  ns.forEach(n => {
    const { mediaQ, desvioQ } = simularDemocracia(n);
    const { mediaQ: mediaQMega, desvioQ: desvioQMega } = simularMegaVotos(n);
    mediasQ.push(mediaQ);
    desviosQ.push(desvioQ);
    mediasQMega.push(mediaQMega);
    desviosQMega.push(desvioQMega);
    console.log(`n=${n}, Q médio=${mediaQ.toFixed(2)}, Desvio Q=${desvioQ.toFixed(2)}, Q médio (mega-votos)=${mediaQMega.toFixed(2)}, Desvio Q (mega-votos)=${desvioQMega.toFixed(2)}`);
  });
  return { ns, mediasQ, desviosQ, mediasQMega, desviosQMega };
}
*/

document.addEventListener('DOMContentLoaded', function() {
  try {
    plotarGraficos();

/*const { ns, mediasQ, desviosQ, mediasQMega, desviosQMega } = gerarDadosGraficos();
        const ctx1 = document.getElementById('graficoMediaQ').getContext('2d');
        new Chart(ctx1, {
          type: 'line',
          data: {
            labels: ns,
            datasets: [
              { label: 'Média de Q (Votação Direta)', data: mediasQ, borderColor: 'blue', fill: false },
              { label: 'Média de Q (Mega-Votos)', data: mediasQMega, borderColor: 'green', fill: false }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { title: { display: true, text: 'Escala (n)' } }, y: { title: { display: true, text: 'Qualidade de Vida (Q)' }, min: 0, max: 100 } },
            plugins: { title: { display: true, text: 'Convergência de Q: Votação Direta vs. Mega-Votos' } }
          }
        });

        const ctx2 = document.getElementById('graficoDesvioQ').getContext('2d');
        new Chart(ctx2, {
          type: 'line',
          data: {
            labels: ns,
            datasets: [
              { label: 'Desvio de Q (Votação Direta)', data: desviosQ, borderColor: 'red', fill: false },
              { label: 'Desvio de Q (Mega-Votos)', data: desviosQMega, borderColor: 'orange', fill: false }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { title: { display: true, text: 'Escala (n)' } }, y: { title: { display: true, text: 'Desvio de Q' }, min: 0 } },
            plugins: { title: { display: true, text: 'Variabilidade de Q: Votação Direta vs. Mega-Votos' } }
          }
        });*/
} catch (error) {
        console.error('Erro ao renderizar gráficos:', error);
  }
});
    
