# Privacidade — Papel App (100% Offline)

> Última atualização: Agosto 2026
> Premissa: Papel é um app OFFLINE-ONLY. Sem coleta de dados, sem analytics, sem rede.

---

## Resumo da Postura de Privacidade

| Aspecto | Status |
|---------|--------|
| Coleta de dados | ❌ Nenhuma |
| Análise / Analytics | ❌ Nenhuma |
| Conexão de rede | ❌ Nenhuma |
| Tracking / Publicidade | ❌ Nenhuma |
| Dados ficam em | 📱 Dispositivo local apenas |
| Compartilhamento | ❌ Nenhum |

---

## 1. iOS Privacy Manifest (Apple)

### Obrigatório desde Maio 2024
Todo app submetido à App Store deve incluir um arquivo `PrivacyInfo.xcprivacy` no bundle.

**Fonte:** [Apple Developer — Privacy Manifest Files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)

### Estrutura do Arquivo

O manifest tem 4 chaves principais:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- 1. Rastreamento -->
  <key>NSPrivacyTracking</key>
  <false/>

  <!-- 2. Domínios de rastreamento -->
  <key>NSPrivacyTrackingDomains</key>
  <array/>

  <!-- 3. Dados coletados -->
  <key>NSPrivacyCollectedDataTypes</key>
  <array/>

  <!-- 4. APIs que requerem razão -->
  <key>NSPrivacyAccessedAPITypes</key>
  <array/>
</dict>
</plist>
```

### Configuração para Papel (Offline-Only)

#### NSPrivacyTracking
```xml
<key>NSPrivacyTracking</key>
<false/>
```
**Não rastreamos nada. App sem analytics, sem publicidade, sem tracking.**

#### NSPrivacyTrackingDomains
```xml
<key>NSPrivacyTrackingDomains</key>
<array/>
```
**Sem domínios. App não faz conexões de rede.**

#### NSPrivacyCollectedDataTypes
```xml
<key>NSPrivacyCollectedDataTypes</key>
<array/>
```
**Nenhum dado é coletado.** O app lê PDFs mas não coleta informações sobre o usuário ou seu comportamento.

#### NSPrivacyAccessedAPITypes
Para um leitor PDF offline, pode ser necessário declarar APIs de "Required Reason":

| API Category | Necessário? | Razão |
|-------------|-------------|-------|
| `NSPrivacyAccessedAPICategoryFileTimestamp` | Provavelmente sim | Para mostrar data de modificação de arquivos PDF |
| `NSPrivacyAccessedAPICategoryDiskSpace` | Talvez | Para mostrar espaço disponível |
| `NSPrivacyAccessedAPICategorySystemBootTime` | Não | Não utilizado |
| `NSPrivacyAccessedAPICategoryUserDefaults` | Talvez | Para preferências do usuário (tema, etc.) |
| `NSPrivacyAccessedAPICategoryActiveKeyboards` | Não | Não utilizado |

**Se usar APIs de File Timestamp** (ex: `modificationDate` de um arquivo):
```xml
<dict>
  <key>NSPrivacyAccessedAPIType</key>
  <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
  <key>NSPrivacyAccessedAPITypeReasons</key>
  <array>
    <string>DDA9.1</string>  <!-- Acessar timestamp para mostrar ao usuário -->
  </array>
</dict>
```

**Se usar UserDefaults** (ex: salvar tema preferido):
```xml
<dict>
  <key>NSPrivacyAccessedAPIType</key>
  <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
  <key>NSPrivacyAccessedAPITyeReasons</key>
  <array>
    <string>CA92.1</string>  <!-- Acessar UserDefaults do app -->
  </array>
