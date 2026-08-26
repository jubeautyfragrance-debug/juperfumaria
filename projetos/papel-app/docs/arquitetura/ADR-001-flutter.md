# ADR-001: Flutter como framework do Papel

> Data: 24/08/2026 | Status: DECIDIDO (validação pendente)

## Contexto
O Papel é um app de leitura de PDF cujo diferencial é manipular a cor da tela em tempo real (e-reader, luz azul, papel). Precisa rodar em iOS + Android com um time enxuto e design consistente nível AAA.

## Opções consideradas
1. **Flutter** (Dart, engine Impeller)
2. **React Native** (JS/TS, Fabric/JSI, views nativas)
3. **Nativo duplo** (Swift/SwiftUI + Kotlin/Compose)

## Decisão: Flutter

### Justificativa
1. **Controle pixel-level**: os filtros de tela exigem transformar cada frame renderizado (shader fragment). O Impeller desenha tudo no próprio canvas do Flutter — o filtro é aplicado direto na árvore de widgets. No RN seria obrigatório escrever módulo nativo mesmo assim; no nativo seriam 2 implementações.
2. **Consistência visual absoluta**: mesmo pixel em iOS e Android — requisito de "design Apple" sem divergência entre plataformas.
3. **Performance**: AOT compilado; 60-120fps consistentes com Impeller ([TechAhead 11/2025](https://www.techaheadcorp.com/blog/what-is-the-performance-of-flutter-vs-native-vs-react-native/)).
4. **Ecossistema PDF maduro**: `pdfrx` verificado (ver ADR-002) resolve o componente mais crítico dentro do próprio Flutter.

### Consequências
- ✅ Um codebase, hot reload, animações spring first-class
- ⚠️ Memória ~4-10MB acima do nativo (aceitável para leitor)
- ⚠️ Time precisa aprender Dart (curva baixa vindo de qualquer linguagem C-like)
- 🔧 Pré-requisito ambiente: instalar Flutter SDK + Android Studio; build iOS exige Mac (ou serviço cloud CI/CD — decidir antes do launch)

### Validação obrigatória (spike S1, antes de escrever features)
Renderizar PDF de teste (10MB texto / 200MB escaneado) com scroll contínuo:
- alvo: 60fps em scroll, memória < 250MB, sem jank visível
- medir com DevTools timeline em Android mid-range

## Fontes
- docs/pesquisa/frameworks.md
- https://docs.flutter.dev/platform-integration/impeller
