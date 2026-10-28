/** Modifie ces valeurs et ajoute tes médias dans public/ pour personnaliser le site. */
export const BIRTHDAY = {
  name: 'Alexandra',
  dateLabel: '30 octobre 2026',
  // Le grand jour commence à minuit UTC.
  celebrationAt: '2026-10-30T00:00:00+00:00',
  signature: 'ton jumeau',
  shortMessage: 'Aujourd’hui, le monde célèbre la belle personne que tu es. Que cette journée soit aussi lumineuse que ton sourire.',
  letter: 'En ce jour spécial, je te souhaite beaucoup de bonheur, une santé précieuse, de belles réussites et des raisons de sourire chaque jour. Que cette nouvelle année de ta vie t’apporte de belles surprises, de nouvelles opportunités et des moments inoubliables. Profite pleinement de cette journée qui est la tienne. Joyeux anniversaire !',
  secret: 'Le plus beau cadeau, c’est de te connaître. Garde cette petite étincelle avec toi, aujourd’hui et tous les jours.',
  /** PNG détouré à déposer ici quand il sera prêt ; la photo d'origine reste le secours. */
  cutout: 'images/hero/portrait-cutout.png',
  /** Photo d'origine, affichée dans la boîte tant que le détourage n'existe pas. */
  heroImage: 'images/hero/portrait.jpg',
  /** Active les liens de test ?preview=jour et ?preview=avant. Mets false avant de publier. */
  allowPreview: false,
  /** Chemin de ta musique, ex. 'audio/musique.mp3' (laisse vide pour aucune musique). */
  music: 'audio/musique.mp3',
  /** Un souhait caché dans chaque ballon. */
  wishes: ['Santé et énergie', 'Des rires chaque jour', 'Des projets qui se réalisent', 'De belles rencontres', 'De la sérénité', 'Plein d’amour'],
  /** Photos et vidéos du ruban ; les vidéos MP4 sont muettes et en boucle. */
  media: [
    'images/gallery/01.jpg',
    'images/gallery/02.mp4',
    'images/gallery/03.mp4',
    'images/gallery/04.mp4',
    'images/gallery/05.mp4',
    'images/gallery/06.jpg',
    'images/gallery/07.mp4',
    'images/gallery/08.mp4',
    'images/gallery/09.mp4',
    'images/gallery/10.jpg',
  ],
} as const;
