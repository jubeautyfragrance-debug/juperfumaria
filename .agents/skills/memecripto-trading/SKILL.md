---
name: memecripto-trading
description: Estrategia completa de trading de memecoins na Solana baseada em rastreamento de carteiras lucrativas (top traders) no GMGN.ai, Dexscreener, BullX, Cielo e J7 Tracker. Use quando o usuario quiser operar memecoins, analisar carteiras on-chain, configurar alertas de compra, montar watchlist de carteiras lucrativas, avaliar win rate ou PnL 30D, fazer copy trading, verificar honeypot, insider ou phishing, ou maximizar lucratividade seguindo a estrategia do MOC - Estrategia Memecripto. Tambem use para gerenciar o processo de screener, top traders, validacao no GMGN, watchlist e alertas.
---

# Memecripto Trading

Estrategia de trading de memecoins na Solana: encontrar tokens bombando, identificar as carteiras que mais lucram (top traders), validar com analise on-chain e monitorar as melhores.

## Estrutura do Projeto no Obsidian

O conhecimento detalhado vive no vault Obsidian em `ia/side-hustle-meme-coins-trading/`:

- **[[MOC - Estrategia Memecripto]]** — hub central (sempre a referencia raiz)
- **[[Metodo Passo a Passo]]** — fluxo em 6 passos
- **[[Filtros e Metricas GMGN]]** — filtros e prioridades
- **[[Lista de Carteiras (Planilha)]]** — modelo de planilha + rotina
- **[[Selecao Pesada]]** — criterios rigorosos
- **[[Alertas e Copy Trading]]** — alertas e copy
- **[[Analise de Risco de Carteiras]]** — red flags e checklist
- **[[Ferramentas de Rastreamento On-chain]]** — guia de ferramentas
- **[[Skills e Ferramentas de Desempenho]]** — skills de IA para performance

## Workflow Completo (6 Passos)

### 1. Encontrar Tokens em Alta (Screener)

Use Dexscreener, Birdeye, Photon, BullX ou GMGN.ai. Filtros:
- **Trending 24h** + **volume alto**
- **Cadeia Solana** (foco)
- Tokens novos ou em alta

Para iniciantes: evite "new pairs" (perdem 30% num piscar de olhos). Prefira tokens "graduados".

### 2. Identificar Top Traders

No token escolhido, abra a aba **Top Traders / Top Holders** e ordene por **PnL** ou volume.

Procure carteiras que:
- Entraram cedo
- Tem lucro alto (+$10k, +$20k)
- Nao venderam tudo ainda (ou venderam com bom timing)

### 3. Copiar Endereco da Carteira

Copie o endereco do trader lucrativo (botao Wallet Copy no GMGN).

### 4. Validar no GMGN.ai (Passo Critico)

Cole o endereco em https://gmgn.ai e avalie:
- **PnL 7D e 30D** — positivo e consistente
- **Win Rate** — idealmente acima de 40-50%
- **Historico de transacoes** — varias trades (nao so 1-2)
- **Unrealized profits**
- **Phishing Check** — precisa estar limpo (verde)
- **Risco de bot / insider** — baixo

### 5. Aplicar Criterios da Selecao Pesada

A carteira so entra na watchlist se passar em **TODOS**:
- Win Rate >= 50% (30D)
- PnL 30D >= +$10.000
- Pelo menos 20 trades nos ultimos 30 dias
- Nao concentra > 40% do lucro em 1 token
- Compra antes do token fazer 3x-5x
- Phishing Check 100% limpo
- Nao e carteira de projeto / insider

Se falhar em algum criterio obrigatorio: **descartar na hora**.

### 6. Monitorar (Watchlist + Alertas)

- Salve as melhores na watchlist do GMGN / Dexscreener / BullX
- Configure alertas de nova compra: GMGN, BullX ou Cielo Finance
- Revise performance a cada 3-7 dias
- Comece com **5-10 carteiras no maximo** (qualidade > quantidade)
- Cuidado com copy trade: risco altissimo

## Metricas Priorizadas

| Prioridade | Metrica | Bom | Ruim |
|---|---|---|---|
| 1 | Win Rate | > 45-50% | < 35% |
| 2 | PnL 7D/30D | Positivo e consistente | 1 trade bom, resto zero |
| 3 | Nº de trades | >= 15-20 | 2-3 trades |
| 4 | Tamanho medio | Razoavel | Muito alto (insider) |
| 5 | Timing | Compra cedo | So compra apos subir 5-10x |
| 6 | Phishing | Verde | Qualquer alerta vermelho |

## Ferramentas Essenciais

| Ferramenta | Uso |
|---|---|
| **GMGN.ai** | Analise principal de carteiras (PnL, Win Rate, phishing) |
| **Dexscreener** | Screener + top traders |
| **BullX** | Terminal de trading + wallet tracker + alertas |
| **Cielo Finance** | Alertas de carteiras em tempo real |
| **J7 Tracker** | Monitor de tweets (Musk, Trump) + deploy de tokens |
| **Axiom** | Compra/venda, filtros: MC >= $10k, global fees >= 0.1, volume >= $30k |
| **Photon/Birdeye** | Discovery early + analytics |
| **Phantom** | Wallet de execucao |

## Red Flags (Descarte Imediato)

- Phishing Check vermelho
- Poucas trades (< 10) — amostragem insuficiente
- Tamanho de entrada gigante — possivel insider
- Compra so em 1 token — pode ser carteira do projeto
- Win rate > 80% consistente — suspeito (insider/bot)
- Liquidez removida — rug pull
- Tax de venda alta (> 10%) — possivel honeypot

## Gestao de Risco

- Nunca invista mais do que pode perder **100%**
- Maximo de 5% do capital por trade
- Defina stop-loss antes de entrar
- Sem revenge trading
- Reserve >= 50% do capital em stablecoins
- Checklist pre-entrada: phishing verde?, liquidez ok?, taxa de venda < 10%?, stop-loss definido?, posicao < 5% do capital?

## Execucao Diaria

| Quando | Acao |
|---|---|
| Manha | Ver tokens trending 24h (Dexscreener/Axiom) |
| Manha | Pegar top 3-5 traders de cada token |
| Manha | Analisar carteiras no GMGN |
| Tarde | Atualizar planilha de carteiras |
| Noite | Revisar alertas de compra (BullX/Cielo) |
| Semanal | Revisar performance de todas as carteiras da planilha |