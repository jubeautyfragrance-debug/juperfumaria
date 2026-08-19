/* ============================================================
   Ju Perfumaria — JavaScript Premium
   Scroll reveal, micro-interactions, carrinho, filtros
   ============================================================ */

"use strict";

/* ---------- Dados dos produtos ---------- */

const PRODUCTS = [
  /* ---- O Boticário ---- */
  { id: "malbec", name: "Malbec", brand: "Boticário", origin: "Nacional", family: "Amadeirado", notes: "Notas: Cardamomo, Pimenta do Reino, Bergamota · Sálvia, Elemi, Cipreste · Patchouli, Couro, Cedro, Infusão de Baunilha", price: 27990, oldPrice: null, badge: "Mais vendido", top: "#d5c3a6", bottom: "#a98f63" },
  { id: "malbec-edp", name: "Malbec Eau de Parfum", brand: "Boticário", origin: "Nacional", family: "Amadeirado", notes: "Novo lançamento! Versão Eau de Parfum de Malbec, com notas intensificadas de couro, âmbar e madeiras ambaradas. Mais duradouro e marcante.", price: 27990, oldPrice: null, badge: "Lançamento", top: "#c4a87a", bottom: "#8b6d3f" },
  { id: "malbec-gold", name: "Malbec Gold", brand: "Boticário", origin: "Nacional", family: "Âmbar", notes: "Notas: Mandarina, Maçã Gold, Artemísia, Gengibre de Madagascar, Pimenta Preta e Limão Siciliano · Noz Moscada, Flor-de-Laranjeira, Canela de Madagascar, Acorde Malbec, Liquid Gold, Lavanda, Complexo Couro Moderno · Patchouli Coeur, Cashmeran, Cistus Labdanum Absoluto, Cedro Texas, Baunilha, Madeiras Ambaradas, Agarwood, Olibano", price: 23390, oldPrice: null, badge: null, top: "#ecd9a8", bottom: "#c99d52" },
  { id: "malbec-magnetic", name: "Malbec Magnetic", brand: "Boticário", origin: "Nacional", family: "Âmbar", notes: "Notas: Pimenta Rosa, Cardamomo da Índia, Cipreste da França, Maçã, Notas Cítricas, Uva Branca · Zimbro, Noz Moscada, Rosa, Notas verdes, Patchouli, Cedro, Cashmere, Sândalo, Guaiaco, Acorde Segredos da Alsácia · Cypriol, Musk, Baunilha, Âmbar, Olíbano", price: 25990, oldPrice: null, badge: null, top: "#e8d3b4", bottom: "#c0915a" },
  { id: "the-blend", name: "The Blend", brand: "Boticário", origin: "Nacional", family: "Amadeirado", notes: "Notas: Bergamota, Rhum SFE, Açafrão, Lavanda, Grapefruit · Iris, Tuberosa, Notas resinosas, Sândalo, Vetiver · Blend 4 Epice · Âmbar, Guaiacwood, Musgo, Oud Laos, Benjoin, Fava Tonka", price: 33990, oldPrice: null, badge: "Exclusivo", top: "#dccdb2", bottom: "#b39a6f" },
  { id: "the-blend-cardamom", name: "The Blend Cardamom", brand: "Boticário", origin: "Nacional", family: "Amadeirado", notes: "Notas: Bergamota, Pimenta Sichuan, Gengibre, Noz-moscada, Elemi, Cominho · Lavanda, Acorde de Licoroso de Whisky, Folha de Violeta, Madeira de Cashmeran · Sândalo, Madeira de Cedro, Patchouli, Vetiver, Musk, Âmbar, Notas lactônicas", price: 37990, oldPrice: null, badge: "Novo", top: "#d8c6a9", bottom: "#a8906a" },
  { id: "egeo", name: "Egeo", brand: "Boticário", origin: "Nacional", family: "Cítrico", notes: "Notas: Mirtilo Silvestre, Pimenta Rosa, Morango Tagada · Gergelim, Cedro, Cacau, Chocolate em pó, Chocolate Preto, Musgo, Cashmeran · Morango, Chocolate, Gergelim", price: 16490, oldPrice: null, badge: null, top: "#f7e6b5", bottom: "#e8cd7d" },
  { id: "egeo-dolce", name: "Egeo Dolce", brand: "Boticário", origin: "Nacional", family: "Floral", notes: "Notas: Acorde de Sorvete de Framboesa, Nectarina · Acorde de Algodão Doce, Anis, Violeta, Madressilva · Âmbar, Baunilha, Fava Tonka, Sândalo, Musk", price: 12490, oldPrice: 16490, badge: "Oferta", top: "#f1d0c8", bottom: "#d98ea5" },
  { id: "egeo-bomb-black", name: "Egeo Bomb Black", brand: "Boticário", origin: "Nacional", family: "Amadeirado", notes: "Notas: Artemísia, Hortelã, Limão, Verde Folha, Bergamota, Maçã · Muguet, Cedro, Couro, Imortelle, Musgo · Patchouli, Sândalo, Tiramisone, Baunilha, Musk, Caramelo, Âmbar, Sugar Booster", price: 16490, oldPrice: null, badge: null, top: "#d5c3a6", bottom: "#a98f63" },
  { id: "egeo-vanilla-ubessession", name: "Egeo Vanilla Ubessession", brand: "Boticário", origin: "Nacional", family: "Âmbar", notes: "Novo lançamento Ciclo 12! Fusão viciante de baunilha, âmbar e notas orientais. Sucessor do Egeo Vanilla Obsession.", price: 14990, oldPrice: null, badge: "Lançamento", top: "#e8d3b4", bottom: "#c0915a" },
  { id: "quasar-classic", name: "Quasar Classic", brand: "Boticário", origin: "Nacional", family: "Cítrico", notes: "Notas: Bergamota, Mandarina, Limão · Estragão, Lavanda, Sálvia, Gálbano · Musgo de Carvalho, Musk, Sândalo, Cedro, Patchouli", price: 14490, oldPrice: null, badge: null, top: "#f6e8bd", bottom: "#dfcf8b" },
  { id: "quasar-rush", name: "Quasar Rush", brand: "Boticário", origin: "Nacional", family: "Cítrico", notes: "Notas: Limão Siciliano, Mandarina, Manjericão, Cardamomo, Abacaxi, Noz Moscada, Hortelã, Alecrim · Folha de Violeta, Cashmeran, Âmbar, Cedro Azul, Musgo, Acorde Aquático, Coriandro, Lavandin · Fava Tonka, Âmbar, Musk, Musgo, Notas Balsâmicas", price: 18990, oldPrice: null, badge: null, top: "#f7e6b5", bottom: "#e0c87e" },
  { id: "floratta-my-blue", name: "Floratta My Blue", brand: "Boticário", origin: "Nacional", family: "Floral", notes: "Notas: Gerânio, Bergamota, Lima da Pérsia, Rosa Chá · Plumélia, Muguet e Gardênia · Sândalo, Cedro, Vetiver, Musk", price: 17490, oldPrice: null, badge: null, top: "#efe3d6", bottom: "#cfb39b" },
  { id: "floratta-red", name: "Floratta Red", brand: "Boticário", origin: "Nacional", family: "Floral", notes: "Notas: Bergamota, Pêra, Maçã, Frutas vermelhas · Flor de Laranjeira, Gardenia, Violeta · Âmbar, Musk, Sândalo, Cashmeran", price: 17490, oldPrice: null, badge: null, top: "#f3d5c9", bottom: "#e2a58f" },
  { id: "floratta-gold", name: "Floratta Gold", brand: "Boticário", origin: "Nacional", family: "Floral", notes: "Notas: Neroli, Abacaxi, Pêssego e Orquídea · Muguet, Heliotropina e Jasmim · Sândalo, Âmbar, Baunilha e Musk", price: 13490, oldPrice: null, badge: null, top: "#f0e0b8", bottom: "#d6ad68" },
  { id: "lily", name: "Lily", brand: "Boticário", origin: "Nacional", family: "Floral", notes: "Notas: Mandarina, Pimenta Rosa, Bergamota · Frésia, Tuberosa Guatemala, Jasmim Air · Musgo Cristal, Cedro, Baunilha, Madeira Ambarada, White Musk", price: 22990, oldPrice: null, badge: null, top: "#f3d5c9", bottom: "#d98ea5" },
  { id: "glamour", name: "Glamour", brand: "Boticário", origin: "Nacional", family: "Floral", notes: "Notas: Bergamota, Canela, Pimenta Preta · Lírio do Valle, Jasmim Sambac, Peônia, Flor de Laranjeira, Acorde Pink Leopard · Patchouli, Sândalo, Baunilha, Cedro", price: 11990, oldPrice: null, badge: null, top: "#eed9b0", bottom: "#cf9f5e" },
  { id: "glamour-intense", name: "Glamour Intense", brand: "Boticário", origin: "Nacional", family: "Floral", notes: "Versão intensificada do Glamour com notas mais profundas de jasmim, baunilha e âmbar. Lançamento comemorativo dos 25 anos da linha.", price: 16490, oldPrice: null, badge: "Lançamento", top: "#e8c88a", bottom: "#b8923e" },
  { id: "zaad", name: "Zaad", brand: "Boticário", origin: "Nacional", family: "Âmbar", notes: "Notas: Bergamota da Itália, Coriandro da Rússia, Sementes de Zimbro, Notas Verdes · Cedro dos Estados Unidos, Cravo, Noz-moscada da Indonésia, Headspace Golden Chain Orchid das Filipinas, Patchouli da Indonésia · Âmbar, Musgo de Carvalho da Sérvia, Musk, Sândalo", price: 34990, oldPrice: null, badge: null, top: "#e8d3b4", bottom: "#c0915a" },
  { id: "coffee-man", name: "Coffee Man", brand: "Boticário", origin: "Nacional", family: "Âmbar", notes: "Notas: Bergamota, Mandarina, Lavanda, Cipreste, Pimenta Rosa · Apricot, Iris negra, Magnolia, Ruibarbo, Cedro, Acorde Café au Cream · Sândalo, Patchouli, Cashmere, Musk, Musgo, Âmbar, Baunilha, Fava Tonka, Benjoim", price: 17990, oldPrice: 19990, badge: "Oferta", top: "#e0cba2", bottom: "#b98f5a" },

  /* ---- Natura ---- */
  { id: "essencial", name: "Essencial", brand: "Natura", origin: "Nacional", family: "Floral", notes: "Notas: bergamota, lavanda, gálbano, zimbro, noz moscada, grapefrut, manjericão · gerânio, patchuli, alecrim, sálvia, jasmim · cedro, musc, musgo de carvalho, sândalo, âmbar", price: 27990, oldPrice: null, badge: "Mais vendido", top: "#f3d5c9", bottom: "#e2a58f" },
  { id: "essencial-sentir", name: "Essencial Sentir", brand: "Natura", origin: "Nacional", family: "Floral", notes: "Notas: Bergamota, Mandarina, Pimenta-preta, Cardamomo · Lavanda, Patchouli, Piper Brasileiro · Sândalo, Âmbar", price: 27990, oldPrice: null, badge: null, top: "#f1d0c8", bottom: "#d98ea5" },
  { id: "essencial-oud", name: "Essencial Oud", brand: "Natura", origin: "Nacional", family: "Amadeirado", notes: "Notas: pimenta-preta, limão, açafrão, bergamota, priprioca, ishpink, piper · rosa, framboesa, mirtilo, maçã, sálvia-esclaréia, gerânio e coentro · oud, patchouli, almíscar, couro, breu-branco, sândalo, âmbar", price: 28990, oldPrice: null, badge: null, top: "#d5c3a6", bottom: "#a98f63" },
  { id: "essencial-mirra", name: "Essencial Mirra", brand: "Natura", origin: "Nacional", family: "Amadeirado", notes: "Novo lançamento! Notas de mirra, âmbar e madeiras orientais. Versão intensa e misteriosa da linha Essencial.", price: 28990, oldPrice: null, badge: "Lançamento", top: "#b8a07a", bottom: "#8a6d4f" },
  { id: "essencial-mirra-fem", name: "Essencial Mirra Feminino", brand: "Natura", origin: "Nacional", family: "Amadeirado", notes: "Versão feminina do Essencial Mirra. Notas de mirra, âmbar e madeiras orientais com toque suave e envolvente.", price: 28990, oldPrice: null, badge: "Novo", top: "#c8a88a", bottom: "#9a7a5a" },
  { id: "essencial-unico", name: "Essencial Único", brand: "Natura", origin: "Nacional", family: "Âmbar", notes: "Notas: pimenta rosa, ishipink, noz moscada, açafrão, pomelo · freesia, cedro, vetiver, copaiba · mirra, opoponax, benzoin, cumaru, vanilla, musk, amber, labdanum", price: 32290, oldPrice: null, badge: null, top: "#ecd9a8", bottom: "#c99d52" },
  { id: "essencial-old-vanilla", name: "Essencial Old Vanilla", brand: "Natura", origin: "Nacional", family: "Âmbar", notes: "Fusão clássica de baunilha com âmbar e madeiras nobres. Sofisticação atemporal em cada gota.", price: 27990, oldPrice: null, badge: "Novo", top: "#d4b896", bottom: "#a88a5a" },
  { id: "kaiak-aventura", name: "Kaiak Aventura", brand: "Natura", origin: "Nacional", family: "Cítrico", notes: "Notas: mandarina, bergamota, artemisia · diidromircenol, muguet, pimenta preta · sândalo, musk, âmbar", price: 18990, oldPrice: null, badge: "Mais vendido", top: "#f6e8bd", bottom: "#dfcf8b" },
  { id: "kaiak-urbe", name: "Kaiak Urbe", brand: "Natura", origin: "Nacional", family: "Amadeirado", notes: "Notas: menta, diidromircenol, notas verdes · gerânio, manjericão, lavanda · âmbar, sândalo, copaíba", price: 18990, oldPrice: null, badge: null, top: "#dccdb2", bottom: "#b39a6f" },
  { id: "kaiak-radical", name: "Kaiak Radical", brand: "Natura", origin: "Nacional", family: "Amadeirado", notes: "Notas: Bergamota, Artemísia, Cassis · Pimenta Preta, Lírio do Vale · Almíscar, Âmbar, Sândalo", price: 18990, oldPrice: null, badge: null, top: "#d8c6a9", bottom: "#a8906a" },
  { id: "natura-homem-essence", name: "Natura Homem Essence", brand: "Natura", origin: "Nacional", family: "Amadeirado", notes: "Notas: bergamota, gengibre, grapefruit e limão · pimenta preta, violeta, cardamomo, canela e coriandro · patchouli, âmbar, iso e super, guaiacwood, cashmeran e cedro", price: 16990, oldPrice: null, badge: null, top: "#d5c3a6", bottom: "#a98f63" },
  { id: "natura-homem-sagaz", name: "Natura Homem Sagaz", brand: "Natura", origin: "Nacional", family: "Cítrico", notes: "Notas: mandarina verde, erva cidreira, cypress e sálvia · pimenta preta, noz moscada, ameixa preta · cedro, acorde amber, sândalo, baunilha e fava tonka", price: 24490, oldPrice: null, badge: null, top: "#f7e6b5", bottom: "#e8cd7d" },
  { id: "una-tuberosa", name: "Una Tuberosa", brand: "Natura", origin: "Nacional", family: "Floral", notes: "Fragrância: Una Senses combina a potência da tuberosa com tons quentes da terracota. Cashmeran, benjoin e extrato de vanila. Toque final do cumaru, ingrediente da biodiversidade brasileira", price: 32990, oldPrice: null, badge: null, top: "#f0e0b8", bottom: "#d6ad68" },
  { id: "ekos-maracuja", name: "Ekos Maracujá", brand: "Natura", origin: "Nacional", family: "Cítrico", notes: "Notas: anis, maçã, bergamota, alecrim, mandarina e maracujá · muguet, rosa, jasmim e violeta · cedro, musk, musgo de carvalho e sândalo", price: 12990, oldPrice: null, badge: null, top: "#f7e6b5", bottom: "#e0c87e" },
  { id: "ekos-castanha", name: "Ekos Castanha", brand: "Natura", origin: "Nacional", family: "Âmbar", notes: "Notas: bergamota, laranja, limão, lavanda, mandarina, verdes naturais · jasmim, ylang ylang, muguet · musk, cedro, sândalo, musgo de carvalho, amêndoa", price: 12990, oldPrice: null, badge: null, top: "#e8d3b4", bottom: "#c0915a" },
  { id: "ekos-baunilha", name: "Ekos Baunilha Amazônica", brand: "Natura", origin: "Nacional", family: "Âmbar", notes: "Novo lançamento Ciclo 12! Fragrância inesquecível marcada pela doçura e profundidade da baunilha amazônica.", price: 13990, oldPrice: null, badge: "Lançamento", top: "#d4b896", bottom: "#a88a5a" },
  { id: "luna", name: "Luna", brand: "Natura", origin: "Nacional", family: "Floral", notes: "Notas: frutas vermelhas, maçã, pêssego, ameixa, pimenta-rosa, óleo de mandarina-italiana · jasmim-sambac, jasmim do Egito, óleo de néroli da Tunísia, rosa · patchouli heart, musk, cedro, âmbar, baunilha", price: 18590, oldPrice: null, badge: null, top: "#efe3d6", bottom: "#cfb39b" },
  { id: "k-max", name: "K Max", brand: "Natura", origin: "Nacional", family: "Amadeirado", notes: "Versão premium do Kaiak com notas amadeiradas intensas e sofisticadas. Para quem busca presença marcante.", price: 20990, oldPrice: null, badge: "Novo", top: "#c4b89a", bottom: "#9a8a6a" },
  { id: "yixiang-ladies", name: "Yixiang Ladies", brand: "Natura", origin: "Nacional", family: "Floral", notes: "Floral sofisticado com notas de rosa, peônia e almíscar branco. Elegância oriental moderna para ela.", price: 24990, oldPrice: null, badge: "Novo", top: "#e8c8d8", bottom: "#c8a8b8" },

  /* ---- Perfumes Árabes (Masculinos) ---- */
  { id: "asad", name: "Asad", brand: "Lattafa", origin: "Árabe", family: "Amadeirado", notes: "Notas: speciaria, âmbar, madeiras nobres. O árabe masculino mais vendido no Brasil em 2026.", price: 14990, oldPrice: null, badge: "Mais vendido", top: "#8a6d4f", bottom: "#5a4530" },
  { id: "club-de-nuit", name: "Club de Nuit Intense Man", brand: "Armaf", origin: "Árabe", family: "Amadeirado", notes: "Inspirado no Aventus (Creed). Notas: limão, abacaxi, flor de laranjeira, buxus, ambroxano, âmbar.", price: 17990, oldPrice: null, badge: null, top: "#7a8a6a", bottom: "#4a5a3a", inspiredBy: { name: "Aventus", brand: "Creed", color: "#2a3a2a" } },
  { id: "fakhar-black", name: "Fakhar Black", brand: "Lattafa", origin: "Árabe", family: "Amadeirado", notes: "Aromático fougère. Projeção intensa, entre os 3 mais vendidos no Brasil.", price: 13990, oldPrice: null, badge: "Top 3", top: "#3a3a3a", bottom: "#1a1a1a" },
  { id: "oud-for-glory", name: "Bade’e Al Oud – Oud for Glory", brand: "Lattafa", origin: "Árabe", family: "Amadeirado", notes: "Oud acessível com notas de açafrão, noz-moscada e âmbar.", price: 12990, oldPrice: null, badge: null, top: "#a08a5a", bottom: "#6a5a3a" },
  { id: "sceptre-malachite", name: "Sceptre Malachite", brand: "Maison Alhambra", origin: "Árabe", family: "Amadeirado", notes: "Inspirado no Erba Pura (Xerjoff). Notas frutadas e amadeiradas sofisticadas.", price: 15990, oldPrice: null, badge: null, top: "#5a8a5a", bottom: "#3a6a3a", inspiredBy: { name: "Erba Pura", brand: "Xerjoff", color: "#1a5a3a" } },
  { id: "laventure", name: "L’Aventure", brand: "Al Haramain", origin: "Árabe", family: "Cítrico", notes: "Best-seller nos EUA e Europa. Notas de limão, bergamota e patchouli.", price: 18990, oldPrice: null, badge: null, top: "#c4a87a", bottom: "#8a7a5a" },
  { id: "la-yuqawam-ambergris", name: "La Yuqawam Ambergris Showers", brand: "Rasasi", origin: "Árabe", family: "Amadeirado", notes: "Versão acessível do Tuscan Leather (Tom Ford). Couro, âmbar e especiarias.", price: 22990, oldPrice: null, badge: "Premium", top: "#6a4a3a", bottom: "#3a2a1a", inspiredBy: { name: "Tuscan Leather", brand: "Tom Ford", color: "#4a1a1a" } },
  { id: "attar-al-wesal", name: "Attar Al Wesal", brand: "Al Wataniah", origin: "Árabe", family: "Âmbar", notes: "Oriental adocicado. Notas de baunilha e âmbar. Entre os 5 mais vendidos no Brasil.", price: 11990, oldPrice: null, badge: "Top 5", top: "#d4a86a", bottom: "#a07a4a" },
  { id: "supremacy-collector", name: "Supremacy Collector’s Edition", brand: "Afnan", origin: "Árabe", family: "Amadeirado", notes: "Amadeirado especiado. Best-seller na Amazon EUA em 2026.", price: 19990, oldPrice: null, badge: null, top: "#9a7a5a", bottom: "#6a5a3a" },
  { id: "desert-oud", name: "Desert Oud", brand: "H HABIBI", origin: "Árabe", family: "Amadeirado", notes: "Oud amadeirado. Um dos mais vendidos em plataformas B2B/B2C nos EUA.", price: 16990, oldPrice: null, badge: null, top: "#7a6a4a", bottom: "#4a3a2a" },

  /* ---- Perfumes Árabes (Femininos) ---- */
  { id: "yara", name: "Yara", brand: "Lattafa", origin: "Árabe", family: "Floral", notes: "Floral frutado gourmand. Notas de orquídea, baunilha e heliotropo. O feminino mais vendido no Brasil.", price: 13990, oldPrice: null, badge: "Mais vendido", top: "#e8b4c8", bottom: "#c88aa8" },
  { id: "khamrah", name: "Khamrah", brand: "Lattafa", origin: "Árabe", family: "Âmbar", notes: "Inspirado no Angels’ Share (Kilian). Gourmand oriental especiado com canela, noz-moscada e âmbar.", price: 15990, oldPrice: null, badge: "Top 5", top: "#c49a6a", bottom: "#8a6a4a", inspiredBy: { name: "Angels Share", brand: "Kilian", color: "#5a3a1a" } },
  { id: "sabah-al-ward", name: "Sabah Al Ward", brand: "Al Wataniah", origin: "Árabe", family: "Floral", notes: "Floral amadeirado. Rosas, açafrão e oud. Segundo mais vendido no Brasil.", price: 12990, oldPrice: null, badge: "Top 2", top: "#d4a0a8", bottom: "#a07078" },
  { id: "fakhar-rose", name: "Fakhar Rose", brand: "Lattafa", origin: "Árabe", family: "Floral", notes: "Floral frutado. Notas de rosa, framboesa e baunilha. Entre os 10 mais vendidos.", price: 13990, oldPrice: null, badge: null, top: "#e0a0b0", bottom: "#b07080" },
  { id: "layali-rouge", name: "Layali Rouge", brand: "Swiss Arabian", origin: "Árabe", family: "Floral", notes: "Floral frutado. Best-seller nos EUA, com mais de 11 mil unidades vendidas em um mês.", price: 17990, oldPrice: null, badge: null, top: "#c85060", bottom: "#8a3040" },
  { id: "honey-oud", name: "Honey Oud", brand: "Bellavita Luxury", origin: "Árabe", family: "Floral", notes: "Floral oud adocicado. Top 1 feminino na Amazon EUA em 2026.", price: 21990, oldPrice: null, badge: "Top 1 EUA", top: "#d4b060", bottom: "#a08030" },
  { id: "amber-oud-rouge", name: "Amber Oud Rouge", brand: "Al Haramain", origin: "Árabe", family: "Âmbar", notes: "Oriental âmbar. Notas de âmbar, baunilha e frutas vermelhas.", price: 19990, oldPrice: null, badge: null, top: "#c06060", bottom: "#803030" },
  { id: "amber-oud-gold", name: "Amber Oud Gold Edition", brand: "Al Haramain", origin: "Árabe", family: "Âmbar", notes: "Oriental âmbar luxuoso. Versão dourada com alta avaliação (4.7/5).", price: 22990, oldPrice: null, badge: "Premium", top: "#d4b060", bottom: "#a08030" },
  { id: "urban-oud", name: "Urban Oud", brand: "H HABIBI", origin: "Árabe", family: "Floral", notes: "Oud floral moderno. Entre os 10 mais vendidos em plataformas B2B/B2C.", price: 15990, oldPrice: null, badge: null, top: "#b090a0", bottom: "#7a6070" },
  { id: "eclaire", name: "Eclaire", brand: "Lattafa", origin: "Árabe", family: "Floral", notes: "Floral gourmand envolvente. Notas de baunilha, flores brancas e âmbar. Suavidade e sofisticação em cada inspirada.", price: 14990, oldPrice: null, badge: null, top: "#e8c8a8", bottom: "#c8a878" },
  { id: "maison-alhambra-delilah", name: "Delilah", brand: "Maison Alhambra", origin: "Árabe", family: "Floral", notes: "Floral fresco e luminoso. Notas de rosa, peônia e almíscar branco. Elegância oriental moderna.", price: 16990, oldPrice: null, badge: null, top: "#d8b8c8", bottom: "#b898a8" },
  { id: "dehn-al-oud", name: "Dehn Al Oud Attar", brand: "Dukhni", origin: "Árabe", family: "Amadeirado", notes: "Oud puro tradicional. Óleo de oud concentrado, best-seller em nicho.", price: 24990, oldPrice: null, badge: "Nicho", top: "#5a4a3a", bottom: "#3a2a1a" },
  { id: "qaed-al-fursan", name: "Qaed Al Fursan", brand: "Lattafa", origin: "Árabe", family: "Amadeirado", notes: "Amadeirado sofisticado com notas de oud, âmbar e especiarias orientais. Fragrância marcante e duradoura.", price: 13990, oldPrice: null, badge: null, top: "#6a5a4a", bottom: "#4a3a2a" },
  { id: "woody-oud", name: "Woody Oud", brand: "Lattafa", origin: "Árabe", family: "Amadeirado", notes: "Oud amadeirado clássico. Notas de madeiras nobres, âmbar e almíscar. Tradição árabe em cada gota.", price: 15990, oldPrice: null, badge: null, top: "#7a6a5a", bottom: "#5a4a3a" },

  /* ---- Importados ---- */
  { id: "jadore", name: "J'adore", brand: "Dior", origin: "Importado", family: "Floral", notes: "", price: 87500, oldPrice: null, badge: "Mais vendido", top: "#f3d5c9", bottom: "#d98ea5" },
  { id: "sauvage", name: "Sauvage", brand: "Dior", origin: "Importado", family: "Cítrico", notes: "", price: 69900, oldPrice: null, badge: "Mais vendido", top: "#f6e8bd", bottom: "#dfcf8b" },
  { id: "la-vie-est-belle", name: "La Vie Est Belle", brand: "Lancôme", origin: "Importado", family: "Floral", notes: "", price: 80900, oldPrice: null, badge: "Mais vendido", top: "#f1d0c8", bottom: "#e2a58f" },
  { id: "good-girl", name: "Good Girl", brand: "Carolina Herrera", origin: "Importado", family: "Âmbar", notes: "", price: 89990, oldPrice: null, badge: "Mais vendido", top: "#ecd9a8", bottom: "#c99d52" },
  { id: "coco-mademoiselle", name: "Coco Mademoiselle", brand: "Chanel", origin: "Importado", family: "Floral", notes: "", price: 141500, oldPrice: null, badge: null, top: "#f0e0b8", bottom: "#d6ad68" },
  { id: "libre", name: "Libre", brand: "Yves Saint Laurent", origin: "Importado", family: "Âmbar", notes: "", price: 75500, oldPrice: null, badge: "Exclusivo", top: "#eed9b0", bottom: "#cf9f5e" },
  { id: "eros", name: "Eros", brand: "Versace", origin: "Importado", family: "Âmbar", notes: "", price: 79900, oldPrice: null, badge: null, top: "#e8d3b4", bottom: "#c0915a" },
  { id: "acqua-di-gio", name: "Acqua di Giò", brand: "Giorgio Armani", origin: "Importado", family: "Cítrico", notes: "", price: 67900, oldPrice: null, badge: null, top: "#f7e6b5", bottom: "#e0c87e" },
  { id: "1-million", name: "1 Million", brand: "Paco Rabanne", origin: "Importado", family: "Âmbar", notes: "", price: 47900, oldPrice: 66990, badge: "Oferta", top: "#e8d3b4", bottom: "#b98f5a" },
  { id: "scandal", name: "Scandal", brand: "Jean Paul Gaultier", origin: "Importado", family: "Âmbar", notes: "", price: 51900, oldPrice: null, badge: null, top: "#ecd9a8", bottom: "#c99d52" },
];

