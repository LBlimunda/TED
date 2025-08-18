// Copyright (c) Lara Raquel Rodrigues Branco Arsénio, 2025
// Licensed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
document.addEventListener('DOMContentLoaded', function () {
  function plotarGraficos() {
    const ctx1 = document.getElementById('graficoMediaQ');
    if (!ctx1) {
      console.error('Elemento com ID "graficoMediaQ" não encontrado no DOM.');
      return;
    }
    const ctx2 = document.getElementById('graficoDesvioQ');
    if (!ctx2) {
      console.error('Elemento com ID "graficoDesvioQ" não encontrado no DOM.');
      return;
    }

    const { ns, mediasQ, desviosQ, mediasQMega, desviosQMega } = gerarDadosGraficos();

    // Verifica se mediasQ é válido
    if (!Array.isArray(mediasQ) || mediasQ.length === 0) {
      console.error('Dados de mediasQ inválidos ou vazios:', mediasQ);
      return;
    }

    // Gráfico de Média de Q (Parte 1 - Convergência para a Mediana)
    new Chart(ctx1.getContext('2d'), {
      type: 'line',
      data: {
        labels: ns,
        datasets: [
          {
            label: 'Média Q (Votação Direta)',
            data: mediasQ,
            borderColor: 'blue',
            fill: false,
            pointRadius: 4,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Escala (n)', font: { size: 12 } },
            ticks: { font: { size: 10 } }
          },
          y: {
            title: { display: true, text: 'Média de Q', font: { size: 12 } },
            ticks: {
              font: { size: 10 },
              stepSize: 0.1,
              precision: 1
            },
            min: Math.min(0, Math.min(...mediasQ) * 0.95),
            max: Math.max(1, Math.max(...mediasQ) * 1.05)
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Parte 1: Convergência para a Mediana (Estagnação)',
            font: { size: 14 },
            padding: 8
          },
          legend: {
            position: 'top',
            labels: { font: { size: 10 }, boxWidth: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        layout: {
          padding: { top: 5, bottom: 5, left: 10, right: 10 }
        }
      }
    });

    // Gráfico de Desvio de Q (Original, inalterado)
    new Chart(ctx2.getContext('2d'), {
      type: 'line',
      data: {
        labels: ns,
        datasets: [
          { label: 'Desvio Q (Votação Direta)', data: desviosQ, borderColor: 'red', fill: false },
          { label: 'Desvio Q (Mega-Votos)', data: desviosQMega, borderColor: 'orange', fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Escala (n)' } },
          y: { title: { display: true, text: 'Desvio de Q' }, min: 0 }
        },
        plugins: {
          title: { display: true, text: 'Variabilidade de Q: Votação Direta vs. Mega-Votos' }
        }
      }
    });
  }

  // Chama a função
  plotarGraficos();
});
