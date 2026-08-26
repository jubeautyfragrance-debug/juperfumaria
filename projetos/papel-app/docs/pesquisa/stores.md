# Publicação: App Store + Google Play (2026)

> Pesquisado em: 24/08/2026 | Confiança: alta

## Resumo executivo
- Custos: **Apple $99/ano** + **Google $25 único** ≈ $124 no 1º ano
- Apple exige Mac com Xcode para build; revisão oficial 24-72h, mas na prática 2026 pode levar 7-30 dias (fila cresceu ~60% YoY)
- Google Play: contas pessoais NOVAS exigem **closed testing com 12 testadores por 14 dias** antes de produção (+7-14 dias de revisão) — planejar!
- ⚠️ BRASIL: Android Developer Verification começa **30/09/2026 no Brasil** (ID governamental vinculado à conta de desenvolvedor)
- Motivo nº1 de rejeição Apple: privacidade (Guideline 5.1.1) — política de privacidade + labels corretos desde o dia 1

## Contas

| Item | Apple | Google |
|---|---|---|
| Custo | $99/ano (não renovou = app sai do ar) | $25 único, vitalício |
| Pessoa física | OK (individual) | OK, mas sujeito ao teste de 12 testadores |
| Empresa | D-U-N-S + verificação 1-4 semanas | D-U-N-S/registro; sem teste obrigatório |
| Build | IPA via Xcode (**precisa Mac**) | AAB via Play Console (qualquer OS) |
| Revisão | Humana, rigorosa | Automatizada em grande parte |
| Comissão | 15% (<$1M/ano, Small Business Program) a 30% | 15-30% |

## Requisitos críticos 2026
- iOS: SDK iOS/iPadOS 26 obrigatório a partir de abril/2026; 64-bit; app completo (sem placeholder); suporte universal quando possível ([newly.app, 01/2026](https://newly.app/how-to/app-store-requirements))
- Privacidade Apple: Privacy Policy vinculada no App Store Connect E dentro do app; App Privacy Labels fiéis aos dados coletados; apps com login precisam permitir exclusão de conta
- O Papel lê arquivos LOCAIS do usuário → permissão de acesso a arquivos precisa de justificativa clara nas duas lojas (NSFileAccessUsage / Storage/Photo Picker no Android)
- Vantagem competitiva de leitores: sem IAP complexa = revisão mais simples

## Cronograma realista (conta pessoal nova)
```
Semana 0      criar contas + verificação identidade Google (BR: após 30/09 exige doc gov)
Semanas 1-2   desenvolvimento closed testing track / TestFlight interno
Semanas 2-4   Google: 12 testadores × 14 dias fechado (em paralelo)
              Apple: build via Xcode → review 24-72h (planejar margem até 30d)
Semana 5+     produção nas duas lojas
```

## Checklist mínimo de assets
- Ícone 1024×1024 (sem alpha no iOS)
- Screenshots iPhone 6.7"/6.9" + iPad 13"; Android phone + tablet 7"/10"
- Feature graphic Android 1024×500
- Política de privacidade (URL pública)
- Bundle ID / package name únicos, assinatura configurada

## Decisões pendentes do dono do projeto
1. Conta individual ou empresa? (impacta teste de 14 dias no Google e D-U-N-S na Apple)
2. Nome comercial final ("Papel" está livre como codinome — verificar marcas antes)
3. Monetização futura? (define formulários de preço/IAP agora)

## Fontes
- https://ilab.md/en/articles/publishing-on-the-app-store-and-google-play-in-2026-timelines-costs-and-7-hidden-requirements-that-could-derail-your-launch (08/2026)
- https://newly.app/how-to/app-store-requirements (01/2026)
- https://www.testerscommunity.com/blog/google-play-developer-account-guide (08/2026)
- https://developer.apple.com/app-store/review/guidelines/