const FAMILIES = ["Floral", "Cítrico", "Amadeirado", "Âmbar"];
const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))];

/* ---------- Formatação ---------- */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatPrice(cents) {
  return brl.format(cents / 100);
}

/* ---------- Schema Markup (SEO) ---------- */

function injectProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Perfumes Ju Perfumaria",
    "description": "Catálogo de perfumes originais das melhores grifes do mundo.",
    "numberOfItems": PRODUCTS.length,
    "itemListElement": PRODUCTS.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "description": p.notes || `${p.name} - perfume ${p.brand} ${p.family}`,
        "brand": {
          "@type": "Brand",
          "name": p.brand
        },
        "image": `https://juperfumaria.com.br/images/products/${p.id}.jpg`,
        "offers": {
          "@type": "Offer",
          "price": (p.price / 100).toFixed(2),
          "priceCurrency": "BRL",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "LocalBusiness",
            "name": "Ju Perfumaria"
          }
        }
      }
    }))
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// Injetar schema quando a página carregar
document.addEventListener("DOMContentLoaded", injectProductSchema);

/* ---------- Imagem / ilustração do frasco ---------- */

function productImagePath(product) {
  return `images/products/${product.id}.jpg`;
}

function bottleElement(product) {
  const wrapper = document.createElement("span");
  wrapper.innerHTML = bottleSVG(product);
  return wrapper.firstElementChild;
}

