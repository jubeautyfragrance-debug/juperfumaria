# wakelock_plus e share_plus

> Pesquisado em: 2026-08-25 | Confiança: alta

## Resumo executivo

### wakelock_plus
- **v1.4.0+**: Suporta Android, iOS, macOS, Windows, Linux, Web
- **Sem permissões especiais**: Apenas screen wakelock (não CPU wakelock)
- **Issues conhecidos**: AGP 9 incompatibilidade (Kotlin plugin), NoActivityException quando app em background
- **Padrão**: Habilitar/desabilitar baseado em ciclo de vida do widget, não em `main()`

### share_plus
- **v13.3.0**: API atual com `SharePlus.instance.share(ShareParams(...))`
- **BREAKING**: Migrou de `Share.share()` para `SharePlus.instance.share()`
- **iOS 26 crash**: `sharePositionOrigin` agora obrigatório em todos os dispositivos iOS
- **iPad**: `sharePositionOrigin` sempre necessário (popover presentation)
- **Android 14+**: Save action via `EXTRA_CHOOSER_CUSTOM_ACTIONS` (PR #3914)

## wakelock_plus - Detailed Findings

### Best Practices

**Fonte**: [wakelock_plus pub.dev](https://pub.dev/packages/wakelock_plus):
```dart
// ❌ NÃO fazer em main()
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  WakelockPlus.enable(); // RUIM - será liberado pelo OS eventualmente
  runApp(MyApp());
}

// ✅ Fazer no widget que precisa
class ReadingScreen extends StatefulWidget {
  @override
  _ReadingScreenState createState() => _ReadingScreenState();
}

class _ReadingScreenState extends State<ReadingScreen> 
    with WidgetsBindingObserver {
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WakelockPlus.enable();
  }
  
  @override
  void dispose() {
    WakelockPlus.disable();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }
  
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      WakelockPlus.enable(); // Re-habilitar ao voltar
    } else if (state == AppLifecycleState.paused) {
      WakelockPlus.disable(); // Liberar ao ir para background
    }
  }
  
  @override
  Widget build(BuildContext context) {
    // ...
  }
}
```

### Known Issues

**1. AGP 9 Incompatibility** ([Issue #117](https://github.com/fluttercommunity/wakelock_plus/issues/117)):
- `wakelock_plus` aplica plugin `kotlin-android` no `build.gradle`
- AGP 9.0+ já tem Kotlin built-in; aplicar `kotlin-android` causa build failure
- **Solução temporária**: `android.builtInKotlin=false` em `gradle.properties`
- **Solução permanente**: PR #136 migrou para Built-in Kotlin (merged)
- **Status**: Resolvido na v1.7.0+, mas pode ter issues com AGP 8.x + Kotlin 2.2.20

**2. NoActivityException** ([PR #134](https://github.com/fluttercommunity/wakelock_plus/pull/134)):
- `Wakelock.toggle()/isEnabled()` jogava exceção quando chamado sem activity (app em background)
- **Fix**: Estado agora é rastreado em Kotlin e re-aplicado quando activity retorna
- **Impacto**: Crash não-fatal em apps que desabilitam wakelock fora do foreground
- **Status**: Resolvido na v1.6.2+

**3. iOS Screen Not Staying On** ([Issue #110](https://github.com/fluttercommunity/wakelock_plus/issues/110)):
- iOS 16.4+ pode não manter tela ligada mesmo com wakelock habilitado
- **Causa**: Implementação Objective-C pode ter issues
- **Solução planejada**: Migrar para Swift (port de [Insomnia.swift](https://github.com/ochococo/Insomnia))
- **Status**: Issue aberta desde 2025-10-07

**4. NDK Version Error**:
```
One or more plugins require a higher Android NDK version.
```
- **Solução**: Adicionar `ndkVersion flutter.ndkVersion` no `build.gradle` do módulo `app`

### Edge Cases

1. **Timer periódico**: Não recomendado — pode causar drain de bateria
2. **Múltiplas chamadas**: Não há problema em chamar `enable()` múltiplas vezes
3. **Toggle rápido**: Usar `await` para garantir conclusão antes de próxima ação
4. **Web**: Funciona mas com limitações — usa Page Visibility API

## share_plus - Detailed Findings

### Latest API (v13.3.0)

**Fonte**: [share_plus pub.dev](https://pub.dev/packages/share_plus):
```dart
// API atual (v13+)
import 'package:share_plus/share_plus.dart';

// Compartilhar texto
await SharePlus.instance.share(
  ShareParams(text: 'Olá!'),
);

// Compartilhar arquivo
await SharePlus.instance.share(
  ShareParams(
    files: [XFile('/path/to/file.pdf')],
    title: 'Meu PDF',
  ),
);

// Compartilhar URI (iOS busca metadata)
await SharePlus.instance.share(
  ShareParams(uri: Uri.parse('https://example.com')),
);

// Com resultado
final result = await SharePlus.instance.share(
  ShareParams(text: 'Teste'),
);
if (result.status == ShareResultStatus.success) {
  print('Compartilhado!');
}
```

### Requirements

**Fonte**: [share_plus README](https://pub.dev/packages/share_plus):
- Flutter >=3.38.1
- Dart >=3.10.0 <4.0.0
- iOS >=13.0
- macOS >=10.15
- Java 17
- Kotlin 2.2.0
- Android Gradle Plugin >=8.12.1
- Gradle wrapper >=8.13

### iOS 26 Crash Fix

**Fonte**: [Flutter share_plus Crash on iOS 26](https://www.nathanfox.net/p/flutter-share_plus-crash-on-ios-26):
```dart
// ❌ CRASH no iOS 26
await SharePlus.instance.share(
  ShareParams(files: [XFile('doc.pdf')]),
);

// ✅ SEGURO - sempre fornecer sharePositionOrigin
final box = context.findRenderObject() as RenderBox?;
final sharePositionOrigin = box != null
    ? box.localToGlobal(Offset.zero) & box.size
    : Rect.fromLTWH(0, 0, 100, 100); // fallback

await SharePlus.instance.share(
  ShareParams(
    files: [XFile('doc.pdf')],
    sharePositionOrigin: sharePositionOrigin,
  ),
);
```

**Causa**: iOS 26 valida `sharePositionOrigin` em TODOS dispositivos (não apenas iPad). Sem o parâmetro, `UIActivityViewController` crasha com `PlatformException`.

### iPad Support

**Fonte**: [share_plus Issue #3730](https://github.com/fluttercommunity/plus_plugins/issues/3730):
- iPad usa `UIPopoverPresentationController` (popover)
- REQUER `sharePositionOrigin` para âncora
- Sem o parâmetro, share sheet falha silenciosamente

**Solução robusta**:
```dart
Rect _getSharePositionOrigin(BuildContext context) {
  final box = context.findRenderObject() as RenderBox?;
  if (box != null) {
    return box.localToGlobal(Offset.zero) & box.size;
  }
  // Fallback: centro da tela
  final size = MediaQuery.of(context).size;
  final center = Offset(size.width / 2, size.height / 2);
  return center & const Size(1, 1);
}
```

### Android 14+ Save Action

**Fonte**: [PR #3914 - Android Save Action](https://github.com/fluttercommunity/plus_plugins/pull/3914):
- Novo: `androidIncludeSaveAction` e `AndroidSaveActionLabels`
- Salva imagens em Pictures, vídeos em Movies, outros em Downloads via MediaStore
- Requer Android 14+ (API 34)
- Não requer permissão de storage
- Mostra progresso e feedback nativo

```dart
await SharePlus.instance.share(
  ShareParams(
    files: [XFile('photo.jpg')],
    androidIncludeSaveAction: true,
    androidSaveActionLabels: AndroidSaveActionLabels(
      save: 'Salvar',
      saving: 'Salvando...',
      saved: 'Salvo!',
      error: 'Erro ao salvar',
    ),
  ),
);
```

### Known Issues

**1. Main Thread I/O** ([Issue #3770](https://github.com/fluttercommunity/plus_plugins/issues/3770)):
- Android implementação fazia I/O na main thread
- **Fix**: PR #3931 move I/O para coroutine scope (v13.3.0+)

**2. R8 Full Mode** ([Issue #3602](https://github.com/fluttercommunity/plus_plugins/issues/3602)):
- Release builds com R8 full mode podem falhar
- **Solução**: Adicionar regra ProGuard:
```
-keep class org.xmlpull.** { *; }
```

**3. XFile.fromData Temp Files**:
- Arquivos criados com `XFile.fromData` são escritos no cache
- OS deve limpar, mas recomendado limpar manualmente periodically
- Usar `path_provider.getTemporaryDirectory()` para acesso

**4. Facebook/Meta Apps**:
- Não é possível compartilhar confiavelmente para Facebook Messenger
- Restrições da API do Facebook
- Usar Facebook Sharing SDK nativo para esses casos

### Platform Differences

| Feature | Android | iOS | macOS | Web | Linux | Windows |
|---------|---------|-----|-------|-----|-------|---------|
| Text | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| URI | ✅ | ✅ | ✅ | Texto | Texto | Texto |
| Files | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| sharePositionOrigin | Não necessário | Obrigatório (iOS 26+) | Obrigatório | N/A | N/A | N/A |
| Save Action | Android 14+ | N/A | N/A | N/A | N/A | N/A |

## Contradições e incertezas

1. **wakelock_plus AGP 9**: PR #136 foi merged mas há issue #141 reportando falha em AGP 8.x + Kotlin 2.2.20. **Status**: Possível regressão; testar antes de production.

2. **share_plus iOS 26**: Documentação diz que v12.0.1+ resolve internamente, mas melhor sempre fornecer `sharePositionOrigin` para compatibilidade.

3. **Linux file sharing**: share_plus NÃO suporta compartilhar arquivos no Linux. Alternativa: usar `url_launcher` ou `flutter_mailer`.

## Recomendação para o Papel

### wakelock_plus
1. Habilitar wakelock apenas durante sessão de leitura ativa
2. Desabilitar ao ir para background
3. Re-habilitar ao voltar para foreground
4. Usar `WidgetsBindingObserver` para lifecycle management
5. Testar em iOS 16.4+ (possível issue com screen staying on)

### share_plus
1. **SEMPRE** fornecer `sharePositionOrigin` (iOS 26 crash)
2. Usar `SharePlus.instance.share(ShareParams(...))` (API v13+)
3. Para iPad: calcular origin do botão clicado
4. Para Android 14+: considerar `androidIncludeSaveAction`
5. Limpar temp files periodicamente

## Fontes

- [wakelock_plus pub.dev](https://pub.dev/packages/wakelock_plus) - v1.4.0
- [wakelock_plus GitHub](https://github.com/fluttercommunity/wakelock_plus)
- [wakelock_plus Issue #106 - Keep screen always on](https://github.com/fluttercommunity/wakelock_plus/issues/106)
- [wakelock_plus Issue #117 - AGP 9 incompatibility](https://github.com/fluttercommunity/wakelock_plus/issues/117)
- [wakelock_plus PR #134 - NoActivityException fix](https://github.com/fluttercommunity/wakelock_plus/pull/134)
- [wakelock_plus Issue #110 - iOS Swift migration](https://github.com/fluttercommunity/wakelock_plus/issues/110)
- [wakelock_plus PR #136 - Built-in Kotlin](https://github.com/fluttercommunity/wakelock_plus/pull/136)
- [share_plus pub.dev](https://pub.dev/packages/share_plus) - v13.3.0
- [share_plus GitHub](https://github.com/fluttercommunity/plus_plugins)
- [share_plus Issue #3730 - iPad](https://github.com/fluttercommunity/plus_plugins/issues/3730)
- [share_plus Issue #3770 - Main thread I/O](https://github.com/fluttercommunity/plus_plugins/issues/3770)
- [share_plus Issue #3602 - R8 Full Mode](https://github.com/fluttercommunity/plus_plugins/issues/3602)
- [share_plus PR #3914 - Android Save Action](https://github.com/fluttercommunity/plus_plugins/pull/3914)
- [share_plus PR #3931 - I/O fix](https://github.com/fluttercommunity/plus_plugins/commit/2c5b4935c85fdbfeffea2bd68c9286c064ed8b7c)
- [iOS 26 Crash Fix](https://www.nathanfox.net/p/flutter-share_plus-crash-on-ios-26)
