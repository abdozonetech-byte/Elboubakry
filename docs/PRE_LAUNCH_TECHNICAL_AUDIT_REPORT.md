# Rapport d'audit technique pre-lancement

Date : 10 juin 2026  
Site : portfolio francophone d'Elboubakry Abdessamad  
Objectif : stabiliser le projet avant lancement sans modifier l'UI, l'UX, les animations, la direction artistique, les sections approuvees ni la strategie French-only.

## 1. Problemes trouves

- Le fichier racine `index.html` n'avait pas de balise canonique explicite.
- Les manifests PWA declaraient deux icones pointees vers la meme image 76x76, alors que des icones 192x192 et 512x512 existent.
- Plusieurs images non critiques n'avaient pas d'indication `loading="lazy"` ou `decoding="async"`.
- Des images decoratives avaient un texte alternatif visible pour les lecteurs d'ecran alors qu'elles ne portent pas d'information utile.
- Le bouton de fermeture du menu mobile n'avait pas d'attribut `aria-label` explicite.
- La zone de messages du formulaire n'etait pas annoncee de facon fiable aux technologies d'assistance.
- Quelques messages techniques du formulaire etaient encore en anglais ou peu adaptes au site francophone.
- La QA navigateur a detecte que le carousel des realisations pouvait se deplacer au drag, mais qu'un clic physique sur un mockup pouvait etre absorbe par la capture precoce du pointeur du rail.
- Le formulaire principal envoie vers `light/assets/mailer.php`, ce qui ne fonctionnera pas sur GitHub Pages car PHP n'y est pas execute.
- Le dossier `Flixta HTML/` contient une ancienne copie exportee du site avec des pages, un sitemap et un robots dupliques.
- Un fichier vide et etrange nomme `À` existe a la racine du projet.
- `node_modules/` est present dans l'espace de travail. Il est ignore par Git, mais ne doit pas etre inclus dans un upload statique manuel.
- Les balises de verification Google Search Console et Bing sont encore des placeholders.
- Les URLs publiques de `robots.txt`, `sitemap.xml`, canonicals et Open Graph pointent vers l'URL GitHub Pages actuelle. Elles devront etre remplacees si un domaine final different est choisi.

## 2. Problemes corriges

- Ajout d'une canonical stable sur le `index.html` racine.
- Correction des manifests PWA pour declarer les vraies icones `android-chrome-192x192.png` et `android-chrome-512x512.png`.
- Ajout de `loading="lazy"` sur les images non critiques sous la ligne de flottaison, notamment dans le processus et le carousel des realisations.
- Ajout de `decoding="async"` sur les images appropriees, sans lazy-loader l'image hero.
- Correction de textes alternatifs decoratifs en `alt=""` avec `aria-hidden="true"`.
- Ajout d'un `aria-label` au bouton de fermeture du menu mobile.
- Ajout de `aria-live="polite"` a la zone de retour du formulaire.
- Francisation des messages de fallback du formulaire AJAX et des reponses PHP.
- Correction minimale du carousel des realisations : la capture du pointeur commence uniquement quand un vrai glissement est detecte, ce qui preserve le controle souris/tactile et restaure le clic d'ouverture de la lightbox.
- Verification des liens internes, assets, JSON-LD, sitemap et robots apres correction.

## 3. Fichiers changes

- `index.html`
- `site.webmanifest`
- `light/assets/images/site.webmanifest`
- `light/index-resume-one-page.html`
- `light/insights.html`
- `light/insights/*.html` concernes par le preloader logo
- `light/assets/js/elboubakry-mockup-carousel.js`
- `light/assets/js/main.js`
- `light/assets/js/vendor/ajax-form.js`
- `light/assets/mailer.php`
- `docs/PRE_LAUNCH_TECHNICAL_AUDIT_REPORT.md`

## 4. Constats securite

- Aucun secret, token, mot de passe ou cle API exploitable n'a ete detecte dans les fichiers publics audites.
- Aucun script externe inconnu n'a ete detecte dans les pages HTML publiques.
- Aucun iframe cache ou redirection suspecte propre au site n'a ete detecte.
- Les occurrences de motifs sensibles dans les fichiers vendor/minifies correspondent a des bibliotheques front-end attendues, pas a un code malveillant identifie.
- Le module analytics utilise un identifiant placeholder `G-XXXXXXXXXX` et ne charge pas Google Analytics tant qu'un vrai identifiant n'est pas configure.
- Le formulaire PHP utilise une variable d'environnement `CONTACT_EMAIL`. Cette approche evite de publier l'adresse de reception dans le code, mais necessite un hebergement compatible PHP.