function productImg(product, cls) {
  const img = document.createElement("img");
  img.className = cls;
  img.src = productImagePath(product);
  img.alt = `${product.name} — perfume ${product.brand}`;
  img.width = 700;
  img.height = 700;
  img.loading = "lazy";
  img.decoding = "async";
  img.dataset.pid = product.id;
  return img;
}

function bottleSVG(product) {
  const id = `b-${product.id}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320" width="400" height="500" role="img" aria-label="Frasco de ${product.name}">` +
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${product.top}"/><stop offset="1" stop-color="${product.bottom}"/>` +
    `</linearGradient></defs>` +
    `<rect x="78" y="26" width="44" height="26" rx="6" fill="#b08d4f"/>` +
    `<rect x="88" y="52" width="24" height="18" fill="#c9a961"/>` +
    `<path d="M70 70 h60 l-6 190 a14 14 0 0 1 -14 14 h-20 a14 14 0 0 1 -14 -14 Z" fill="url(#${id})"/>` +
    `<rect x="82" y="92" width="36" height="4" rx="2" fill="#6e5329" opacity=".45"/>` +
    `<text x="100" y="150" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#5f4723">${product.name.split(" ")[0]}</text>` +
    `<text x="100" y="172" text-anchor="middle" font-family="Georgia, serif" font-size="8" letter-spacing="2" fill="#7a5f34">${product.family.toUpperCase()}</text>` +
    `</svg>`
  );
}

