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
      if (n >= 1000000) {
        return { mediaQ: 50, desvioQ: 100 * Math.sqrt(0.1256 / n) }; // Fórmula teórica
      }
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
