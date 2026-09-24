# Product Marketing Context

*Last updated: 2026-09-04*

Este contexto cobre **dois clientes** de uma agencia: **applebite.rj** (venda de iPhones) e **Ju Perfumaria** (perfumes). Cada cliente tem **site e Instagram** proprios; as vendas fecham pelo WhatsApp. Todas as skills de marketing (pricing-strategy, sales-enablement, copywriting, etc.) devem ler este documento primeiro.

---

## NEGOCIO 1 — applebite.rj (iPhones)

## Product Overview
**One-liner:** iPhones seminovos e atualizados com garantia, vendidos pelo WhatsApp no Rio de Janeiro.
**What it does:** Venda de iPhones (geracoes 12 a 16+) seminovos/novos, com atendimento de vendas personalizado via WhatsApp.
**Product category:** Eletronicos / smartphones Apple.
**Product type:** E-commerce de revenda de smartphones.
**Business model:** Venda direta ao consumidor (B2C), fechamento pelo WhatsApp (21 990498633).
**Site:** https://applebite-website.vercel.app (Next.js/Vercel)
**Instagram:** @applebite.rj (https://instagram.com/applebite.rj)

### Catalogo (precos reais vigentes)
- **iPhone 12**: R$2.150 (128GB) - R$2.850 (Pro Max 256GB)
- **iPhone 13**: R$2.350 (128GB) - R$3.350 (Pro Max/512GB)
- **iPhone 14**: R$2.750 (128GB) - R$3.690 (Pro Max 128GB)
- **iPhone 15**: R$3.350 (128GB) - R$4.750 (Pro Max 512GB)
- **iPhone 16**: R$4.350 (128GB) - R$5.750 (Pro Max 256GB)
- *Varia com model/armazenamento/condicao. Ver catalogo completo em `projetos/applebite-website/src/app/page.tsx`.*

## Target Audience
**Alvo:** consumidores no Rio de Janeiro que querem um iPhone com bom custo-beneficio (seminovo/atualizado) sem pagar preco de loja oficial.
**Decisores:** compradores pessoa fisica (18-40 anos).
**Primary use case:** comprar um iPhone a melhor preco com atendimento direto e confiavel.
**Jobs to be done:**
- Trocar/aproveitar o celular atual por um iPhone.
- Comprar um iPhone cujo preco caiba no orcamento (seminovo).
- Ser atendido rapidamente e ter garantia.

## Problems & Pain Points
**Core problem:** iPhones novos em loja oficial sao caros; comprar de terceiros tem risco de golpe/seminovo ruim.
**Why alternatives fall short:**
- Loja oficial: preco alto.
- Marketplace desconhecido: risco de produto falso/sem garantia.
**What it costs them:** dinheiro (preco alto) ou risco (compra insegura).
**Emotional tension:** medo de golpe, duvida sobre originalidade/garantia.

## Differentiation
**Key differentiators:** atendimento pessoal no WhatsApp, mixto de precos competitivos, garantia, entrega no Rio.
**Why customers choose us:** confianca no atendimento + preco justo + todo o processo pelo WhatsApp (rapido).

## Objections (top)
| Objection | Response |
|-----------|----------|
| "Pode ser roubado/clonado" | Garantia de originalidade + IMEI verificado |
| "Preco ainda alto" | Comparacao com loja oficial + opcoes seminovo mais baratas |
| "Como pago/entrega?" | WhatsApp fecha entrega e pagamento (Pix) no Rio |

---

## NEGOCIO 2 — Ju Perfumaria

## Product Overview
**One-liner:** Perfumes originais multimarcas (Boticario, Natura, Dior, Chanel, Lattafa e mais) para ela e para ele, vendidos pelo WhatsApp + site.
**What it does:** Venda de perfumes 100% originais, com frete gratis acima de R$199.
**Product category:** Cosmeticos / perfumaria.
**Product type:** E-commerce B2C.
**Business model:** Venda direta; checkout do site envia a lista de pedido pelo WhatsApp (21 996851605).
**Site:** https://juperfumaria.com.br (HTML estatico)
**Instagram:** @lojajujumultimarcas (https://www.instagram.com/lojajujumultimarcas/)

### Precificacao (range real)
- **Faixa de precos dos perfumes**: R$129 - R$899
- **Frete**: gratis acima de R$199
- **Pagamento**: Pix (em breve no site; por ora pelo WhatsApp)

## Target Audience
**Alvo:** pessoas que compram perfume original para uso proprio ou presente (ela/ele), no Rio.
**Primary use case:** comprar perfume original de marca com bom preco e frete gratis.
**Jobs to be done:**
- Comprar perfume presente com seguranca (originalidade).
- Achar grifes desejadas (Dior, Chanel, Boticario, etc.) a bom preco.

## Differentiation
**Key differentiators:** 100% originais, multimarcas (opcao variada), frete gratis acima de R$199, atendimento pelo WhatsApp com Ju.
**Why customers choose us:** originalidade garantida + variedade de grifes + entrega via WhatsApp.

## Objections (top)
| Objection | Response |
|-----------|----------|
| "E original mesmo?" | Garantia de originalidade, grifes oficiais |
| "Custo do frete" | Frete gratis acima de R$199 |
| "Qual presente?" | Curadoria por ocasiParao/pessoa |

---

## BRAND VOICE (ambos)
**Tom:** caloroso, direto, de confianca; vendedor pessoal (nao corporativo).
**Estilo:** conversacional, pt-BR, proximo.
**Personalidade:** confiavel, prestativo, descomplicado.

## GOALS
**Objetivo primario:** converter conversas de WhatsApp em vendas.
**Acao de conversao:** cliente finaliza o pedido no WhatsApp (envia lista/proposta e paga).
**Metodas:** volume de pedidos, ticket medio, indice de resposta e fechamento.

## SEGURANCA
- NAO automatizar postar/seguir/comentar no Instagram (risco de ban).
- NAO inventar precos; sempre usar os dados acima / catalogo dos sites.
