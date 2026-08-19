# 🌻 JU Perfumaria — Backup Completo do Projeto

**Data do backup:** 18/08/2026
**Local original:** C:\Users\[seu-usuario]\[pasta-do-projeto]\site-ju-perfumaria

---

## 📁 Estrutura Completa de Arquivos

### Arquivos Raiz do Projeto
```
site-ju-perfumaria/
├── index.html              ← Página principal (HTML)
├── styles.css              ← Estilos CSS
├── script.js               ← Lógica JavaScript
├── apply-data.py           ← Script para aplicar dados nos produtos
├── fetch-data.py           ← Script para buscar dados dos sites
├── fetch-images.py         ← Script para baixar imagens dos produtos
├── preview-precos.png      ← Imagem de preview dos preços
├── README.md               ← Este arquivo (documentação)
│
├── images/
│   └── products/           ← Imagens dos perfumes (40 arquivos JPG)
│       ├── 1-million.jpg
│       ├── acqua-di-gio.jpg
│       ├── coco-mademoiselle.jpg
│       ├── coffee-man.jpg
│       ├── egeo-bomb-black.jpg
│       ├── egeo-dolce.jpg
│       ├── egeo.jpg
│       ├── ekos-castanha.jpg
│       ├── ekos-maracuja.jpg
│       ├── eros.jpg
│       ├── essencial-oud.jpg
│       ├── essencial-sentir.jpg
│       ├── essencial-unico.jpg
│       ├── essencial.jpg
│       ├── floratta-gold.jpg
│       ├── floratta-my-blue.jpg
│       ├── floratta-red.jpg
│       ├── glamour.jpg
│       ├── good-girl.jpg
│       ├── jadore.jpg
│       ├── kaiak-aventura.jpg
│       ├── kaiak-radical.jpg
│       ├── kaiak-urbe.jpg
│       ├── la-vie-est-belle.jpg
│       ├── libre.jpg
│       ├── lily.jpg
│       ├── luna.jpg
│       ├── malbec-gold.jpg
│       ├── malbec-magnetic.jpg
│       ├── malbec.jpg
│       ├── natura-homem-essence.jpg
│       ├── natura-homem-sagaz.jpg
│       ├── quasar-classic.jpg
│       ├── quasar-rush.jpg
│       ├── sauvage.jpg
│       ├── scandal.jpg
│       ├── the-blend-cardamom.jpg
│       ├── the-blend.jpg
│       ├── una-tuberosa.jpg
│       └── zaad.jpg
│
└── .data/                  ← Dados brutos coletados dos sites
    ├── dados.json          ← JSON com todos os produtos
    │
    ├── (Páginas Boticário)
    ├── boti-page-coffee-man.html
    ├── boti-page-egeo-bomb-black.html
    ├── boti-page-egeo-dolce.html
    ├── boti-page-egeo.html
    ├── boti-page-floratta-gold.html
    ├── boti-page-floratta-my-blue.html
    ├── boti-page-floratta-red.html
    ├── boti-page-glamour.html
    ├── boti-page-lily.html
    ├── boti-page-malbec-gold.html
    ├── boti-page-malbec-magnetic.html
    ├── boti-page-malbec.html
    ├── boti-page-quasar-classic.html
    ├── boti-page-quasar-rush.html
    ├── boti-page-the-blend-cardamom.html
    ├── boti-page-the-blend.html
    ├── boti-page-zaad.html
    │
    ├── (Buscas Boticário)
    ├── boti-search-coffee-man.html
    ├── boti-search-egeo-bomb-black.html
    ├── boti-search-egeo-dolce.html
    ├── boti-search-egeo.html
    ├── boti-search-floratta-gold.html
    ├── boti-search-floratta-my-blue.html
    ├── boti-search-floratta-red.html
    ├── boti-search-glamour.html
    ├── boti-search-lily.html
    ├── boti-search-malbec-gold.html
    ├── boti-search-malbec-magnetic.html
    ├── boti-search-malbec.html
    ├── boti-search-quasar-classic.html
    ├── boti-search-quasar-rush.html
    ├── boti-search-the-blend-cardamom.html
    ├── boti-search-the-blend.html
    ├── boti-search-zaad.html
    │
    ├── (Páginas Natura)
    ├── nat-page-ekos-castanha.html
    ├── nat-page-ekos-maracuja.html
    ├── nat-page-essencial-oud.html
    ├── nat-page-essencial-sentir.html
    ├── nat-page-essencial-unico.html
    ├── nat-page-essencial.html
    ├── nat-page-kaiak-aventura.html
    ├── nat-page-kaiak-radical.html
    ├── nat-page-kaiak-urbe.html
    ├── nat-page-luna.html
    ├── nat-page-natura-homem-essence.html
    ├── nat-page-natura-homem-sagaz.html
    ├── nat-page-una-tuberosa.html
    │
    ├── (Categorias Natura)
    ├── nat-cat-ekos.html
    ├── nat-cat-essencial.html
    ├── nat-cat-kaiak.html
    ├── nat-cat-luna.html
    ├── nat-cat-natura.html
    ├── nat-cat-una.html
    │
    ├── nat-search-radical.html
    ├── natura-kaiak.html
    └── amazon-gg.html
```

---

## 🚀 Como Restaurar o Projeto

### Passo 1: Copiar para o PC
1. Crie uma pasta chamada `site-ju-perfumaria` no local desejado
2. Copie **TODOS** os arquivos e pastas do pen drive para essa pasta

### Passo 2: Verificar a Estrutura
Após copiar, a estrutura deve estar assim:
```
C:\Users\[seu-usuario]\[pasta]\site-ju-perfumaria\
├── index.html
├── styles.css
├── script.js
├── *.py
├── images/products/*.jpg
└── .data/*.html, *.json
```

### Passo 3: Abrir no Navegador
- Basta abrir o arquivo `index.html` no navegador (Chrome, Firefox, Edge)

### Passo 4: Re-executar Scripts (se necessário)
```bash
# Instalar dependências Python
pip install requests beautifulsoup4

# Buscar dados atualizados
python fetch-data.py

# Baixar imagens
python fetch-images.py

# Aplicar dados
python apply-data.py
```

---

## 📋 Informações Importantes

- **Site:** Ju Perfumaria Multimarcas
- **Tecnologias:** HTML5, CSS3, JavaScript vanilla
- **Scripts:** Python 3 (para coleta de dados)
- **Total de arquivos:** ~100+ arquivos
- **Tamanho aproximado:** ~50MB (com imagens)

---

## 🔧 Dependências dos Scripts Python

```
requests
beautifulsoup4
```

Instale com: `pip install requests beautifulsoup4`

---

**⚠️ IMPORTANTE:** Mantenha este pen drive em local seguro até confirmar que o projeto está funcionando no novo PC!

**🌻 Feito com carinho pela Ju Perfumaria**
