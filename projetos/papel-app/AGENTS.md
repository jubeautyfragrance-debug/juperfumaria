# Papel — App de Leitura de PDF (iOS + Android)

App de leitura de PDF com design nível Apple e modos de tela especiais:
**e-reader**, **filtro de luz azul** e **simulação de papel**.

## Estado atual: ARQUITETURA DECIDIDA — pronto para spike técnico
ADRs em `docs/arquitetura/`:
- ADR-001: Flutter (Impeller)
- ADR-002: pdfrx (PDFium) + opção pdfrx_coregraphics no iOS
- ADR-003: filtros de tela via shader/ColorFilter (nunca overlay)

Próximo passo: **spike S1** — instalar Flutter SDK e validar 60fps + pipeline de cor com pdfrx.

## Estado atual: PESQUISA SOCIAL ✅ COMPLETA
`docs/pesquisa/rede-social.md`: YouTube ✅ (transcrição analisada), X ⚠️ (evidência indireta),
Reddit ✅ via websearch `site:reddit.com` (24/08/2026). Busca semântica reddapi é upgrade opcional
se `REDDAPI_API_KEY`/`REDDAPI_AUTH` forem configuradas. Dores top: importação de arquivos,
conforto noturno (dim sub-mínimo + temp. de cor fina), preservação de contraste.

## Estrutura
- `docs/pesquisa/` — notas de pesquisa com fontes (frameworks, PDF, modos de tela, lojas, design)
- `docs/arquitetura/` — ADRs (quando a fase de decisão começar)
- `docs/design/` — design system e specs de telas
- `docs/stores/` — requisitos de publicação

## Subagentes do projeto (.opencode/agent/)
- `pesquisador-tech` — pesquisa profunda com fontes → docs/pesquisa/
- `arquiteto-mobile` — decisões técnicas/ADRs
- `designer-aaa` — design system padrão Apple
- `publicador-stores` — App Store / Google Play

## Requisitos fixos do produto
1. Ler PDFs já presentes no dispositivo (sem upload/servidor; offline-first)
2. Publicável na App Store e Google Play
3. Design nível AAA, estética Apple
4. Modo e-reader (tela tipo Kindle)
5. Filtro de luz azul ajustável dentro da leitura
6. Luz refletida o mais próximo possível de papel

## Conclusões de pesquisa (resumo)
- Framework recomendado inicial: **Flutter (Impeller)** — controle pixel-level p/ shaders dos filtros; validar com spike vs nativo
- Motor PDF: **PDFium** (BSD, grátis) no Android + **PDFKit** no iOS, ou PDFium nos dois; SDKs pagos (Nutrient/Apryse) desnecessários no MVP
- Filtros: transformação de cor via shader fragment (não overlay) — preserva contraste, sem permissões
- Lojas: $124 1º ano; Google pessoal novo exige 12 testadores × 14 dias; verificação Android obrigatória no Brasil a partir de 30/09/2026
