# Teorema da Entropia Democrática (TED)

**Autora:** Lara Raquel Rodrigues Branco Arsénio, 2025  
**Licença:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

---

## Descrição

## Teorema da Entropia Democrática (TED)

### 1. Título e Autor

**Teorema da Entropia Democrática**
Autor(a): Lara Raquel Rodrigues Branco Arsénio
Versão: 678999999
Data de criação: 25/08/2025

---

### 2. Resumo

O teorema propõe que, em democracias de larga escala, a agregação de preferências individuais tende a um valor mediano, criando um efeito de entropia ou achatamento das decisões. Esse comportamento limita a obtenção de decisões excecionais, com implicações também para sistemas de IA que agregam inputs massivos.

---

### 3. Introdução

* **Motivação:** Explorar como o tamanho e a diversidade de participantes impactam a qualidade de decisões coletivas.
* **Contexto:** Democracia, agregação de preferências, sistemas complexos.
* **Objetivo:** Formalizar o efeito de "mínimo denominador comum" e propor conceitos para análise futura.

---

### 4. Definições

* **Variáveis:**

  * $p_i \in [0,1]$ - preferências individuais.
  * $n$ - número de participantes.
  * $Q = 100 \cdot \text{mediana}(p_i)$ - qualidade coletiva.
* **Conceitos:**

  * MDC - mínimo denominador comum.
  * Entropia democrática - achatamento ou perda de nuance em decisões coletivas.

---

### 5. Enunciado do Teorema

À medida que $n \to \infty$, a qualidade coletiva $Q_n$ converge para a mediana global das preferências individuais, e a variância de $Q_n$ diminui, tornando praticamente impossível alcançar decisões excecionais sem reorganização estrutural do processo de decisão.

---

### 6. Exemplos / Ilustrações

* Simulações JavaScript ou gráficos mostrando convergência da mediana com $n$ crescente.
* Aplicação hipotética à União Europeia ou grandes votações online.

---

### 7. Observações e Limitações

* Assumptos sobre distribuição de $p_i$ (uniforme, normal, enviesada).
* Mediana como agregador simplifica sistemas complexos.
* Possível influência de lobby, ruído ou manipulação não modelada.

---

### 8. Sugestões para Futuras Revisões

* Exploração estatística detalhada (desvio padrão, distribuição).
* Comparação com outros agregadores (média ponderada, vot

---

## Estrutura do Projeto

- `teorema.html` – Página principal com descrição teórica, fórmulas, tabela e gráficos.
- `Teorema-simulacoes.html` - Simulações e cálculos - consola

---

## Funcionalidades

- Apresenta o TED com texto, fórmulas matemáticas e explicações.  
- Simula Q para diferentes tamanhos populacionais.  
- Calcula automaticamente o ponto crítico de entropia (N<sub>crit</sub>).  
- Gera gráficos comparativos para várias amostras de n.  
- Tabelas de estatísticas com média e desvio padrão de Q.  
- Layout acadêmico pronto para pre-print ou exportação para PDF.

---

## Tecnologias

- HTML5, CSS3  
- JavaScript  
- [Chart.js](https://www.chartjs.org/) para gráficos interativos  

Funciona em qualquer navegador moderno sem dependências externas adicionais.

---

## Uso

1. Abrir `teorema.html` em um navegador moderno.  
2. Visualizar gráficos e tabela de estatísticas de Q.  
3. Consultar o ponto crítico de entropia N<sub>crit</sub>.  
4. Exportar para PDF se desejar compartilhar como pre-print.

---

## Referências

- Conceitos de entropia e mediocridade coletiva aplicados à democracia.  
- Teorema do Limite Central para comparação estatística.
- AI / Machine Learning 
- Chart.js (MIT License) para gráficos interativos.

---

## Licença

Este trabalho está licenciado sob **[Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**. Pode ser compartilhado e adaptado, desde que atribuída a autora original e mantida a mesma licença.