/* ---------- Estado do carrinho ---------- */

const STORAGE_KEY = "ju-perfumaria-cart";
let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const valid = {};
    if (parsed && typeof parsed === "object") {
      for (const [id, qty] of Object.entries(parsed)) {
        if (PRODUCTS.some((p) => p.id === id) && Number.isFinite(qty) && qty > 0) {
          valid[id] = qty;
        }
      }
    }
    return valid;
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return product ? sum + product.price * qty : sum;
  }, 0);
}

/* ---------- DOM ---------- */

const $ = (sel) => document.querySelector(sel);

const grid = $("#product-grid");
const chips = document.querySelectorAll(".chip[data-filter]");
const cartBtn = $("#cart-btn");
const cartCountEl = $(".cart-badge");
const cartCountMobileEl = $("#cart-count-mobile");
const menuBtn = $("#menu-btn");
const menuClose = $("#menu-close");
const mobileMenu = $("#mobile-menu");
const mobileCartBtn = $("#mobile-cart-btn");
const drawer = $("#cart-drawer");
const overlay = $("#overlay");
const cartItemsEl = $("#cart-items");
const cartEmptyEl = $("#cart-empty");
const cartFootEl = $("#cart-foot");
const cartTotalEl = $("#cart-total");
const toastEl = $("#toast");
const quizResult = $("#quiz-result");
const quizOptions = $("#quiz-options");
const modal = $("#checkout-modal");
const modalCount = $("#modal-count");
const modalTotal = $("#modal-total");
const modalOrder = $("#modal-order");
const modalWhatsApp = $("#modal-whatsapp");
const scrollProgress = $("#scroll-progress");

let originFilter = "todos";
let familyFilter = "todos";
let brandFilter = "todos";
let lastFocused = null;

/* ---------- Renderizar produtos ---------- */

const compactMQ = window.matchMedia("(max-width: 520px)");

function addLabel() {
  return compactMQ.matches ? "Adicionar" : "Adicionar ao carrinho";
}

