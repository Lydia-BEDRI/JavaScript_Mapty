# Mapty: Application de Suivi d'Entraînement

Cette application permet aux utilisateurs de suivre leurs séances d'entraînement, à la fois en course à pied et en cyclisme, et de les visualiser sur une carte.

## Fonctionnalités

- **Vue Carte :** Affiche les séances d'entraînement de l'utilisateur sur une carte en utilisant Leaflet.js et OpenStreetMap.
- **Enregistrement des Entraînements :** Les utilisateurs peuvent enregistrer des séances d'entraînement en course à pied et en cyclisme avec des détails tels que la distance, la durée et des métriques spécifiques (cadence pour la course, gain d'élévation pour le cyclisme).
- **Persistance des Données :** Les séances d'entraînement sont stockées localement en utilisant localStorage, assurant que les données sont conservées entre les sessions.
- **Design Responsive :** L'application est conçue pour fonctionner de manière fluide sur les appareils de bureau et mobiles.

## Technologies Utilisées

- **HTML, CSS, JavaScript :** Développement Frontend.
- **Leaflet.js :** Cartes interactives.
- **OpenStreetMap :** Tuiles de carte.
- **localStorage :** Stockage dans le navigateur pour la persistance des données des séances d'entraînement.

## Comment Utiliser

1. **Enregistrer un Entraînement :**
   - Cliquez sur la carte pour ajouter un nouvel entraînement.
   - Remplissez le formulaire avec les détails de l'entraînement (type, distance, durée et métriques supplémentaires).
   - Soumettez le formulaire pour enregistrer l'entraînement. Il apparaîtra à la fois sur la carte et dans la liste des séances d'entraînement.

2. **Visualisation des Entraînements :**
   - Cliquez sur un entraînement dans la liste pour zoomer sur son emplacement sur la carte.
   - Les détails de l'entraînement incluent des icônes et des unités spécifiques au type d'entraînement (course à pied ou cyclisme).

3. **Réinitialisation des Données :**
   - Pour effacer tous les entraînements enregistrés, utilisez le bouton "Réinitialiser". Cette action efface localStorage et rafraîchit la page.

## Développement

- Clonez le dépôt.
- Ouvrez `index.html` dans votre navigateur ou servez-le avec un serveur local.
- Commencez à enregistrer vos entraînements !

## Crédits

- Icônes de [EmojiOne](https://emojione.com).
- Tuiles de carte par [OpenStreetMap](https://www.openstreetmap.org).

## Auteur

- [Lydia BEDRI]
