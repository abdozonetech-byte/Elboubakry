# Rapport Pre-Launch Cleanup 01

## Objectif
Nettoyage structurel sécurisé du projet avant lancement, sans modifier le design validé, l’expérience utilisateur, les animations, les sections, le carousel, le popup, les pages Insights ou les Case Studies.

## Version officielle conservée
La version officielle de production reste :

```txt
/light/
```

Aucun fichier du site actif dans `/light/` n’a été supprimé volontairement dans cette étape.

## Éléments supprimés du ZIP propre

### 1. Dossier dupliqué
Le dossier suivant a été retiré de la version nettoyée :

```txt
Flixta HTML/
```

Raison : il contenait une ancienne/dupliquée version publique du site. Le garder dans un projet publié peut créer de la confusion, du contenu dupliqué et des chemins publics inutiles.

### 2. Fichier corrompu/vide
Le fichier vide avec un nom encodé/corrompu a été retiré :

```txt
À / +Ç / \303\200
```

Raison : fichier vide, non utile au site, probablement créé par un problème d’encodage.

### 3. Dépendances de développement
Le dossier suivant a été retiré du ZIP propre :

```txt
node_modules/
```

Raison : il ne doit pas être inclus dans un ZIP de production. Les dépendances peuvent être réinstallées avec `npm install` si nécessaire.

### 4. Métadonnées Git
Le dossier suivant a été retiré du ZIP propre :

```txt
.git/
```

Raison : il ne doit pas être inclus dans une archive de production ou de partage. Le dépôt Git local peut rester sur la machine de développement.

## .gitignore
Le fichier `.gitignore` a été normalisé pour éviter d’ajouter par erreur :

```txt
node_modules/
.git/
*.zip
.DS_Store
Thumbs.db
.env
.env.local
```

## Sitemap et robots
Aucun changement visuel n’a été appliqué. Le sitemap et robots.txt restent présents à la racine du projet. Le dossier supprimé `Flixta HTML/` n’est pas nécessaire à la version officielle `/light/`.

## UI / UX / Animations
Aucun redesign n’a été effectué.

Conservé :
- Hero section
- Photo validée
- Sections principales
- Carousel Réalisations
- Popup/lightbox
- FAQ
- Consultation/contact
- Pages Insights
- Pages Case Studies
- Animations existantes

## Points encore à traiter plus tard

1. Vérifier le fonctionnement réel du formulaire selon l’hébergement choisi. Si le site reste sur GitHub Pages, PHP ne sera pas exécuté.
2. Optimiser les grandes images avant lancement final pour améliorer la vitesse mobile.
3. Remplacer les placeholders GA4/Search Console/Bing quand les vrais codes seront disponibles.
4. Remplacer les URLs GitHub Pages par le domaine final après connexion du domaine.
5. Faire un test navigateur/mobile après push pour confirmer que le carousel, le popup et les animations restent corrects.

## Conclusion
Le projet est plus propre pour un lancement : les doublons publics, les fichiers corrompus et les dossiers de développement ont été retirés de l’archive propre, tout en gardant la version officielle `/light/` intacte.

## Nettoyage complémentaire

Le dossier vide de configuration locale suivant a aussi été retiré de l’archive propre :

```txt
.agents/
```

Raison : dossier vide/non nécessaire au fonctionnement public du site.