function renderProducts() {
  const list = PRODUCTS.filter((p) => {
    const byOrigin = originFilter === "todos" || p.origin === originFilter;
    const byFamily = familyFilter === "todos" || p.family === familyFilter;
    const byBrand = brandFilter === "todos" || p.brand === brandFilter;
    return byOrigin && byFamily && byBrand;
  });

  const items = list.map((p) => {
    const badge = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";
    const old = p.oldPrice ? `<s>${formatPrice(p.oldPrice)}</s>` : "";
    const item = document.createElement("li");
    item.className = "product-card";
    item.dataset.family = p.family;
    item.dataset.brand = p.brand;
    item.dataset.origin = p.origin;

    const media = document.createElement("div");
    media.className = "product-media";
    media.style.setProperty("--card-top", p.top);
    media.style.setProperty("--card-bottom", p.bottom);
    if (badge) {
      const b = document.createElement("span");
      b.className = "product-badge";
      b.innerHTML = badge;
      media.appendChild(b);
    }
    media.appendChild(productImg(p, "product-img"));

    const body = document.createElement("div");
    body.className = "product-body";
    const shortNotes = (p.notes && p.notes.length > 90) ? p.notes.slice(0, 90).replace(/\s+\S*$/, "") + "…" : p.notes;
    body.innerHTML =
      `<p class="product-family">${p.brand} · ${p.family}</p>` +
      `<h3 class="product-name">${p.name}</h3>` +
      `<p class="product-notes" title="${p.notes}">${shortNotes}</p>` +
      `<p class="product-price"><strong>${formatPrice(p.price)}</strong>${old}</p>` +
      `<button class="btn btn-gold add-btn" type="button" data-add="${p.id}">${addLabel()}</button>`;

    item.appendChild(media);
    item.appendChild(body);
    return item;
  });

  grid.replaceChildren(...items);
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
});

/* Lançamentos Ciclo 12 — botões */
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".launch-card [data-add]");
  if (!btn) return;
  addToCart(btn.dataset.add);
  btn.textContent = "Adicionado ✓";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Adicionar ao carrinho";
    btn.classList.remove("added");
  }, 1500);
});

/* Fallback: se a foto não carregar, usa a ilustração do frasco */
grid.addEventListener(
  "error",
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.pid) return;
    const product = PRODUCTS.find((p) => p.id === img.dataset.pid);
    if (product) img.replaceWith(bottleElement(product));
  },
  true
);

/* ---------- Filtro por origem ---------- */

document.querySelectorAll(".origin-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    originFilter = chip.dataset.origin;
    document.querySelectorAll(".origin-chip").forEach((c) => {
      c.classList.toggle("is-active", c === chip);
    });
    renderProducts();
  });
});

/* ---------- Filtro por família ---------- */

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    familyFilter = chip.dataset.filter;
    chips.forEach((c) => c.classList.toggle("is-active", c === chip));
    renderProducts();
  });
});

/* ---------- Filtro por marca ---------- */

function populateBrandChips() {
  const container = $("#brand-filters");
  container.innerHTML =
    `<button type="button" class="chip brand-chip is-active" data-brand="todos">Todas as marcas</button>` +
    BRANDS.map(
      (b) => `<button type="button" class="chip brand-chip" data-brand="${b}">${b}</button>`
    ).join("");
}

$("#brand-filters").addEventListener("click", (event) => {
  const chip = event.target.closest(".brand-chip");
  if (!chip) return;
  brandFilter = chip.dataset.brand;
  document.querySelectorAll(".brand-chip").forEach((c) => {
    c.classList.toggle("is-active", c === chip);
  });
  renderProducts();
});

/* ---------- Quiz ---------- */

quizOptions.addEventListener("click", (event) => {
  const option = event.target.closest(".quiz-option");
  if (!option) return;

  // Animação visual de seleção
  quizOptions.querySelectorAll(".quiz-option").forEach((o) => o.classList.remove("selected"));
  option.classList.add("selected");

  const family = option.dataset.family;
  familyFilter = family;
  chips.forEach((c) => c.classList.toggle("is-active", c.dataset.filter === family));
  renderProducts();

  const match = PRODUCTS.filter((p) => p.family === family);
  quizResult.textContent =
    match.length > 0
      ? `Perfeito! Mostrando ${match.length} perfume(s) da família ${family} para você ↓`
      : `Escolha certa! Mostrando a família ${family} ↓`;

  const target = $("#perfumes");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ---------- Carrinho ---------- */

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  pulseCartBadge();
  bumpPrice();
  showToast("Adicionado ao carrinho ✓");
  openDrawer();
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) {
    delete cart[id];
  } else {
    cart[id] = next;
  }
  saveCart();
  renderCart();
  bumpPrice();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
  showToast("Item removido do carrinho");
}

function renderCart() {
  const count = cartCount();
  cartCountEl.textContent = count;
  cartCountMobileEl.textContent = count;

  const entries = Object.entries(cart);
  cartEmptyEl.hidden = entries.length > 0;
  cartFootEl.hidden = entries.length === 0;

  cartItemsEl.replaceChildren(
    ...entries.map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return null;
      const li = document.createElement("li");
      li.className = "cart-item";
      li.appendChild(productImg(product, "cart-img"));

      const info = document.createElement("div");
      info.innerHTML =
        `<p class="cart-item-name">${product.name}</p>` +
        `<p class="cart-item-price">${formatPrice(product.price)}</p>` +
        `<div class="qty">` +
        `<button type="button" aria-label="Diminuir quantidade de ${product.name}" data-dec="${id}">−</button>` +
        `<span aria-live="polite">${qty}</span>` +
        `<button type="button" aria-label="Aumentar quantidade de ${product.name}" data-inc="${id}">+</button>` +
        `</div>`;

      const remove = document.createElement("button");
      remove.className = "cart-item-remove";
      remove.type = "button";
      remove.dataset.remove = id;
      remove.setAttribute("aria-label", `Remover ${product.name} do carrinho`);
      remove.textContent = "Remover";

      li.appendChild(info);
      li.appendChild(remove);
      return li;
    }).filter(Boolean)
  );

  cartTotalEl.textContent = formatPrice(cartTotal());
}

cartItemsEl.addEventListener("click", (event) => {
  const target = event.target;
  if (target.dataset.dec) changeQty(target.dataset.dec, -1);
  if (target.dataset.inc) changeQty(target.dataset.inc, 1);
  if (target.dataset.remove) removeItem(target.dataset.remove);
});

cartItemsEl.addEventListener(
  "error",
  (event) => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.pid) return;
    const product = PRODUCTS.find((p) => p.id === img.dataset.pid);
    if (product) img.replaceWith(bottleElement(product));
  },
  true
);

/* ---------- Drawer / menu / overlay ---------- */

let drawerOpen = false;
let menuOpen = false;

function setBodyLock() {
  const locked = drawerOpen || menuOpen || !modal.hidden;
  document.body.style.overflow = locked ? "hidden" : "";
}

function openDrawer() {
  drawerOpen = true;
  lastFocused = document.activeElement;
  drawer.hidden = false;
  overlay.hidden = false;
  cartBtn.setAttribute("aria-expanded", "true");
  setBodyLock();
  $("#cart-close").focus();
}

function closeDrawer() {
  drawerOpen = false;
  drawer.hidden = true;
  cartBtn.setAttribute("aria-expanded", "false");
  overlay.hidden = !menuOpen;
  setBodyLock();
  if (lastFocused && !menuOpen) lastFocused.focus();
}

function openMenu() {
  menuOpen = true;
  lastFocused = document.activeElement;
  mobileMenu.hidden = false;
  overlay.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  setBodyLock();
  menuClose.focus();
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  overlay.hidden = !drawerOpen;
  setBodyLock();
  if (lastFocused && !drawerOpen) lastFocused.focus();
}

cartBtn.addEventListener("click", () => {
  drawerOpen ? closeDrawer() : openDrawer();
});

mobileCartBtn.addEventListener("click", () => {
  drawerOpen ? closeDrawer() : openDrawer();
});

menuBtn.addEventListener("click", () => {
  menuOpen ? closeMenu() : openMenu();
});

$("#cart-close").addEventListener("click", closeDrawer);
menuClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", () => {
  closeDrawer();
  closeMenu();
});

document.querySelectorAll(".mobile-menu-links a").forEach((a) => {
  a.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!modal.hidden) closeModal();
    else if (menuOpen) closeMenu();
    else if (drawerOpen) closeDrawer();
  }
});

/* ---------- Finalizar pedido ---------- */

$("#checkout-btn").addEventListener("click", () => {
  const entries = Object.entries(cart);
  if (entries.length === 0) return;

  const lines = entries.map(([id, qty]) => {
    const p = PRODUCTS.find((prod) => prod.id === id);
    return `• ${qty}x ${p.name} — ${formatPrice(p.price * qty)}`;
  });

  const totalText = formatPrice(cartTotal());
  modalCount.textContent = String(cartCount());
  modalTotal.textContent = totalText;
  modalOrder.textContent = `Olá, Ju! Quero finalizar meu pedido:\n${lines.join("\n")}\nTotal: ${totalText}`;
  modalWhatsApp.href = `https://wa.me/5521996851605?text=${encodeURIComponent(modalOrder.textContent)}`;

  modal.hidden = false;
  setBodyLock();
  $("#modal-close").focus();
});

