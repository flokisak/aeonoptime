# Route Optimizer PWA

Mobilní Progressive Web App pro optimalizaci doručovacích tras pomocí Google Maps.

## 🚀 Rychlý Start

### Lokální Spuštění
```bash
npm install
npm run serve
```
Otevřete http://localhost:8000

### Vercel Deployment
1. Pushněte kód na GitHub
2. Připojte repozitář na [Vercel](https://vercel.com)
3. Automaticky se deployne

## 📱 Funkce

- 🗺️ **Google Maps integrace** - plná funkčnost s Google Maps API
- 📝 **Hromadné zadávání** - vložte text ze SMS s více adresami
- 🎯 **Automatické rozpoznání** - české adresy a ulice
- 🚀 **Optimalizace trasy** - nejefektivnější pořadí zastávek
- 🧭 **Navigace** - spuštění Google Maps navigace
- 📲 **PWA** - instalovatelná jako mobilní aplikace
- 💾 **Offline podpora** - funguje i bez připojení

## 🛠️ Technologie

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Mapy**: Google Maps API (Places, Directions, Geocoding)
- **PWA**: Service Worker, Web App Manifest
- **Deployment**: Vercel (static hosting)

## 📋 Použití

1. **Přidání zastávek**:
   - Ručně: zadejte adresu → "Přidat Zastávku"
   - Hromadně: "Hromadný Text/SMS" → vložte text → "Zpracovat a Přidat"

2. **Optimalizace**:
   - Klikněte "Optimalizovat Trasu"
   - Aplikace vypočítá nejlepší pořadí

3. **Navigace**:
   - Klikněte "Spustit Navigaci"
   - Otevře se Google Maps s optimalizovanou trasou

## 🔧 Konfigurace

Google Maps API klíč je již integrován. Pro změnu:
- Upravte `index.html` řádek s Google Maps API URL
- Nahraďte `AIzaSyDOx_mQYLBwGMQu-OIxPeT8Lbh3D3WdsFQ` vaším klíčem

## 🌐 Deployment

### Vercel (doporučeno)
```bash
# Push na GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Jiné platformy
Jakýkoliv static hosting funguje (Netlify, GitHub Pages, atd.)

## 📱 PWA Instalace

1. Otevřete aplikaci v mobilním prohlížeči
2. Klikněte "Přidat na domovskou obrazovku"
3. Aplikace se nainstaluje jako nativní app

## 🔒 Bezpečnost

- API klíč je omezen na doménu deploymentu
- Žádné osobní údaje nejsou ukládány na server
- Vše funguje lokálně v prohlížeči

## 📄 Licence

MIT License - volné komerční i nekomerční použití