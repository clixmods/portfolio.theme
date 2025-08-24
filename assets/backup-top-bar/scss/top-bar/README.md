# Top Bar - Architecture Modulaire

Ce dossier contient les styles SCSS pour la barre de navigation supérieure (top bar) du portfolio, organisés de manière modulaire.

## Structure des fichiers

### 📁 Fichiers principaux
- **`_top-bar.scss`** - Fichier principal qui importe tous les modules
- **`top-bar.scss`** - Point d'entrée pour la compilation (sans underscore)

### 🎨 Modules de styles

#### Variables et configuration
- **`_variables.scss`** - Variables CSS, thèmes et configuration globale

#### Structure de base
- **`_base.scss`** - Styles de base, conteneur principal et boutons génériques

#### Sections de la top bar
- **`_logo.scss`** - Section gauche avec logo et avatar
- **`_actions.scss`** - Section centrale avec les actions principales
- **`_social.scss`** - Boutons de réseaux sociaux
- **`_right-section.scss`** - Section droite (langue, page, horloge, batterie, trophées)

#### Fonctionnalités spéciales
- **`_notifications.scss`** - Système de notifications et toasts
- **Trophées** - Gérés via le système modulaire `/modal/trophies/`

#### Responsive design
- **`_responsive.scss`** - Media queries et adaptations mobiles

## Ordre d'importation

L'ordre d'importation dans `_top-bar.scss` est important :

1. **Variables** - Définit les tokens de design
2. **Base** - Styles fondamentaux 
3. **Sections** - Composants spécifiques (logo, actions, social, right-section)
4. **Fonctionnalités** - Modules spécialisés (notifications)
5. **Responsive** - Adaptations par taille d'écran

## Avantages de cette architecture

✅ **Maintenabilité** - Chaque composant dans son propre fichier
✅ **Réutilisabilité** - Modules indépendants 
✅ **Lisibilité** - Code organisé par fonctionnalité
✅ **Performance** - Un seul fichier CSS généré
✅ **Collaboration** - Facile de travailler sur des sections différentes

## Modifications futures

Pour ajouter de nouveaux composants :
1. Créer un nouveau fichier `_nom-composant.scss`
2. L'importer dans `_top-bar.scss` à la bonne position
3. Respecter les conventions de nommage CSS existantes