function closeModal() {
  modal.hidden = true;
  setBodyLock();
}

$("#modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

/* ---------- Formulário de contato ---------- */

$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#cf-name").value.trim();
  const message = $("#cf-msg").value.trim();
  if (!name || !message) return;

  const text = `Olá, Ju! Meu nome é ${name}.\n${message}`;
  window.open(
    `https://wa.me/5521996851605?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener"
  );
  event.target.reset();
});

/* ---------- Modo noturno ---------- */

const themeBtn = $("#theme-btn");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeBtn.setAttribute("aria-pressed", String(dark));
  themeBtn.setAttribute("aria-label", dark ? "Desativar modo noturno" : "Ativar modo noturno");
  if (themeMeta) themeMeta.setAttribute("content", dark ? "#1a1714" : "#faf6f0");
  localStorage.setItem("ju-perfumaria-theme", dark ? "dark" : "light");
}

themeBtn.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark"));
});

/* ---------- Toast ---------- */

let toastTimer = null;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2200);
}

/* ---------- Scroll Reveal (IntersectionObserver) ---------- */

function initScrollReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ---------- Scroll Progress Bar (fallback se Lenis não carregar) ---------- */

function initScrollProgress() {
  if (!scrollProgress) return;

  // Se Lenis estiver ativo, ele cuida do progresso
  if (typeof Lenis !== "undefined") return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${Math.min(progress, 100)}%`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ---------- Header scroll effect ---------- */

function initHeaderScroll() {
  const header = $(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      header.style.boxShadow = "var(--shadow-sm)";
    } else {
      header.style.boxShadow = "none";
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ---------- Lenis Smooth Scroll ---------- */

function initLenis() {
  if (typeof Lenis === "undefined") return null;

  const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    allowNestedScroll: true,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    respectReducedMotion: true,
  });

  // Sincronizar com scroll progress
  lenis.on("scroll", () => {
    const scrollTop = lenis.scroll;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  });

  return lenis;
}

/* ---------- Spotlight Card (inspira-ui) ---------- */

function initSpotlightCards() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  grid.addEventListener("mousemove", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
}

/* ---------- Text Reveal (inspira-ui) ---------- */

function initTextReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".reveal-text").forEach((el) => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");

    if (prefersReduced) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
  });
}

/* ---------- Micro-interactions ---------- */

/* Ripple effect nos botões */
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn");
  if (!btn) return;

  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

/* Badge pulse ao adicionar ao carrinho */
function pulseCartBadge() {
  [cartCountEl, cartCountMobileEl].forEach((badge) => {
    badge.classList.remove("pulse", "glow");
    void badge.offsetWidth; // force reflow
    badge.classList.add("pulse", "glow");
    badge.addEventListener("animationend", () => {
      badge.classList.remove("pulse", "glow");
    }, { once: true });
  });
}

/* Preço bump no total */
function bumpPrice() {
  const el = cartTotalEl;
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
  el.addEventListener("animationend", () => el.classList.remove("bump"), { once: true });
}

/* Tilt 3D nos cards de produto */
function initCardTilt() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  grid.addEventListener("mousemove", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  grid.addEventListener("mouseleave", (event) => {
    const card = event.target.closest(".product-card");
    if (card) card.style.transform = "";
  }, true);

  // Reset no mouseleave de cada card
  grid.addEventListener("mouseout", (event) => {
    const card = event.target.closest(".product-card");
    if (card && !card.contains(event.relatedTarget)) {
      card.style.transform = "";
    }
  });
}



/* ---------- Perfumes Árabes — SVGs dos frascos ---------- */

