# ia-describe

`ia-describe` est une application web permettant d'obtenir une description textuelle et vocale d'une image en utilisant l'API Gemini de Google. L'interface a été conçue pour rester accessible aux personnes malvoyantes et non voyantes.

## Prérequis

- **Node.js** version 18 ou plus. Si vous ne l'avez pas, téléchargez l'installateur sur [nodejs.org](https://nodejs.org/).
- Une clé d'API Gemini. Vous pouvez en générer une depuis le [site Google AI Studio](https://aistudio.google.com/app/apikey) après connexion avec votre compte Google.

## Installation pas à pas

1. Téléchargez ou clonez ce dépôt sur votre ordinateur puis ouvrez un terminal dans le dossier `ia-describe`.
2. Installez les dépendances du projet :
   ```bash
   npm install
   ```
3. Copiez le fichier `.env.example` sous le nom `.env` et renseignez votre clé d'API Gemini à la place de `your-gemini-api-key` :
   ```bash
   cp .env.example .env
   # éditez ensuite le fichier .env pour y coller la clé
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
   L'adresse locale (généralement `http://localhost:5173`) s'affichera dans le terminal.
5. Ouvrez cette adresse dans votre navigateur pour accéder à l'application.

## Utilisation de l'application

- Cliquez sur "Sélectionner une image" ou glissez simplement une image (JPEG, PNG, GIF ou WebP de moins de 10 Mo) dans la zone prévue.
- Patientez pendant l'analyse. La description apparaîtra sous forme de texte et sera lue automatiquement si la synthèse vocale de votre navigateur est disponible.
- `Ctrl+H` affiche ou masque l'historique des descriptions. `Ctrl+S` ouvre les paramètres de voix. Appuyez sur `Échap` pour interrompre la lecture.
- Dans le panneau "Paramètres", vous pouvez choisir la voix, la vitesse et le volume de la lecture.
- Vous pouvez également sélectionner le niveau de détail souhaité pour la description : rapide, moyenne ou détaillée.

## Construire une version de production

Pour générer les fichiers optimisés de l'application :
```bash
npm run build
```
Les fichiers seront placés dans le dossier `dist`. Vous pouvez les prévisualiser avec :
```bash
npm run preview
```

## Ressources utiles

- [Documentation de Vite](https://vitejs.dev/)
- [Présentation de l'API Gemini](https://aistudio.google.com/app/apikey)
