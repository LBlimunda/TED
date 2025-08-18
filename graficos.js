// Copyright (c) Lara Raquel Rodrigues Branco Arsénio, 2025
// Licensed under CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
// Inclui Chart.js (MIT License): https://github.com/chartjs/Chart.js/blob/master/LICENSE

document.addEventListener('DOMContentLoaded', function () {
  function plotarGraficos() {
    const ctx1 = document.getElementById('graficoMediaQ');
    if (!ctx1) {
      console.error('Elemento com ID "graficoMediaQ" não encontrado.');
      return;
    }
    const ctx2 = document.getElementById('graficoDesvioQ');
    if (!ctx2) {
      console.error('Elemento com ID "graficoDesvioQ" não encontrado.');
      return;
    }

    const { ns, mediasQ, desviosQ, mediasQMega, desviosQMega } = gerarDadosGraficos();

    // Gráfico 1: Média de Q (Parte 1 - Convergência para a Mediana)
    new Chart(ctx1.getContext('2d'), {
      type: 'line',
      data: {
        labels: ns,
        datasets: [
          {
            label: 'Média Q (Votação Direta)',
            data: mediasQ,
            borderColor: '#1E90FF', // Azul
            backgroundColor: '#1E90FF',
            pointRadius: 4,
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Média Q (Mega-Votos)',
            data: mediasQMega,
            borderColor: '#32CD32', // Verde
            backgroundColor: '#32CD32',
            pointRadius: 4,
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        maxHeight: 400, // Fixa a altura máxima em 200px
        scales: {
          x: {
            title: { display: true, text: 'Escala (n)', font: { size: 12 } },
            ticks: { font: { size: 10 } }
          },
          y: {
            title: { display: true, text: 'Média de Q', font: { size: 12 } },
            ticks: {
              font: { size: 10 },
              stepSize: 0.1, // Ticks finos para convergência
              precision: 1
            },
            min: Math.min(0, Math.min(...mediasQ, ...mediasQMega) * 0.95),
            max: Math.max(1, Math.max(...mediasQ, ...mediasQMega) * 1.05)
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Parte 1: Convergência para Mediana (Estagnação)',
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

    // Gráfico 2: Desvio de Q (Parte 2 - Solução com Mega-Votos)
    new Chart(ctx2.getContext('2d'), {
      type: 'line',
      data: {
        labels: ns,
        datasets: [
          {
            label: 'Desvio Q (Votação Direta)',
            data: desviosQ,
            borderColor: '#FF4500', // Vermelho
            backgroundColor: '#FF4500',
            pointRadius: 4,
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Desvio Q (Mega-Votos)',
            data: desviosQMega,
            borderColor: '#FFA500', // Laranja
            backgroundColor: '#FFA500',
            pointRadius: 4,
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        maxHeight: 400, // Fixa a altura máxima em 200px
        scales: {
          x: {
            title: { display: true, text: 'Escala (n)', font: { size: 12 } },
            ticks: { font: { size: 10 } }
          },
          y: {
            title: { display: true, text: 'Desvio de Q', font: { size: 12 } },
            ticks: {
              font: { size: 10 },
              stepSize: 0.05, // Ticks finos para variabilidade
              precision: 2
            },
            min: 0,
            max: Math.max(0.5, Math.max(...desviosQ, ...desviosQMega) * 1.2)
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Parte 2: Mega-Votos Preservam Variabilidade',
            font: { size: summersize: 14 },
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
  }

  // Chama a função após o DOM estar carregado
  plotarGraficos();
});