function arabBottleSVG(p) {
  const id = `arab-${p.id}`;
  const brand = p.brand;

  // Lattafa — frasco retangular alto com tampa ornada
  if (brand === "Lattafa") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <rect x="42" y="8" width="36" height="18" rx="3" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
      <rect x="48" y="26" width="24" height="12" fill="rgba(255,255,255,0.1)"/>
      <path d="M28 38 h64 v8 l-2 130 a12 12 0 0 1 -12 12 h-36 a12 12 0 0 1 -12 -12 l-2 -130 z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <rect x="34" y="52" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
      <text x="60" y="105" text-anchor="middle" font-family="Cormorant,serif" font-size="13" fill="rgba(255,255,255,0.85)" font-weight="700">${p.name.split(" ")[0]}</text>
      <text x="60" y="122" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="5.5" letter-spacing="2" fill="rgba(255,255,255,0.5)">LATTAFA</text>
      <circle cx="60" cy="145" r="8" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
    </svg>`;
  }

  // Armaf — frasco arredondado elegante
  if (brand === "Armaf") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="14" rx="16" ry="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="0.6"/>
      <rect x="54" y="22" width="12" height="16" fill="rgba(255,255,255,0.1)"/>
      <path d="M30 38 Q30 32 40 32 h40 Q90 32 90 38 v120 Q90 172 75 174 h-30 Q45 172 45 158 Z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <path d="M38 50 Q60 46 82 50" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
      <text x="60" y="100" text-anchor="middle" font-family="Cormorant,serif" font-size="11" fill="rgba(255,255,255,0.85)" font-weight="700">${p.name.split(" ")[0]}</text>
      <text x="60" y="116" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="5" letter-spacing="1.5" fill="rgba(255,255,255,0.5)">ARMAF</text>
      <path d="M42 140 Q60 148 78 140" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
    </svg>`;
  }

  // Maison Alhambra — frasco geométrico angular
  if (brand === "Maison Alhambra") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <polygon points="50,8 70,8 72,26 48,26" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="0.6"/>
      <rect x="52" y="26" width="16" height="10" fill="rgba(255,255,255,0.08)"/>
      <polygon points="25,36 95,36 88,170 32,170" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <line x1="32" y1="80" x2="88" y2="80" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
      <text x="60" y="108" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.length > 12 ? p.name.split(" ")[0] : p.name}</text>
      <text x="60" y="122" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="4" letter-spacing="1" fill="rgba(255,255,255,0.5)">MAISON ALHAMBRA</text>
    </svg>`;
  }

  // Al Haramain — frasco clássico curvo
  if (brand === "Al Haramain") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <rect x="48" y="6" width="24" height="14" rx="4" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
      <rect x="54" y="20" width="12" height="14" fill="rgba(255,255,255,0.08)"/>
      <path d="M32 34 Q32 30 38 28 h44 Q90 30 90 34 v4 Q92 40 92 50 v100 Q92 168 78 172 h-36 Q42 168 42 150 V50 Q42 40 44 34 Z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <ellipse cx="60" cy="70" rx="20" ry="12" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
      <text x="60" y="105" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.split(" ")[0]}</text>
      <text x="60" y="120" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="4.5" letter-spacing="1.5" fill="rgba(255,255,255,0.5)">AL HARAMAIN</text>
    </svg>`;
  }

  // Rasasi — frasco alto e fino
  if (brand === "Rasasi") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <rect x="50" y="4" width="20" height="12" rx="2" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.25)" stroke-width="0.5"/>
      <rect x="55" y="16" width="10" height="18" fill="rgba(255,255,255,0.08)"/>
      <path d="M38 34 h44 l2 136 a8 8 0 0 1 -8 8 h-32 a8 8 0 0 1 -8 -8 Z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <rect x="42" y="44" width="36" height="2" rx="1" fill="rgba(255,255,255,0.1)"/>
      <text x="60" y="100" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.length > 10 ? p.name.split(" ")[0] : p.name}</text>
      <text x="60" y="114" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="5" letter-spacing="1.5" fill="rgba(255,255,255,0.5)">RASASI</text>
    </svg>`;
  }

  // Al Wataniah — frasco arredondado tradicional
  if (brand === "Al Wataniah") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="14" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="0.5"/>
      <rect x="56" y="24" width="8" height="12" fill="rgba(255,255,255,0.08)"/>
      <ellipse cx="60" cy="110" rx="32" ry="55" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <text x="60" y="105" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.split(" ")[0]}</text>
      <text x="60" y="120" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="4" letter-spacing="1" fill="rgba(255,255,255,0.5)">AL WATANIAH</text>
    </svg>`;
  }

  // Afnan — frasco moderno
  if (brand === "Afnan") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <rect x="46" y="6" width="28" height="14" rx="6" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.25)" stroke-width="0.5"/>
      <rect x="52" y="20" width="16" height="14" rx="2" fill="rgba(255,255,255,0.08)"/>
      <path d="M30 34 Q30 28 36 26 h48 Q90 28 90 34 v4 Q88 42 86 48 l-2 116 Q84 172 72 174 h-24 Q42 172 42 164 L40 48 Q38 42 36 38 Z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <text x="60" y="100" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.split(" ")[0]}</text>
      <text x="60" y="115" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="5" letter-spacing="1.5" fill="rgba(255,255,255,0.5)">AFNAN</text>
    </svg>`;
  }

  // H HABIBI — frasco minimalista
  if (brand === "H HABIBI") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <rect x="48" y="8" width="24" height="10" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
      <rect x="54" y="18" width="12" height="16" fill="rgba(255,255,255,0.08)"/>
      <rect x="32" y="34" width="56" height="130" rx="6" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <text x="60" y="100" text-anchor="middle" font-family="Cormorant,serif" font-size="11" fill="rgba(255,255,255,0.85)" font-weight="700">${p.name.split(" ")[0]}</text>
      <text x="60" y="116" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="4.5" letter-spacing="1.5" fill="rgba(255,255,255,0.5)">H HABIBI</text>
      <line x1="42" y1="140" x2="78" y2="140" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
    </svg>`;
  }

  // Swiss Arabian — frasco elegante curvo
  if (brand === "Swiss Arabian") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="12" rx="12" ry="7" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="0.5"/>
      <rect x="55" y="19" width="10" height="12" fill="rgba(255,255,255,0.08)"/>
      <path d="M36 31 Q28 31 26 40 Q24 50 28 56 L36 60 Q36 68 34 80 L34 150 Q34 170 52 172 h16 Q86 170 86 150 L86 80 Q84 68 84 60 L92 56 Q96 50 94 40 Q92 31 84 31 Z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <text x="60" y="105" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.split(" ")[0]}</text>
      <text x="60" y="120" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="4" letter-spacing="1" fill="rgba(255,255,255,0.5)">SWISS ARABIAN</text>
    </svg>`;
  }

  // Bellavita Luxury — frasco luxuoso arredondado
  if (brand === "Bellavita Luxury") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <rect x="44" y="6" width="32" height="12" rx="6" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
      <rect x="50" y="18" width="20" height="10" fill="rgba(255,255,255,0.08)"/>
      <path d="M30 28 Q30 24 36 22 h48 Q90 24 90 28 Q94 32 94 40 v108 Q94 168 76 172 h-32 Q40 168 40 148 V40 Q40 32 44 28 Z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <circle cx="60" cy="60" r="14" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
      <text x="60" y="100" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.split(" ")[0]}</text>
      <text x="60" y="114" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="4" letter-spacing="1" fill="rgba(255,255,255,0.5)">BELLAVITA</text>
    </svg>`;
  }

  // Dukhni — frasco attar tradicional (pequeno redondo)
  if (brand === "Dukhni") {
    return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g-${id}" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stop-color="${p.top}"/>
          <stop offset="1" stop-color="${p.bottom}"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="16" r="10" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
      <rect x="56" y="26" width="8" height="8" fill="rgba(255,255,255,0.08)"/>
      <circle cx="60" cy="110" r="45" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <circle cx="60" cy="110" r="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
      <text x="60" y="108" text-anchor="middle" font-family="Cormorant,serif" font-size="10" fill="rgba(255,255,255,0.85)" font-weight="600">${p.name.split(" ")[0]}</text>
      <text x="60" y="122" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="4.5" letter-spacing="1" fill="rgba(255,255,255,0.5)">DUKHNI</text>
    </svg>`;
  }

  // Default — frasco genérico elegante
  return `<svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p.top}"/>
        <stop offset="1" stop-color="${p.bottom}"/>
      </linearGradient>
    </defs>
    <rect x="46" y="8" width="28" height="14" rx="4" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.25)" stroke-width="0.5"/>
    <rect x="52" y="22" width="16" height="12" fill="rgba(255,255,255,0.08)"/>
    <path d="M32 34 h56 l2 128 a10 10 0 0 1 -10 10 h-40 a10 10 0 0 1 -10 -10 Z" fill="url(#g-${id})" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
    <text x="60" y="105" text-anchor="middle" font-family="Cormorant,serif" font-size="11" fill="rgba(255,255,255,0.85)" font-weight="700">${p.name.split(" ")[0]}</text>
    <text x="60" y="120" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="5" letter-spacing="1.5" fill="rgba(255,255,255,0.5)">${p.brand.toUpperCase()}</text>
  </svg>`;
}

/* ---------- Perfumes Árabes — Renderização ---------- */

function renderArabPerfumes() {
  const arabMasculine = $("#arab-masculine");
  const arabFeminine = $("#arab-feminine");
  if (!arabMasculine || !arabFeminine) return;

  const masculinos = PRODUCTS.filter((p) => p.origin === "Árabe" && (p.family === "Amadeirado" || p.family === "Cítrico" || p.family === "Âmbar"));
  const femininos = PRODUCTS.filter((p) => p.origin === "Árabe" && (p.family === "Floral" || p.family === "Âmbar"));

  function createArabCard(p) {
    const card = document.createElement("article");
    card.className = "arab-card reveal";
    card.dataset.productId = p.id;

    const badgeClass = p.badge ? (p.badge === "Premium" || p.badge === "Nicho" ? "arab-card-badge arab-card-badge--dark" : "arab-card-badge") : "";

    // Botão de inspiração
    const inspiredBtn = p.inspiredBy ? `
      <div class="arab-inspire-wrap">
        <button class="arab-inspire-btn" type="button" aria-label="Ver inspiração: ${p.inspiredBy.name} ${p.inspiredBy.brand}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Inspiração
        </button>
        <div class="arab-inspire-tooltip">
          <div class="arab-inspire-card">
            <div class="arab-inspire-visual" style="background: linear-gradient(135deg, ${p.inspiredBy.color}, ${p.inspiredBy.color}dd)">
              <svg viewBox="0 0 60 100" width="40" height="66" fill="none" aria-hidden="true">
                <rect x="18" y="5" width="24" height="10" rx="3" fill="rgba(255,255,255,0.2)"/>
                <rect x="22" y="15" width="16" height="8" fill="rgba(255,255,255,0.15)"/>
                <path d="M15 23 h30 l-2 65 a5 5 0 0 1 -5 5 h-16 a5 5 0 0 1 -5 -5 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
              </svg>
            </div>
            <p class="arab-inspire-label">Inspiração para:</p>
            <p class="arab-inspire-name">${p.inspiredBy.name}</p>
            <p class="arab-inspire-brand">${p.inspiredBy.brand}</p>
          </div>
        </div>
      </div>
    ` : "";

    card.innerHTML = `
      <div class="arab-card-media" style="--card-top:${p.top};--card-bottom:${p.bottom}">
        ${p.badge ? `<span class="${badgeClass}">${p.badge}</span>` : ""}
        <span class="arab-card-brand">${p.brand}</span>
        <img class="arab-card-img" src="${getUploadedImage(p.id) || 'images/arab/' + p.id + '.jpg'}" alt="${p.name} — ${p.brand}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
        <div class="arab-card-svg" style="display:none">${arabBottleSVG(p)}</div>
      </div>
      <div class="arab-card-body">
        <p class="arab-card-family">${p.brand} · ${p.family}</p>
        <h3 class="arab-card-name">${p.name}</h3>
        <p class="arab-card-notes" title="${p.notes}">${p.notes.length > 100 ? p.notes.slice(0, 100).replace(/\s+\S*$/, "") + "…" : p.notes}</p>
        <div class="arab-card-actions">
          <p class="arab-card-price"><strong>${formatPrice(p.price)}</strong></p>
          ${inspiredBtn}
        </div>
        <button class="btn btn-gold" type="button" data-add="${p.id}">Adicionar ao carrinho</button>
      </div>
    `;
    return card;
  }

  arabMasculine.replaceChildren(...masculinos.map(createArabCard));
  arabFeminine.replaceChildren(...femininos.map(createArabCard));
}

/* Click handler para cards árabes */
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".arab-card [data-add]");
  if (!btn) return;
  addToCart(btn.dataset.add);
  btn.textContent = "Adicionado ✓";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Adicionar ao carrinho";
    btn.classList.remove("added");
  }, 1500);
});

/* ---------- Painel de Upload de Imagens ---------- */

const UPLOAD_KEY = "ju-perfumaria-images";

function loadUploadedImages() {
  try {
    return JSON.parse(localStorage.getItem(UPLOAD_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUploadedImages(images) {
  localStorage.setItem(UPLOAD_KEY, JSON.stringify(images));
}

function getUploadedImage(id) {
  const images = loadUploadedImages();
  return images[id] || null;
}

function initUploadPanel() {
  const toggle = $("#upload-toggle");
  const panel = $("#upload-panel");
  const close = $("#upload-close");
  const dropzone = $("#upload-dropzone");
  const input = $("#upload-input");
  const list = $("#upload-list");
  const exportBtn = $("#upload-export");
  const clearBtn = $("#upload-clear");

  if (!toggle || !panel) return;

  // Abrir/fechar painel
  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) renderUploadList();
  });

  close.addEventListener("click", () => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  });

  // Drag and drop
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  // Click para selecionar
  dropzone.addEventListener("click", () => input.click());
  input.addEventListener("change", () => handleFiles(input.files));

  // Processar arquivos
  function handleFiles(files) {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        // Tentar associar ao produto pelo nome do arquivo
        const fileName = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9-]/g, "-");

        // Procurar produto correspondente
        const product = PRODUCTS.find((p) => {
          const id = p.id.toLowerCase();
          return fileName.includes(id) || id.includes(fileName) ||
                 fileName.includes(p.name.toLowerCase().split(" ")[0]);
        });

        const key = product ? product.id : fileName;

        const images = loadUploadedImages();
        images[key] = dataUrl;
        saveUploadedImages(images);

        showToast(`Imagem salva: ${product ? product.name : key}`);
        renderUploadList();
        updateArabImages();
      };
      reader.readAsDataURL(file);
    });
  }

  // Renderizar lista de imagens salvas
  function renderUploadList() {
    const images = loadUploadedImages();
    const entries = Object.entries(images);

    list.innerHTML = entries.map(([id, dataUrl]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      const name = product ? `${product.name} (${product.brand})` : id;
      const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);

      return `<div class="upload-item">
        <img class="upload-item-img" src="${dataUrl}" alt="${name}">
        <div>
          <p class="upload-item-name">${name}</p>
          <p class="upload-item-size">${sizeKB} KB</p>
        </div>
        <button class="upload-item-remove" type="button" data-remove="${id}" aria-label="Remover ${name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>`;
    }).join("");

    // Handlers de remover
    list.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const images = loadUploadedImages();
        delete images[btn.dataset.remove];
        saveUploadedImages(images);
        renderUploadList();
        updateArabImages();
        showToast("Imagem removida");
      });
    });
  }

  // Exportar imagens
  exportBtn.addEventListener("click", () => {
    const images = loadUploadedImages();
    Object.entries(images).forEach(([id, dataUrl]) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${id}.jpg`;
      link.click();
    });
    showToast("Imagens baixadas!");
  });

  // Limpar todas
  clearBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja remover todas as imagens?")) {
      localStorage.removeItem(UPLOAD_KEY);
      renderUploadList();
      updateArabImages();
      showToast("Todas as imagens foram removidas");
    }
  });
}

// Atualizar imagens dos cards árabes
function updateArabImages() {
  document.querySelectorAll(".arab-card-img").forEach((img) => {
    const card = img.closest(".arab-card");
    if (!card) return;
    const id = card.dataset.productId;
    const uploaded = getUploadedImage(id);
    if (uploaded) {
      img.src = uploaded;
      img.style.display = "block";
      const svg = img.nextElementSibling;
      if (svg) svg.style.display = "none";
    }
  });
}

/* ---------- Girasol (logo animada + hero interativo) ---------- */

function sunflowerSVG(petalCount, seedCount, isHero) {
  let svg = `<svg viewBox="0 0 100 100" role="img" aria-label="Girasol">`;
  svg += `<defs>`;

  // Gradiente orgânico para pétalas externas
  svg += `<radialGradient id="petal-outer" cx="50%" cy="20%" r="80%">`;
  svg += `<stop offset="0%" stop-color="#f0c840"/>`;
  svg += `<stop offset="60%" stop-color="#eab13c"/>`;
  svg += `<stop offset="100%" stop-color="#c98f2a"/>`;
  svg += `</radialGradient>`;

  // Gradiente para pétalas internas
  svg += `<radialGradient id="petal-inner" cx="50%" cy="30%" r="70%">`;
  svg += `<stop offset="0%" stop-color="#f5d760"/>`;
  svg += `<stop offset="100%" stop-color="#daa520"/>`;
  svg += `</radialGradient>`;

  // Gradiente para o centro
  svg += `<radialGradient id="center-grad" cx="45%" cy="40%" r="60%">`;
  svg += `<stop offset="0%" stop-color="#8b6914"/>`;
  svg += `<stop offset="50%" stop-color="#5b4020"/>`;
  svg += `<stop offset="100%" stop-color="#3d2c14"/>`;
  svg += `</radialGradient>`;

  svg += `</defs>`;
  svg += `<g class="sunflower-inner">`;

  // Camada 1: Pétalas externas (maiores, mais escuras)
  for (let i = 0; i < petalCount; i++) {
    const angle = (360 / petalCount) * i;
    svg += `<g class="petal" style="--a:${angle.toFixed(1)}deg">`;
    svg += `<ellipse cx="50" cy="15" rx="7" ry="16" fill="url(#petal-outer)" opacity="0.9"/>`;
    svg += `</g>`;
  }

  // Camada 2: Pétalas internas (menores, mais claras, offset)
  const innerCount = Math.max(petalCount - 4, 8);
  for (let i = 0; i < innerCount; i++) {
    const angle = (360 / innerCount) * i + (360 / innerCount / 2);
    svg += `<g class="petal" style="--a:${angle.toFixed(1)}deg">`;
    svg += `<ellipse cx="50" cy="22" rx="5" ry="11" fill="url(#petal-inner)" opacity="0.85"/>`;
    svg += `</g>`;
  }

  // Centro orgânico
  svg += `<circle cx="50" cy="50" r="16" fill="url(#center-grad)"/>`;
  svg += `<circle cx="50" cy="50" r="11" fill="#6b4e1f" opacity="0.6"/>`;

  // Sementes em padrão de Fibonacci
  const goldenAngle = 137.508;
  for (let i = 0; i < seedCount; i++) {
    const r = 2.5 + Math.sqrt(i) * 1.8;
    const ang = (i * goldenAngle * Math.PI) / 180;
    const x = 50 + r * Math.cos(ang);
    const y = 50 + r * Math.sin(ang);
    const size = 0.8 + (i % 3) * 0.3;
    svg += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size}" fill="#2a1e0e" opacity="${0.5 + (i % 4) * 0.12}"/>`;
  }

  svg += `</g></svg>`;
  return svg;
}

function injectSunflowers() {
  document.querySelectorAll(".sunflower").forEach((el) => {
    const petals = parseInt(el.dataset.petals, 10) || 12;
    const seeds = parseInt(el.dataset.seeds, 10) || 10;
    const isHero = el.classList.contains("sunflower-hero");
    el.innerHTML = sunflowerSVG(petals, seeds, isHero);
  });
}

/* ---------- Girasol hero: interação com scroll e mouse ---------- */

function initSunflowerInteraction() {
  const heroFloat = document.getElementById("sunflower-float");
  if (!heroFloat) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  // Mouse parallax
  document.addEventListener("mousemove", (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX = ((e.clientX - centerX) / centerX) * 20;
    mouseY = ((e.clientY - centerY) / centerY) * 15;
  });

  // Animação suave (lerp)
  function animate() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;
    heroFloat.style.transform = `translateY(-50%) translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Scroll: rotacionar girasol
  let lastScroll = 0;
  const sunflowerEl = heroFloat.querySelector(".sunflower-hero");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const delta = scrollY - lastScroll;
    lastScroll = scrollY;

    // Rotação baseada na velocidade do scroll
    const rotation = scrollY * 0.08;
    const scale = 1 - Math.min(scrollY / 1200, 0.25);
    const opacity = 1 - Math.min(scrollY / 800, 0.7);

    if (sunflowerEl) {
      sunflowerEl.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      sunflowerEl.style.opacity = opacity;
    }
  }, { passive: true });
}

/* ---------- Inicialização ---------- */

injectSunflowers();

const savedTheme = localStorage.getItem("ju-perfumaria-theme");
const initialDark =
  savedTheme === "dark" ||
  (savedTheme === null &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  location.search.includes("dark");
applyTheme(initialDark);

if (compactMQ.addEventListener) {
  compactMQ.addEventListener("change", renderProducts);
}

populateBrandChips();
renderProducts();
renderArabPerfumes();
renderCart();
initScrollReveal();
initScrollProgress();
initHeaderScroll();
initCardTilt();
initSpotlightCards();
initTextReveal();
initSunflowerInteraction();
initUploadPanel();

// Lenis smooth scroll
const lenis = initLenis();
