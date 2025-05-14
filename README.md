# Calculateur de score de lisibilité

Ce dépôt contient le code d’une application web qui calcule le score de lisibilité d’un texte selon l’algorithme [Flesch-Kincaid](https://fr.wikipedia.org/wiki/Tests_de_lisibilit%C3%A9_Flesch-Kincaid).

## 🛠️ Technologies utilisées

- **HTML / CSS**

    Langages de base pour structurer (HTML) et styliser (CSS) les pages web.

    📚 [Documentation HTML](https://developer.mozilla.org/fr/docs/Web/HTML) / [Documentation CSS](https://developer.mozilla.org/fr/docs/Web/CSS)

- **JavaScript**

    Langage de programmation qui permet de rendre les pages web interactives. Il est utilisé ici pour manipuler le texte, effectuer les calculs de lisibilité et contrôler les composants Vue.

    📚 [Documentation JavaScript (MDN)](https://developer.mozilla.org/fr/docs/Web/JavaScript)

- **Vue.js**

    Framework JavaScript progressif permettant de construire des interfaces utilisateur réactives à l’aide de composants.

    📚 [Documentation Vue.js](https://vuejs.org/guide/introduction.html)

- **Nuxt**

    Framework basé sur Vue.js qui facilite la création d’applications web modernes, optimisées pour le référencement, avec rendu côté serveur (SSR) ou génération statique.

    📚 [Documentation Nuxt](https://nuxt.com/docs/getting-started/introduction)

- **PrimeVue**

    Bibliothèque de composants UI basée sur Vue.js, qui propose des éléments préconçus (boutons, champs texte, cartes, etc.) avec un design professionnel et personnalisable.

    📚 [Documentation PrimeVue](https://primevue.org/)

## Structure du projet

```
flesch-kincaid/
├── .nuxt/                  # Fichiers générés par Nuxt (compilation)
├── .output/                # Fichiers de sortie (build)
├── assets/
│   └── css/
│       └── tailwind.css    # Feuille de style personnalisée avec Tailwind CSS
├── components/
│   ├── AppConfig.vue       # Composant de configuration globale (thème)
│   ├── AppFooter.vue       # Pied de page de l'application
│   └── AppTopbar.vue       # Barre de navigation supérieure
├── composables/
│   └── use-layout.js       # Composable pour la gestion de du thèmes
├── node_modules/           # Dépendances installées (gérées par npm/pnpm)
├── public/
│   ├── data/
│   │   └── Lexique383.tsv  # Fichier TSV contenant des données lexicales
│   └── favicon.ico         # Icône du site
├── utils/
│   ├── countSentences.js   # Fonction pour compter les phrases
│   ├── countSyllabes.js    # Fonction pour compter les syllabes
│   ├── countWords.js       # Fonction pour compter les mots
│   └── getLexique.js       # Fonction pour lire le fichier lexical
├── .gitignore              # Fichiers/dossiers à ignorer par Git
├── .npmrc                  # Configuration npm/pnpm
├── app.vue                 # Composant racine de l'application Nuxt
├── nuxt.config.ts          # Fichier de configuration principal de Nuxt
├── package.json            # Définition des dépendances et scripts du projet
├── package-lock.json       # Verrouillage des versions des dépendances (npm)
├── pnpm-lock.yaml          # Verrouillage des versions (pnpm)
├── README.md               # Fichier de documentation du projet
└── tsconfig.json           # Configuration TypeScript
```

La partie "Algorithmique" du projet (chose étudiée pour le TIB) se trouve dans les fichiers JavaScript du dossier `utils` et est utilisée dans la section `script` du fichier `app.vue`.

## Version console

Une version console du projet est également disponible dans le dépôt : [flesch-kincaid-readability-console](https://github.com/0x000EDGE/flesch-kincaid-readability-console)
