# Framework Cross-Platform: Flutter vs React Native vs Nativo

> Pesquisado em: 24/08/2026 | Confiança: alta

## Resumo executivo
- **Flutter é a recomendação inicial** para o Papel: motor próprio (Impeller) dá controle total de cada pixel — exatamente o que os shaders de filtro (luz azul, e-reader, papel) exigem; animações estáveis 60-120fps; um código só para iOS+Android
- React Native (Fabric/JSI) renderiza views nativas — ótimo fidelidade de plataforma, mas manipulação de pixels customizada exige sair para código nativo mesmo assim
- Nativo puro (Swift + Kotlin) = melhor performance bruta e acesso imediato a PDFKit/PdfRenderer, porém 2 codebases completos = custo dobrado para um time enxuto
- Decisão final deve passar por um spike técnico: renderizar um PDF de 200MB com scroll 60fps + shader em Flutter vs nativo

## Comparação

| Critério | Flutter | React Native | Nativo (Swift/Kotlin) |
|---|---|---|---|
| Renderização | Própria (Impeller), pixel-level | Views nativas (UIKit/ViewGroups) | Nativa total |
| Shaders/filtros de tela | ✅ Fragment shaders first-class | ⚠️ Requer módulo nativo | ✅ Metal/GPU direto |
| Performance de scroll | AOT compilado, 60-120fps consistente | Boa com Fabric/JSI, casos extremos variam | Referência máxima |
| Acesso a PDFKit/PdfRenderer | Via platform channels (fácil) | Via native modules (fácil) | Direto |
| Codebase | 1 | 1 (+ponte nativa) | 2 |
| Consistência visual entre plataformas | Total (mesmo pixel) | Alta mas não idêntica | N/A |
| Ecossistema PDF | pdfrx, pdfx (baseados em PDFium) | react-native-pdf etc. | Oficiais |

## Descobertas principais

1. **Flutter/Impeller**: substituiu o Skia como engine padrão em iOS e Android; compilação AOT do Dart elimina a "bridge"; promessa de 60-120fps desde o primeiro frame ([TechAhead, 11/2025](https://www.techaheadcorp.com/blog/what-is-the-performance-of-flutter-vs-native-vs-react-native/))
2. **RN/Fabric**: reconciliação via Shadow Nodes + JSI sem serialização; layout Yoga; delega desenho ao toolkit nativo ([SynergyBoat benchmark](https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025))
3. **Quando escolher Flutter** (matriz 2026): animações complexas obrigatórias, consistência absoluta de design entre plataformas, manipulação gráfica/canvas intensiva ([dexteroussoftech, 07/2026](https://www.dexteroussoftech.com/blog/flutter-vs-react-native-in-2026-cross-platform-performance-and-native-bridge-benchmarks)) — os 3 critérios batem com o Papel
4. Nativo vence em: startup time marginalmente menor, bateria, acesso no dia-1 a APIs novas do SO

## Trade-off central do Papel
O app é essencialmente **um canvas de leitura com pipeline de cor** — não um app de formulários. Quanto mais "renderização própria", menos a vantagem "views nativas" do RN importa e mais a arquitetura do Flutter brilha. O risco do Flutter (plugins de PDF menos maduros que os nativos) é mitigável: o motor pesado (PDFium) roda fora do framework de UI em qualquer cenário.

## Contradições e incertezas
- Benchmarks variam por versão/metodologia; nenhum teste independente específico com PDFs gigantes em Impeller 2026 foi encontrado (unknown)
- Custo de memória do Flutter ~4-10MB acima do nativo em app simples — irrelevante aqui, mas monitorar com tiles de PDF

## Próximo passo (quando sair da fase aprendizado)
ADR-001: spike comparativo (Flutter `pdfrx` vs PDFKit nativo) com 3 PDFs de teste (10MB texto, 200MB escaneado, revista ilustrada).

## Fontes
- https://www.techaheadcorp.com/blog/what-is-the-performance-of-flutter-vs-native-vs-react-native/
- https://www.synergyboat.com/blog/flutter-vs-react-native-vs-native-performance-benchmark-2025
- https://asoasis.tech/articles/2026-03-11-1456-react-native-vs-flutter-performance-benchmark-2026/
