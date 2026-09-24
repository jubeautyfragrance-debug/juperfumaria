# Requisitos de Revisão — App Store e Google Play

> Última atualização: Agosto 2026
> Foco: leitores de PDF (apps offline que acessam arquivos locais)

---

## Apple App Store Review Guidelines

### Relevantes para Leitores de PDF

#### 2.1 — Performance: Apps Devem Estar Completos
- Build deve ser **final e funcional** — sem placeholders, texto "lorem ipsum", ou URLs inacessíveis
- App não pode ter crashes ou bugs críticos
- Todos os links e funcionalidades devem estar operacionais

#### 2.3.1 — Funcionalidade Relevante
- Screenshots e previews devem mostrar **funcionalidade real** do app
- Não usar screenshots genéricos ou de outros apps

#### 3.1.1 — In-App Purchase
- Se o app é gratuito com funcionalidades premium, use o sistema de In-App Purchase da Apple
- **Apps offline-only:** se não há compras, esta regra não se aplica diretamente
- Se houver compras futuras (ex: desbloquear filtros), integrar StoreKit

#### 4.2 — Mínimo de Funcionalidade
- App precisa ter **valor mínimo para o usuário** — não pode ser um site wrapper
- Leitores de PDF geralmente passam desde que tenham features únicas (filtros de tela, organização, etc.)

#### 4.3 — Spam / Resubmissão
- Apple rejeita apps duplicados de outros já existentes
- **Diferenciais para Papel:** filtros de tela para proteção visual, experiência offline total

#### 5.1.1 — Coleta de Dados
- Apps que coletam dados devem declarar no App Privacy Declaration
- **Papel (offline-only):** se não coleta dados, declarar "Dados Não Coletados"

#### 5.1.2 — Uso de Dados
- Dados não podem ser usados para fins diferentes do declarado
- App offline: dados ficam apenas no dispositivo

#### 5.6.3 — Permissões
- **File Access (NSFileAccess):** obrigatório para apps que acessam arquivos do usuário
- Explicar no App Review Notes por que o app precisa de acesso aos arquivos
- Usar `UIDocumentPickerViewController` para acesso seletivo (melhor prática)

### Motivos Comuns de Rejeição para Leitores de PDF

| Motivo | Descrição | Solução |
|--------|-----------|---------|
| **Permissão de arquivos não explicada** | App pede acesso total ao sistema de arquivos | Usar file picker; explicar no Review Notes |
| **App incompleto** | Placeholders, funcionalidades não implementadas | Remover tudo que não funcional |
| **Metadata inconsistente** | Screenshots não batem com o app | Garantir que mostrem UI real |
| **Privacy Manifest ausente** | Obrigatório desde 2024 | Incluir PrivacyInfo.xcprivacy |
| **Links externos quebrados** | URLs de suporte ou marketing inacessíveis | Verificar todos os links |
| **Design genérico** | App parece template sem customização | Investir em UI diferenciada |
| **Ausência de razão para permissões** | Não explicar por que precisa de acesso a arquivos | Incluir em App Review Notes |

