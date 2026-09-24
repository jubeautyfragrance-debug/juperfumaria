# Checklist de Lançamento — Papel App

> Última atualização: Agosto 2026

---

## 1. Ícone do App

### Especificações

| Loja | Tamanho | Formato | Observações |
|------|---------|---------|-------------|
| **App Store** | 1024 × 1024 px | PNG | Sem alpha (transparência), sem cantos arredondados (iOS arredonda automaticamente) |
| **Google Play** | 512 × 512 px | PNG 32-bit | Com alpha permitido (ícone adaptativo) |

### Regras
- **App Store:** Nunca adicione cantos arredondados — o iOS aplica automaticamente
- **App Store:** Remova toda transparência (alpha channel)
- **Google Play:** Use adaptive icon (foreground + background layers) para Android 8+
- **Ambos:** Usar cores contrastantes, legíveis em tamanho pequeno
- **Ambos:** Sem texto obrigatório no ícone

### Tamanhos Gerados Automaticamente
O Flutter e as lojas geram tamanhos menores a partir do 1024px:
- iPhone Home Screen @3x: 180 × 180
- iPhone Home Screen @2x: 120 × 120
- iPad Home Screen @2x: 152 × 152
- iPad Pro Home Screen @2x: 167 × 167

---

## 2. Screenshots

### App Store (iOS)

| Device Class | Resolução (Portrait) | Obrigatório? | Notas |
|-------------|---------------------|--------------|-------|
| **iPhone 6.9"** | 1320 × 2868 | ✅ Sim (primário) | iPhone 17 Pro Max, 16 Pro Max, etc. |
| iPhone 6.7" | 1290 × 2796 | Opcional | Fallback se 6.9" não fornecido |
| iPhone 6.5" | 1242 × 2688 ou 1284 × 2778 | Opcional | Legacy support |
| iPhone 5.5" | 1242 × 2208 | Opcional | Legacy |
| **iPad 13"** | 2064 × 2752 ou 2048 × 2732 | ✅ Sim (se suportar iPad) | iPad Pro M4 |

**Regras App Store:**
- 1 a 10 screenshots por device class
- Formato: PNG ou JPEG, sem transparência
- Espaço de cores: sRGB
- Máximo: 8 MB cada
- Apple faz auto-scaling se um size não for fornecido

**Fonte:** [Apple Developer — Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)

