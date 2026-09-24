# 🛒 Vendedor — Agente de Vendas (iPhones + Perfumes)

Projeto **autônomo** do agente de vendas **Vendedor** e de todo o stack de
skills de marketing que ele usa. É uma versão destacada do que está instalado
em `.agents/skills/` na raiz do workspace, para poder viver (e ser instalado)
fora dele.

É um agente de uma **agência** que atende **dois clientes**, cada um com **site e Instagram** próprios, vendendo 100% pelo WhatsApp:

| Cliente | Negócio | WhatsApp (Business) | Instagram | Site |
|---|---|---|---|---|
| `applebite.rj` | iPhones | 21 990498633 | @applebite.rj | applebite-website (Next.js/Vercel) |
| Ju Perfumaria | Perfumes | 21 996851605 | @lojajujumultimarcas | site-ju-perfumaria (HTML estático) |

## O que tem aqui

```
projetos/vendedor/
├── README.md                     ← este arquivo
├── product-marketing-context.md  ← contexto de produto/posicionamento dos 2 negócios (leia primeiro)
└── skills/                       ← 1 skill por pasta, prontas para instalar
    ├── vendedor/                 ← o agente de vendas em si (SKILL.md)
    ├── pricing-strategy/
    ├── sales-enablement/
    ├── copywriting/
    ├── marketing-ideas/
    ├── social-content/
    ├── video/
    ├── customer-research/
    ├── competitor-profiling/
    ├── content-strategy/
    └── product-marketing-context/
```

## Como usar

1. **Instalar num projeto/agente**: copie o conteúdo de `skills/` para o
   diretório de skills do agente destino (ex.: `.agents/skills/` ou
   `.claude/skills/`). Cada pasta já tem a estrutura esperada (`SKILL.md` +
   `references/` + `evals/`).
2. **Contexto primeiro**: o agente deve ler `product-marketing-context.md`
   antes de qualquer skill de marketing (posicionamento, precificação, público
   e objeções dos dois negócios).
3. **Dados de referência**: a skill `vendedor` aponta para catálogos reais
   (`applebite-website/src/app/page.tsx` e `site-ju-perfumaria/index.html`).
   Se este projeto for usado fora do workspace, ajuste esses caminhos ou
   mantenha os catálogos atualizados — nunca inventar preços.

## Origem / sincronização

Este projeto é uma **cópia** do stack instalado em `.agents/skills/` na raiz do
workspace (`juperfumaria`). As cópias ficam em `projetos/vendedor/skills/`.
Mudanças feitas aqui **não** alteram a instalação ativa — para propagar, copie
a pasta modificada de volta para `.agents/skills/` (ou o contrário).

## Regras de segurança (valem para o agente)

- Não automatizar postagem/seguir/comentar no Instagram (risco de ban).
- Nunca inventar preços; basear-se nos catálogos reais dos sites.
- Responder sempre em português (pt-BR), direto e orientado a fechar.