**Fonte:** [Lexogrine — Apple App Store Review 2026](https://lexogrine.com/blog/apple-app-store-review-requirements-2026)

### Notas para App Review (Recomendado)

Incluir no campo "App Review Information":

```
This is an offline-only PDF reader. The app does NOT:
- Collect any user data
- Make network connections
- Use analytics or tracking
- Access files outside the user's explicit selection

The app uses UIDocumentPickerViewController for file access,
only reading files the user explicitly chooses to open.

All reading filters (screen color overlays) are processed
entirely on-device with no network dependency.

Privacy Manifest declares no data collection and no tracking.
```

---

## Google Play Policies

### Políticas Relevantes para Leitores de PDF

#### Permissões de Acesso a Arquivos

**MANAGE_EXTERNAL_STORAGE (Android 11+)**
- Obrigatório para ler PDFs de qualquer pasta do dispositivo
- Google exige **justificativa detalhada** no Play Console
- Apps que usam esta permissão passam por **revisão manual adicional**

**Declaração no Play Console:**
- Preencher o formulário de declaração de uso de `MANAGE_EXTERNAL_STORAGE`
- Explicar: "O app precisa acessar PDFs de todas as pastas do dispositivo para que o usuário possa abrir qualquer arquivo PDF diretamente"
- Alternativa: usar SAF (Storage Access Framework) — mais restritivo mas sem declaração

**Fonte:** [Google Play — User Data Policy](https://support.google.com/googleplay/android-developer/answer/10144311)

#### Política de Dados do Usuário (Data Safety)
- Obrigatório preencher a seção **Data Safety** no Play Console
- Para apps offline: declarar que **nenhum dado é coletado ou compartilhado**
- Google verifica consistência entre o formulário e o comportamento real do app

#### Política de Conteúdo
- Classificação de conteúdo obrigatória (content rating)
- Leitores de PDF geralmente recebem **"Rated for 3+"** (sem conteúdo restrito)
- Não pode conter conteúdo adulto, ilegal ou prejudicial

#### Política de Permissões Sensíveis (2026)

**Atualização Julho 2026:**
- Google reforçou políticas sobre permissões de SMS e Call Log
- Apps que não precisam dessas permissões não devem declará-las
- Para leitores de PDF: geralmente não são necessárias

**Atualização Abril 2026:**
- Google exige conformidade com políticas de "Age-Restricted Content"
- Apps com conteúdo para adultos devem ser classificados adequadamente
- Leitores de PDF sem conteúdo restrito: sem impacto

**Fonte:** [Google Play — Policy Announcement April 2026](https://support.google.com/googleplay/android-developer/answer/16926792)

#### Requisitos de API Target (Agosto 2026)
- Todos os apps devem atingir o **target API level** mais recente até **31 de agosto de 2026**
- Para Android 15: `targetSdkVersion = 35`
- Flutter deve suportar naturalmente

**Fonte:** [Google Play — Policy Announcement July 2026](https://support.google.com/googleplay/android-developer/answer/17134731)

### Motivos Comuns de Rejeição no Google Play

| Motivo | Descrição | Solução |
|--------|-----------|---------|
| **MANAGE_EXTERNAL_STORAGE sem justificativa** | Falta declaração de uso | Preencher formulário detalhado |
| **Dados Safety inconsistente** | Formulário não bate com comportamento real | Testar e verificar todas as respostas |
| **Conteúdo enganoso** | Screenshots ou descrição não correspondem | Usar UI real nos assets |
| **Permissões desnecessárias** | Declarar permissões que o app não usa | Remover permissões não utilizadas |
| **Classificação incorreta** | Content rating inadequado | Responder questionário com honestidade |
| **Falta de teste fechado** | Conta pessoal sem 12 testers por 14 dias | Realizar closed testing obrigatório |
| **Target API desatualizado** | Não atingir API level mínimo | Atualizar para Android 15 (API 35) |

### Formulário Data Safety (Google Play)

Para um app **100% offline**, declarar:

| Campo | Resposta |
|-------|----------|
| Dados coletados | Nenhum |
| Dados compartilhados com terceiros | Nenhum |
| Práticas de segurança | Os dados ficam no dispositivo |
| Processo de verificação | N/A |
| Criptografia em trânsito | N/A (sem rede) |
| Possibilidade de exclusão | N/A (sem dados coletados) |

---

## Comparação: Apple vs Google para Leitores de PDF

| Aspecto | Apple App Store | Google Play |
|---------|----------------|-------------|
| **Acesso a arquivos** | UIDocumentPickerViewController (recomendado) | MANAGE_EXTERNAL_STORAGE ou SAF |
| **Permissão** | NSFileAccess (declaração) | Storage permission (justificativa manual) |
| **Tempo de revisão** | 24–48h (primeira), 24h (updates) | 24–48h (geral), até 7 dias (permissões sensíveis) |
| **Privacy Manifest** | Obrigatório (desde 2024) | Data Safety form |
| **Revisão manual adicional** | Raro para PDF readers | Sim, se usar MANAGE_EXTERNAL_STORAGE |

---

## Dicas para Aprovação

### Para Apple
1. **Use UIDocumentPickerViewController** em vez de pedir acesso total
2. **Inclua vídeo demo** nas notas de revisão mostrando fluxo de abertura de PDF
3. **Documente** no Privacy Manifest que não há coleta de dados
4. **Teste em device real** — simuladores podem não revelar problemas de permissão

### Para Google Play
1. **Preencha a declaração de MANAGE_EXTERNAL_STORAGE** com detalhes antes de submeter
2. **Data Safety:** seja preciso — Google verifica automaticamente
3. **Closed testing:** se conta pessoal, garanta 12 testers × 14 dias antes de submeter
4. **Screenshots:** mostre o app abrindo PDFs reais, não telas genéricas
5. **Classificação de conteúdo:** responda honestamente o IARC questionnaire
