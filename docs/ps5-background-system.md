# Documentation - Système de Fond Dynamique PS5

## Vue d'ensemble

Le système de fond dynamique PS5 permet de changer automatiquement l'image de fond de la page lorsque l'utilisateur survole une tuile de projet. Cela crée une expérience immersive similaire à l'interface PlayStation 5.

## Fonctionnalités

✅ **Changement de fond au hover** - L'image de fond change quand on survole une tuile  
✅ **Transitions fluides** - Effet de fondu et de flou pour les transitions  
✅ **Préchargement des images** - Les images sont préchargées pour éviter les délais  
✅ **Gestion des erreurs** - Fallback automatique si une image ne charge pas  
✅ **Performance optimisée** - Timeouts pour éviter les changements trop rapides  
✅ **Effet visuel sur la tuile active** - La tuile qui change le fond est mise en évidence  

## Installation

1. **Inclure le CSS PS5** (déjà fait)
```html
<link rel="stylesheet" href="/css/ps5-projects.css">
```

2. **Inclure le JavaScript**
```html
<script src="/js/ps5-background.js"></script>
```

3. **Structure HTML des tuiles**
```html
<div class="ps5-project-tile" 
     data-project-id="mon-projet" 
     data-background-image="/images/projects/backgrounds/mon-projet-bg.jpg">
    <!-- Contenu de la tuile -->
</div>
```

## Configuration des images

### Attributs HTML

| Attribut | Description | Exemple |
|----------|-------------|---------|
| `data-project-id` | Identifiant unique du projet | `"aspiro-shop"` |
| `data-background-image` | URL de l'image de fond | `"/images/bg/aspiro-bg.jpg"` |

### Structure des fichiers recommandée

```
/images/projects/backgrounds/
├── aspiro-shop-bg.webp       # Image de fond pour Aspiro Shop
├── terra-memoria-bg.webp     # Image de fond pour Terra Memoria
├── nuketown-zombies-bg.webp  # Image de fond pour Nuketown Zombies
└── ...
```

### Spécifications des images

| Propriété | Valeur recommandée |
|-----------|-------------------|
| **Format** | WebP (fallback JPEG) |
| **Résolution** | 1920x1080px ou 2560x1440px |
| **Compression** | WebP 85% ou JPEG 80% |
| **Poids** | < 500KB |
| **Ratio** | 16:9 ou 16:10 |

## Utilisation JavaScript

### Initialisation automatique

```javascript
// Le système s'initialise automatiquement au chargement de la page
// Aucune configuration requise si les attributs HTML sont définis
```

### Configuration manuelle

```javascript
// Créer une instance personnalisée
const bgManager = new PS5BackgroundManager();

// Ajouter des images de fond
bgManager.addProjectBackground('mon-projet', '/images/bg/mon-projet-bg.jpg');

// Supprimer une image de fond
bgManager.removeProjectBackground('mon-projet');
```

### Configuration en lot

```javascript
// Configuration de plusieurs projets
const projectBackgrounds = {
    'aspiro-shop': '/images/bg/aspiro-shop-bg.webp',
    'terra-memoria': '/images/bg/terra-memoria-bg.webp',
    'nuketown-zombies': '/images/bg/nuketown-zombies-bg.webp'
};

Object.entries(projectBackgrounds).forEach(([id, url]) => {
    bgManager.addProjectBackground(id, url);
});
```

## Styles CSS

### Classes CSS automatiques

| Classe | Description |
|--------|-------------|
| `.has-project-bg` | Ajoutée à `.ps5-projects-page` quand un fond est actif |
| `.is-background-active` | Ajoutée à la tuile qui contrôle le fond actuel |

### Personnalisation du fond

```css
/* Personnaliser l'overlay du fond */
.ps5-projects-page.has-project-bg::after {
    background: linear-gradient(
        135deg,
        rgba(10, 14, 19, 0.9) 0%,    /* Plus sombre */
        rgba(15, 20, 25, 0.85) 50%,
        rgba(10, 14, 19, 0.95) 100%
    );
}

/* Personnaliser l'animation du fond */
.ps5-projects-page.has-project-bg {
    animation-duration: 10s; /* Animation plus lente */
}
```

### Personnalisation de la tuile active

```css
/* Style de la tuile qui contrôle le fond */
.ps5-project-tile.is-background-active {
    border-color: rgba(255, 0, 100, 0.8); /* Bordure rose */
    box-shadow: 0 8px 30px rgba(255, 0, 100, 0.4);
}
```

## Performance et optimisation

### Délais configurables

```javascript
// Dans ps5-background.js, vous pouvez ajuster :
setTimeout(() => {
    // Délai avant changement de fond (défaut: 200ms)
}, 200);

setTimeout(() => {
    // Délai avant reset du fond (défaut: 500ms)
}, 500);
```

### Préchargement des images

Le système précharge automatiquement les images au premier hover pour éviter les délais de chargement.

### Gestion des erreurs

```javascript
img.onerror = () => {
    console.warn(`Impossible de charger l'image: ${imageUrl}`);
    // Le fond reste inchangé en cas d'erreur
};
```

## Responsive Design

Le système s'adapte automatiquement aux différentes tailles d'écran :

- **Desktop** : Effet complet avec fond fixe
- **Tablette** : Fond adaptatif avec transitions réduites  
- **Mobile** : Effet simplifié pour préserver les performances

## Debug et troubleshooting

### Messages de console

```javascript
// Vérifier si le système est initialisé
console.log(window.PS5BackgroundManager);

// Vérifier les images de fond configurées
document.querySelectorAll('[data-background-image]').forEach(tile => {
    console.log(tile.dataset.projectId, tile.dataset.backgroundImage);
});
```

### Problèmes courants

| Problème | Solution |
|----------|----------|
| Le fond ne change pas | Vérifier l'attribut `data-background-image` |
| Image ne charge pas | Vérifier l'URL et les permissions du fichier |
| Transitions saccadées | Réduire la taille/poids des images |
| Pas d'effet sur mobile | Normal, effet réduit pour les performances |

## Exemples complets

Voir le fichier `examples/ps5-project-tile-with-background.html` pour un exemple complet d'intégration.

## API JavaScript

### Méthodes publiques

```javascript
const manager = new PS5BackgroundManager();

// Ajouter/modifier une image de fond
manager.addProjectBackground(projectId, imageUrl);

// Supprimer une image de fond
manager.removeProjectBackground(projectId);

// Forcer le reset du fond
manager.resetBackground();

// Changer le fond manuellement
manager.setBackground(imageUrl);
```

### Événements personnalisés

```javascript
// Écouter les changements de fond
document.addEventListener('ps5-background-changed', (event) => {
    console.log('Nouveau fond:', event.detail.imageUrl);
});

document.addEventListener('ps5-background-reset', () => {
    console.log('Fond réinitialisé');
});
```

---

*Cette documentation couvre l'ensemble du système de fond dynamique PS5. Pour toute question supplémentaire, consultez le code source dans `ps5-background.js`.*
