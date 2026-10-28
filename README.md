# Site d’anniversaire

Site statique d’anniversaire construit avec Angular 21.2. Aucun backend, compte utilisateur ou service payant n’est requis.

## Démarrer

```bash
npm install
npm start
```

Puis ouvrir `http://localhost:4200/`.

## Personnaliser

Modifie les valeurs dans `src/app/birthday.config.ts` : prénom, date, fuseau horaire, message, signature, vœu secret et photos. Le prénom et la signature sont déjà personnalisés.

Dépose les médias dans `public/` en respectant ces chemins :

- `public/images/hero/portrait.jpg` : photo d’origine, utilisée pour le compte à rebours et en secours.
- `public/images/hero/portrait-cutout.png` : portrait détouré avec fond transparent pour la révélation.
- `public/images/gallery/01.jpg` et `02.jpg` : photos du ruban.
- `public/images/gallery/03.mp4` à `09.mp4` : vidéos du ruban, muettes, en boucle et recadrées dans les cartes verticales.
- `public/audio/musique.mp3` : musique de la fête, proposée après la révélation. Le navigateur peut demander un clic pour autoriser le son.

Les nouveaux fichiers vidéo ont été renommés `03.mp4` à `09.mp4` et ajoutés à `media` dans `src/app/birthday.config.ts`. Pour ajouter ou retirer des souvenirs, modifie cette liste en conservant les chemins relatifs à `public/`. Le ruban accepte `.mp4`, `.webm` et `.mov`. Les vidéos sont muettes, inline et en boucle. Si le téléphone a activé la réduction des animations, les rubans restent parcourables par balayage horizontal. Les anciens doublons `photo-01.jpeg` et `photo-02.jpeg` sont conservés.

Le micro n'est pas activé pendant la mélodie. Une fois celle-ci terminée, la personne touche « Activer le souffle », autorise le micro et souffle pour éteindre les bougies. Le bouton permet aussi de continuer sans micro si l'autorisation est refusée. La date est réglée à minuit UTC le 30 octobre 2026.

## Build et déploiement statique

```bash
npm run build
```

Le site compilé se trouve dans `dist/birthday-app/browser`. Ce dossier peut être publié sur Netlify, Cloudflare Pages ou GitHub Pages. Pour GitHub Pages à la racine d’un dépôt de site, le chemin de base `/` convient ; pour un dépôt de projet servi sous `/<nom-du-depot>/`, configure `baseHref` dans `angular.json` au moment du build, par exemple `ng build --base-href /nom-du-depot/`.
