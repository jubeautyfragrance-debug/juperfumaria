#!/bin/bash
# Gera keystore de release para Android
# Execute: bash scripts/generate-keystore.sh

set -e

KEYSTORE_DIR="android/app"
KEYSTORE_FILE="$KEYSTORE_DIR/papel-release.jks"

echo "🔐 Gerando keystore de release..."

keytool -genkeypair \
  -v \
  -keystore "$KEYSTORE_FILE" \
  -alias papel \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass papel2026 \
  -keypass papel2026 \
  -dname "CN=Papel, OU=Dev, O=Papel, L=SP, ST=SP, C=BR"

echo ""
echo "✅ Keystore criado: $KEYSTORE_FILE"
echo ""
echo "⚠️  AGORA crie android/key.properties com:"
echo ""
cat <<EOF
storePassword=papel2026
keyPassword=papel2026
keyAlias=papel
storeFile=papel-release.jks
EOF

echo ""
echo "⚠️  ADICIONE android/key.properties ao .gitignore!"
echo "⚠️  NUNCA commite o keystore ou key.properties no git!"