## 5. Constats SEO

- 37 pages HTML publiques ont ete auditees, hors ancienne copie `Flixta HTML/`, `.git` et `node_modules/`.
- Les pages publiques de contenu auditees ont un titre, une meta description et une canonical. La racine `index.html` est une page de redirection et n'a pas de H1 visible, ce qui est acceptable pour ce role.
- Aucun JSON-LD invalide n'a ete detecte apres verification.
- Aucun lien interne ou asset casse n'a ete detecte dans les pages publiques auditees.
- Le sitemap contient 36 URLs publiques, toutes presentes dans le projet.
- `robots.txt` pointe vers le sitemap GitHub Pages actuel.
- Aucune page publique auditee n'est accidentellement en `noindex`.
- Les URLs finales devront etre revues si le domaine de production n'est pas `https://abdozonetech-byte.github.io/Elboubakry/`.

## 6. Constats performance

- Les images hero n'ont pas ete lazy-loadees afin de preserver le rendu initial.
- Les images non critiques sous la ligne de flottaison ont recu `loading="lazy"` lorsque c'etait sans risque visuel.
- Des hints `decoding="async"` ont ete ajoutes pour reduire le blocage du rendu.
- Aucun CSS ou JavaScript n'a ete supprime, car cela aurait pu casser les animations, le carousel, la lightbox ou les pages Insights.
- Les doublons eventuels de bibliotheques dans l'ancien export `Flixta HTML/` n'ont pas ete traites automatiquement car ce dossier demande une decision de nettoyage.

## 7. Statut du formulaire

- Le formulaire principal conserve son UI, ses champs et son comportement front-end.
- L'action actuelle pointe vers `assets/mailer.php`.
- Sur GitHub Pages, le fichier PHP ne s'executera pas : le formulaire ne pourra pas envoyer d'email depuis cet hebergement.
- Sur un hebergement compatible PHP, il faut configurer la variable d'environnement `CONTACT_EMAIL`.
- La verification syntaxique PHP n'a pas pu etre executee localement car la commande `php` n'est pas installee dans l'environnement.
- Les evenements analytics du formulaire ne transmettent pas les champs personnels ; ils suivent uniquement le type d'evenement, le nom du formulaire et son emplacement.

## 8. Elements qui demandent approbation avant correction

- Supprimer ou archiver le dossier `Flixta HTML/`, car il semble etre une ancienne copie complete du site.
- Supprimer le fichier vide `À` a la racine du projet.
- Decider si les anciens rapports racine doivent rester publics ou etre deplaces dans `docs/`.
- Remplacer toutes les URLs GitHub Pages par le domaine final si un domaine personnalise est utilise.
- Ajouter les vrais codes de verification Google Search Console et Bing.
- Activer ou non Google Analytics avec un vrai identifiant, en tenant compte du consentement et de la politique de confidentialite.
- Remplacer le formulaire PHP par une solution compatible GitHub Pages, par exemple Formspree, Netlify Forms, Basin, un endpoint serverless ou un lien mail/WhatsApp, sans modifier l'UI.

## 9. Checklist finale de lancement

- Fait : homepage chargee en desktop et mobile via navigateur headless.
- Fait : hero visible, un seul H1 sur la homepage.
- Fait : pas d'erreur console detectee pendant la QA navigateur.
- Fait : pas d'image cassee detectee pendant la QA navigateur.
- Fait : pas d'overflow horizontal detecte en desktop ni en mobile 390px.
- Fait : carousel des realisations controle par autoplay et par drag souris/tactile.
- Fait : lightbox du carousel des realisations ouverte et fermee avec succes.
- Fait : lightbox du systeme/processus ouverte avec succes.
- Fait : attribut `rs-theme` teste en mode clair puis mode sombre.
- Fait : liens internes, assets, JSON-LD, sitemap et robots valides par audit local.
- A faire au lancement : valider `sitemap.xml` et `robots.txt` apres choix du domaine final.
- A faire au lancement : valider les donnees structurees dans l'outil Google Rich Results.
- A faire au lancement : tester le formulaire sur l'hebergement final, pas seulement en local.
- A faire au lancement : configurer `CONTACT_EMAIL` si un hebergement PHP est retenu.
- A faire au lancement : ne pas deployer `node_modules/`, `.git`, les anciens exports ou les rapports internes si l'upload est manuel.
