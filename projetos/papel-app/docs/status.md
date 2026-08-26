# Status do Papel — atualizado em 25/08/2026

> Resumo para retomada rápida de contexto em conversas futuras.

## Onde estamos: spike S1 concluído e revisado ✅

O spike S1 (`spike_s1/`) está **funcional e validado**: analyzer limpo,
**41/41 testes passando**, `flutter build apk --debug` e `--profile` compilando.

## Última sessão — review senior + correções (commits `7568ac1`, `0440119`)

Uma review senior identificou problemas; todos foram corrigidos:

### Corrigido

1. **Permissões bloqueantes de loja**
   - AndroidManifest: removidas `MANAGE_EXTERNAL_STORAGE`, `READ_MEDIA_IMAGES`,
     `READ_EXTERNAL_STORAGE` e `requestLegacyExternalStorage` — file_picker usa SAF
   - Info.plist iOS: removidas `NSPhotoLibraryAddUsageDescription` (permissão errada)
     e `NSFileReadComplete` (chave inválida)
   - Resta apenas `WAKE_LOCK`

2. **Persistência sem race conditions + banco local (Hive)**
   - Biblioteca migrou do SharedPreferences (JSON único) para box Hive (`hive_ce`)
   - Fila de escrita serializada via `PrefsService.mutateLibrary()` — mutações
     concorrentes nunca se sobrescrevem
   - Migração automática one-time dos dados legados do SharedPreferences
   - Funciona em Android/iOS/web (IndexedDB)

3. **Tema separado do modo de leitura**
   - Nova chave `readerMode` independente do `themeMode`
   - Hack de troca de tema no fluxo e-reader substituído por
     `LeitorScreen(modoInicial: ModoTela.ereader)`

4. **Grão animado conforme ADR-003**
   - Novo widget `lib/widgets/textura_grao.dart`: `RepaintBoundary` +
     `AnimationController` próprio (~8fps), repinta só a camada de grão —
     não reconstrói mais o PdfViewer 8×/s via setState

5. **Outros**
   - `SystemChrome.setSystemUIOverlayStyle` saiu do `build()` → `AnnotatedRegion`
   - Thumbnails reais: pdfrx renderiza página 1 → PNG salvo em
     `documents/thumbnails/`; CardPdf usa `Image.file`
   - `copyWith` com sentinel: `copyWith(campo: null)` limpa campos nullable
   - `.gitignore`: android/build/, ios/Flutter/ephemeral fora do git

### Testes: 29 → 41

Novos testes cobrem fila de escrita (lost updates), migração legada,
persistência entre instâncias, JSON corrompido e independência tema/reader mode.
Arquivo: `test/prefs_service_test.dart`.

## Pendências / próximos passos

1. **Validar 60fps em dispositivo real** ⏳ EM ANDAMENTO
   - Nenhum aparelho conectado na última sessão; usuário optou por instalar APK manual
   - APK profile pronto: `spike_s1/build/app/outputs/flutter-apk/app-profile.apk`
   - MedidorFps agora aparece também em modo **profile** (não só debug):
     verde = ≥55fps, laranja = abaixo; canto superior esquerdo do leitor
   - Protocolo (pior caso primeiro): (1) PDF pesado + modo Papel, grão 100%,
     scroll rápido; (2) E-reader com zoom 2× + pan; (3) Noite + busca;
     (4) sleep timer + toolbar animando. Se cair <55fps por >1–2s, anotar o modo
2. Publicação nas lojas — ver `docs/stores/`; Google exige 12 testadores × 14 dias
   para conta pessoal nova; verificação Android obrigatória no Brasil a partir de 30/09/2026
3. Possíveis próximos: testes de widget do fluxo de importar PDF; build release assinado
   (`scripts/generate-keystore.sh`); avaliar shader real de grão (Impeller) se o
   RepaintBoundary não bastar nos testes de FPS

## Contexto técnico essencial

- Flutter (Impeller), Dart SDK ^3.13.1 · applicationId `dev.papel.app`, targetSdk 35
- PDF: pdfrx ^2.4.7 (PDFium) · file_picker ^12 (SAF, API estática não-nula)
- Dependências novas desta sessão: `hive_ce`, `hive_ce_flutter`, `path_provider`
- Estrutura: `models/services/screens/widgets/theme` — detalhes no README do spike
- ADRs: Flutter (001), pdfrx/PDFium (002), filtros via matriz de cor nunca overlay (003)
- Requisitos fixos do produto: ver `AGENTS.md` na raiz do papel-app

## Como me situar numa conversa futura

Peça ao agente para ler este arquivo + `AGENTS.md`. O estado do código está nos
commits citados acima; `git log --oneline -5` confirma.