</dict>
```

### Como Verificar o Privacy Manifest
1. No Xcode: **Product → Privacy Report** gera um relatório
2. Verificar se todas as APIs flagged estão documentadas
3. Submeter com o build — o App Store rejeita sem manifest válido

**Flutter:** O Flutter engine já inclui seu próprio Privacy Manifest. Verifique se a versão do Flutter que você usa já suporta (Flutter 3.22+).

**Fonte:** [Flutter GitHub — Privacy Manifest Issue #143232](https://github.com/flutter/flutter/issues/143232)

### Códigos de Rejeição Relacionados
- **ITMS-91053:** Privacy Manifest inválido ou ausente
- **ITMS-90725:** SDK version issue (usar Xcode 15+)
- Erros de parsing do XML

---

## 2. Google Data Safety Form (Android)

### O que é
Formulário obrigatório no Play Console que descreve as práticas de privacidade do app. Google exige que bata com o comportamento real do app.

**Fonte:** [Google Play — Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469)

### Configuração para Papel (Offline-Only)

#### Seção 1: Dados coletados
| Pergunta | Resposta |
|----------|----------|
| Quais dados o app coleta? | **Nenhum** |
| Os dados são coletados periodicamente? | **Não** |

#### Seção 2: Compartilhamento
| Pergunta | Resposta |
|----------|----------|
| Os dados são compartilhados com terceiros? | **Não** |

#### Seção 3: Práticas de segurança
| Pergunta | Resposta |
|----------|----------|
| Criptografia em trânsito? | **N/A** (sem rede) |
| É possível solicitar exclusão de dados? | **N/A** (nenhum dado coletado) |

#### Seção 4: Avaliação aprovada por autoridade reguladora
| Pergunta | Resposta |
|----------|----------|
| Revisão de segurança obrigatória? | **Não** (sem dados coletados) |

### Importante
- Google pode **verificar automaticamente** se o app faz conexões de rede
- Se o formulário diz "sem dados coletados" mas o app se conecta à internet, pode haver problema
- Papel (offline-only) está seguro: formulário bate com comportamento real

---

## 3. Política de Privacidade (Mínimo Obrigatório)

### Por que é necessária
- **Apple:** Requer URL de política de privacidade em App Store Connect
- **Google Play:** Requer URL de política de privacidade no Play Console
- Mesmo apps que não coletam dados precisam declarar isso formalmente

### Política de Privacidade para Papel

---

### Política de Privacidade — Papel

**Última atualização:** [DATA]

#### Sobre o Papel
Papel é um aplicativo de leitura de PDF desenvolvido para iOS e Android. O app funciona **integralmente offline** — nenhuma dados é transmitido, coletado, ou enviado para servidores externos.

#### Dados Coletados
**O Papel não coleta, armazena, ou transmite nenhum dado pessoal ou não-pessoal.**

- Não utilizamos analytics ou ferramentas de rastreamento
- Não há conexões de rede em nenhum momento
- Não há cadastro ou login de usuário
- Não há envio de logs ou crashes para servidores externos

#### Acesso a Arquivos
O Papel solicita acesso aos arquivos do dispositivo **apenas quando o usuário escolhe explicitamente** abrir um PDF. O app utiliza o seletor de arquivos nativo do sistema operacional (UIDocumentPickerViewController no iOS, Storage Access Framework no Android).

O app não acessa, lê, ou monitora arquivos sem a ação direta do usuário.

#### Armazenamento Local
Todos os dados processados pelo Papel ficam exclusivamente no dispositivo do usuário. Nenhuma informação é enviada para servidores, nuvem, ou serviços terceiros.

#### Alterações nesta Política
Se esta política for atualizada, a data de "Última atualização" será alterada. Versões anteriores não serão mantidas, pois o app não armazena dados históricos.

#### Contato
[SEU E-MAIL DE SUPORTE]

---

### Como hospedar a política
- Opção 1: GitHub Pages (gratuito) — ex: `https://seudomains.github.io/papel/privacidade`
- Opção 2: Página simples no site do app
- O URL precisa ser acessível e permanente

---

## 4. Resumo de Obrigações por Loja

| Requisito | Apple | Google Play |
|-----------|-------|-------------|
| Privacy Manifest (xcprivacy) | ✅ Obrigatório | ❌ Não existe |
| Data Safety Form | ❌ Não existe | ✅ Obrigatório |
| Privacy Policy URL | ✅ Obrigatório | ✅ Obrigatório |
| Declaração de dados | ✅ App Privacy Declaration | ✅ Data Safety Section |
|_cookies_ (web) | ❌ N/A | ❌ N/A |

---

## 5. Checklist de Privacidade

### iOS (App Store)
- [ ] Criar arquivo `PrivacyInfo.xcprivacy`
- [ ] Definir `NSPrivacyTracking` como `false`
- [ ] Declarar `NSPrivacyTrackingDomains` vazio
- [ ] Declarar `NSPrivacyCollectedDataTypes` vazio
- [ ] Verificar APIs de "Required Reason" (file timestamp, UserDefaults)
- [ ] Documentar razões para cada API utilizada
- [ ] Testar com Product → Privacy Report no Xcode
- [ ] Incluir URL da política de privacidade no App Store Connect
- [ ] Preencher App Privacy Declaration no App Store Connect

### Android (Google Play)
- [ ] Preencher Data Safety form no Play Console
- [ ] Declarar: "nenhum dado coletado"
- [ ] Declarar: "nenhum dado compartilhado"
- [ ] Justificar uso de permissões de armazenamento
- [ ] Incluir URL da política de privacidade no Play Console
- [ ] Responder IARC content rating questionnaire

### Ambos
- [ ] Criar página de política de privacidade hospedada
- [ ] Garantir que a política reflete o comportamento real do app
- [ ] Revisar antes de cada submissão

---

## 6. Notas para Desenvolvedores Flutter

- **Flutter Engine:** Inclui Privacy Manifest nativamente a partir de versões recentes
- **Plugins:** Verificar se todos os plugins Flutter usados também incluem Privacy Manifest
- **Plugins críticos:** `path_provider`, `file_picker`, `permission_handler` — todos devem estar em conformidade
- **Verificar:** Rodar `flutter pub deps` e checar quais plugins usam APIs de required reason

**Flutter + Privacy Manifest:** [GitHub Issue #143232](https://github.com/flutter/flutter/issues/143232)