**Fonte:** [AppScreenshotStudio — Sizes 2026](https://appscreenshotstudio.com/app-store-screenshot-sizes-2026)

### Google Play

| Device Type | Tamanho Recomendado | Mínimo/Máximo | Notas |
|-------------|-------------------|---------------|-------|
| **Phone** | 1080 × 1920 | 320–3840 px | Aspect ratio: 9:16 a 9:21 |
| **Tablet 7"** | 1080 × 1920 | 320–3840 px | Opcional, mas recomendado |
| **Tablet 10"** | 1080 × 1920 | 320–3840 px | Opcional, mas recomendado |

**Regras Google Play:**
- Mínimo **2 screenshots** (obrigatório)
- Máximo **8 screenshots** por device type
- Formato: JPEG ou 24-bit PNG
- Sem transparência (alpha)
- Lado máximo não pode exceder 2× o lado mínimo

**Fonte:** [Google Play Console — Store Listing Assets](https://support.google.com/googleplay/android-developer/answer/9866151)

**Fonte:** [PicsSizer — Google Play Sizes 2026](https://www.picssizer.com/app-store-sizes/google-play)

### Feature Graphic (Google Play Obrigatório)

| Propriedade | Valor |
|-------------|-------|
| **Tamanho** | 1024 × 500 px |
| Formato | PNG ou JPEG |
| Transparência | ❌ Não permitida |
| Safe zone | 924 × 400 px centralizado |

**Fonte:** [Storeshot — Feature Graphic Specs](https://www.getstoreshot.com/guides/play-store-feature-graphic)

### Dicas de Screenshots
1. **Primeira screenshot é a mais importante** — aparece nos resultados de busca
2. Mostrar funcionalidades reais: abrindo PDF, filtros de tela, organização
3. Evitar frames de dispositivo genéricos — usar screenshots limpos
4. Texto overlay explicando cada funcionalidade ajuda na conversão
5. Screenshots em **portrait** são exibidas maiores nos resultados de busca

---

## 3. Metadados da Loja

### App Store Connect

| Campo | Tamanho Máximo | Obrigatório | Observações |
|-------|---------------|-------------|-------------|
| **Nome do App** | 30 caracteres | ✅ | Ex: "Papel — Leitor de PDF" |
| **Subtítulo** | 30 caracteres | ✅ | Ex: "Filtros para seus olhos" |
| **Descrição** | 4000 caracteres | ✅ | Texto principal de vendas |
| **Palavras-chave** | 100 caracteres | ✅ | Separadas por vírgula, sem repetir nome |
| **URL de Suporte** | — | ✅ | Página de FAQ ou contato |
| **URL de Marketing** | — | Opcional | Site do app |
| **URL da Política de Privacidade** | — | ✅ | Obrigatório desde iOS 14 |
| **Notas de Revisão** | 4000 caracteres | ✅ | Instruções para o revisor da Apple |
| **Categoria Primária** | — | ✅ | Utilities ou Productivity |
| **Categoria Secundária** | — | Opcional | Books ou Reference |
| **Classificação Etária** | — | ✅ | Baseada em questionário |

### Google Play Console

| Campo | Tamanho Máximo | Obrigatório | Observações |
|-------|---------------|-------------|-------------|
| **Nome do App** | 30 caracteres | ✅ | Ex: "Papel — Leitor de PDF" |
| **Descrição Curta** | 80 caracteres | ✅ | Resumo rápido |
| **Descrição Completa** | 4000 caracteres | ✅ | Texto principal de vendas |
| **Email de Suporte** | — | ✅ | E-mail público |
| **Telefone de Suporte** | — | Opcional | — |
| **Website de Suporte** | — | Opcional | — |
| **URL da Política de Privacidade** | — | ✅ | Obrigatório |
| **Classificação de Conteúdo (IARC)** | — | ✅ | Questionário onboarding |
| **Tipo de Aplicativo** | — | ✅ | App ou Game |
| **Categoria** | — | ✅ | Tools ou Books & Reference |
| **Etiquetas** | — | Opcional | Máx 5 |

---

## 4. Bundle ID

### Convenção
- **iOS:** `com.seudominio.papel`
- **Android:** `com.seudominio.papel` (pode ser o mesmo)

### Regras
- **Apple:** Reverse DNS (ex: `com.company.papel`)
- **Google Play:** Reverse DNS (ex: `com.company.papel`)
- Não pode ser alterado depois da primeira submissão
- Evitar underscores, usar apenas letras, números e pontos

### Exemplo
```
com.papelapp.papel
ou
br.com.seudominio.papel
```

---

## 5. Assinatura e Build

### iOS (App Store)
- [ ] **Apple Distribution Certificate** (dentro da Developer Account)
- [ ] **Provisioning Profile** para Distribution
- [ ] **Xcode Archive** → Upload via Xcode ou Transporter
- [ ] Build format: `.ipa`
- [ ] Code signing automático (recomendado) ou manual

### Android (Google Play)
- [ ] **Keystore de assinatura** (gerado uma vez, guardado com segurança)
- [ ] Build format: `.aab` (Android App Bundle) — obrigatório no Play Store
- [ ] Google Play App Signing (recomendado — Google gerencia a assinatura)
- [ ] Version code incrementado a cada build
- [ ] Version name em formato semântico (ex: `1.0.0`)

### Flutter Commands Úteis
```bash
# iOS
flutter build ipa --release

# Android
flutter build appbundle --release

# Verificar versão
flutter --version
```

---

## 6. Checklist Completo de Lançamento

### Pré-submissão (2 semanas antes)
- [ ] Ícone 1024×1024 (iOS) e 512×512 (Android) finalizados
- [ ] Screenshots 6.9" iPhone (1320×2868) — mínimo 1, recomendado 3–5
- [ ] Screenshots iPad (2064×2752) — se suportar iPad
- [ ] Screenshots Phone Android (1080×1920) — mínimo 2, recomendado 4–6
- [ ] Feature Graphic Google Play (1024×500)
- [ ] Política de privacidade hospedada e acessível
- [ ] Privacy Manifest (iOS) criado e validado
- [ ] Data Safety form (Google) preenchido
- [ ] Textos da loja prontos (nome, subtítulo, descrição, keywords)
- [ ] Bundle ID definido e configurado
- [ ] Assinatura configurada (certificado iOS, keystore Android)

### Submissão
- [ ] Build final testado em device real
- [ ] App Store Connect: criar app, preencher metadados, upload do build
- [ ] Play Console: criar app, preencher listing, upload do AAB
- [ ] Classificação de conteúdo preenchida (ambas as lojas)
- [ ] Notas de revisão (App Review Notes) incluídas
- [ ] TestFlight (iOS) — testar com beta testers antes da submissão
- [ ] Closed Testing (Android) — 12 testers × 14 dias (se conta pessoal)

### Pós-submissão
- [ ] Monitorar status da revisão (24–48h Apple, 24–48h Google)
- [ ] Responder a quaisquer perguntas do revisor
- [ ] Se rejeitado: ler feedback, corrigir, resubmeter
- [ ] Preparar material de marketing para lançamento
- [ ] Planejar primeira atualização (correções de bugs反馈 dos usuários)

---

## 7. Números de Contato de Emergência

| Loja | Canal | Tempo de Resposta |
|------|-------|-------------------|
| Apple Developer Support | Via Apple Developer app ou site | 24–48h |
| Google Play Support | Via Play Console → Help | 24–72h |
| D-U-N-S Support | support.dnb.com | 5–7 dias úteis |
