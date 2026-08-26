# Papel — Leitor de PDF

Leitor de PDF offline com design nível Apple, filtros de tela e modos de leitura.

## Funcionalidades

- **Biblioteca** — grid responsivo, busca, ordenação (recente/nome/tamanho/leitura), shimmer loading
- **Leitura** — pdfrx (PDFium), barra de ferramentas com gradiente, busca no texto, bookmark, compartilhar
- **5 modos de tela** — Original, Sépia, Noite, E-reader, Papel
- **Filtros** — temperatura de cor (2700K–6500K), brilho, contraste, grão de papel
- **Word Wheel** — roda de palavras para navegação rápida
- **Estatísticas** — tempo de leitura, páginas visitadas, progresso
- **Sleep Timer** — timer de sono com haptic feedback
- **Offline-first** — zero dados coletados, zero analytics, zero internet

## Requisitos

- Flutter SDK 3.47.1+ stable
- Dart 3.13.1+
- Android SDK 21+ (API 21)
- iOS 13.0+
- Xcode 16+ (para iOS)

## Setup

```bash
# 1. Instalar dependências
flutter pub get

# 2. Rodar testes
flutter test

# 3. Build debug
flutter build apk --debug

# 4. Rodar em dispositivo
flutter run
```

## Build Release

### Android

```bash
# Gerar keystore (só uma vez)
bash scripts/generate-keystore.sh

# Build release
flutter build apk --release

# APK gerado em: build/app/outputs/flutter-apk/app-release.apk
```

### iOS (requer macOS)

```bash
# Criar projeto iOS
flutter create --platforms=ios .

# Abrir no Xcode
open ios/Runner.xcworkspace

# Configurar signing team e Bundle ID no Xcode
# Build via Xcode ou:
flutter build ios --release
```

## Estrutura do Projeto

```
lib/
├── main.dart              # App entry + PaginaInicial
├── roda_leitura.dart      # Word Wheel
├── models/
│   └── pdf_item.dart      # Modelo de PDF
├── services/
│   ├── prefs_service.dart  # Preferências (SP) + biblioteca (Hive) com fila atômica
│   ├── file_service.dart   # File picker, stats, bookmarks, thumbnails
│   └── color_filter_service.dart  # Matrizes de cor
├── screens/
│   ├── biblioteca_screen.dart  # Grid + busca + ordenação
│   └── leitor_screen.dart      # Leitor PDF completo
├── theme/
│   ├── tokens.dart         # Design tokens (8pt grid)
│   └── themes.dart         # 4 temas (light/dark/e-reader/papel)
└── widgets/
    ├── card_pdf.dart           # Card com scale-down
    ├── barra_ferramentas_leitor.dart  # Toolbar com gradiente
    ├── barra_busca_leitor.dart  # Busca no texto
    ├── sheet_ajustes.dart      # Bottom sheet de config
    ├── sheet_navegacao.dart    # TOC / navegação
    ├── timer_sono.dart         # Sleep timer
    ├── shimmer_skeleton.dart   # Loading skeleton
    ├── textura_grao.dart       # Grão animado (repaint isolado)
    ├── medidor_fps.dart        # FPS overlay (debug)
    └── slide_up_route.dart     # Transição Apple-style
```

## Testes

```bash
flutter test                  # Todos (29 testes)
flutter test --coverage       # Com cobertura
```

### Cobertura

- `color_filter_service_test.dart` — 11 testes (temperatureToMatrix, withContrast)
- `pdf_item_test.dart` — 18 testes (toJson, fromJson, copyWith com nullable reset, formatação)
- `prefs_service_test.dart` — 12 testes (fila de escrita atômica, tema vs modo de leitura)
- `widget_test.dart` — 1 smoke test

## Docs

- `docs/stores/contas-e-custos.md` — Custos Apple/Google, CPF/CNPJ Brasil
- `docs/stores/requisitos-revisao.md` — Guidelines de revisão
- `docs/stores/privacidade.md` — Privacy Manifest, Data Safety
- `docs/stores/checklist-lancamento.md` — Checklist completo
- `docs/stores/app-store-listing.md` — Listing App Store pronto
- `docs/stores/google-play-listing.md` — Listing Google Play pronto

## Permissões

### Android
- Nenhuma permissão de armazenamento — `file_picker` usa SAF (Storage Access Framework)
- `WAKE_LOCK` — tela ligada durante leitura

> **Nota:** `MANAGE_EXTERNAL_STORAGE` e `READ_MEDIA_IMAGES` foram removidas — a primeira é
> rejeitada pelo Google Play fora das categorias gerenciador de arquivos/antivírus, e nenhuma
> das duas é necessária para importar PDFs via SAF.

### iOS
- Nenhuma usage description necessária — o document picker do iOS não exige permissões

> **Nota:** removidas `NSPhotoLibraryAddUsageDescription` (permissão errada para importar PDFs)
> e `NSFileReadComplete` (não é uma chave válida de Info.plist).

## Persistência

- **Biblioteca**: box do Hive (`hive_ce`) — um registro por PDF, suporta bibliotecas grandes.
  Migração automática one-time dos dados legados do SharedPreferences na primeira execução.
- **Preferências** (tema, brilho, temperatura, etc.): SharedPreferences.
- Toda mutação da biblioteca passa por uma fila de escrita serializada — sem lost updates.

## Design

- **Grid:** 8pt base
- **Tipografia:** New York (display) + SF Pro Text (body)
- **Animações:** spring (mass:1, stiffness:220, damping:20)
- **Transições:** slide-up + fade (Apple-style)
- **Haptics:** light/medium/heavy impact conforme contexto

## Licença

Proprietário — não distribuir.
