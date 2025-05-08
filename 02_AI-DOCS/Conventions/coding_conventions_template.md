# Coding Conventions and Style Guide

## Overview

This document outlines the coding conventions and style guidelines for the project. Following these conventions ensures consistency, readability, and maintainability across the codebase.

## General Principles

- **Readability First:** Code should be written for humans to read and understand
- **Consistency:** Follow established patterns throughout the codebase
- **Simplicity:** Prefer simple, straightforward solutions over complex ones
- **Documentation:** Document code where necessary, especially non-obvious behavior

## Naming Conventions

### Variables

- Use **camelCase** for variables and function names
- Use descriptive names that indicate purpose
- Avoid abbreviations unless widely understood
- Boolean variables should start with `is`, `has`, `should`, etc.

```javascript
// Good
const userProfile = {};
const isActive = true;
const hasPermission = checkPermissions();

// Bad
const up = {};
const active = true;
const perm = checkPermissions();
```

### Functions

- Use **camelCase** for function names
- Use verbs for function names to indicate actions
- Be specific about what the function does

```javascript
function getUserProfile() { /* ... */ }
function validateInput() { /* ... */ }
function calculateTotal() { /* ... */ }
```

### Classes

- Use **PascalCase** for class names
- Use nouns for class names

```javascript
class UserProfile { /* ... */ }
class PaymentProcessor { /* ... */ }
class AuthenticationService { /* ... */ }
```

### Constants

- Use **UPPER_SNAKE_CASE** for constants

```javascript
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
```

### Files and Directories

- Use **kebab-case** for file and directory names
- Group related files in directories

```
components/
  user-profile/
    user-profile.component.js
    user-profile.styles.js
    user-profile.test.js
```

## Code Formatting

- Use 2 spaces for indentation
- Maximum line length: 80 characters
- Use semicolons at the end of statements
- Use single quotes for strings
- Always use curly braces for control structures, even for single-line blocks

```javascript
// Good
if (condition) {
  doSomething();
}

// Bad
if (condition) doSomething();
```

## Comments

- Use JSDoc comments for functions and classes
- Add comments for complex logic or non-obvious behavior
- Keep comments up-to-date with code changes

```javascript
/**
 * Calculates the total price including tax
 * @param {number} price - The base price
 * @param {number} taxRate - The tax rate as a decimal
 * @returns {number} The total price including tax
 */
function calculateTotalPrice(price, taxRate) {
  // Handle edge cases
  if (price < 0) {
    throw new Error('Price cannot be negative');
  }
  
  return price * (1 + taxRate);
}
```

## Component Structure (React/Next.js)

- One component per file
- Follow this order for component methods:
  1. Constructor
  2. Lifecycle methods
  3. Event handlers
  4. Render helpers
  5. Render method

```jsx
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { /* ... */ };
  }
  
  componentDidMount() {
    // ...
  }
  
  handleSubmit = () => {
    // ...
  }
  
  renderForm() {
    // ...
  }
  
  render() {
    return (
      // ...
    );
  }
}
```

## State Management

- Keep state as local as possible
- Use context or state management libraries for shared state
- Document the shape of state objects

## Error Handling

- Use try/catch blocks for error-prone operations
- Provide meaningful error messages
- Log errors with appropriate context

```javascript
try {
  const data = await fetchUserData(userId);
  processUserData(data);
} catch (error) {
  logger.error(`Failed to fetch user data for ${userId}`, error);
  showErrorNotification('Could not load user data. Please try again.');
}
```

## Testing

- Write tests for all new features
- Follow the AAA pattern (Arrange, Act, Assert)
- Test both success and failure cases

```javascript
describe('calculateTotalPrice', () => {
  it('should calculate the correct total with tax', () => {
    // Arrange
    const price = 100;
    const taxRate = 0.1;
    
    // Act
    const result = calculateTotalPrice(price, taxRate);
    
    // Assert
    expect(result).toBe(110);
  });
  
  it('should throw an error for negative prices', () => {
    expect(() => calculateTotalPrice(-10, 0.1)).toThrow();
  });
});
```

## Performance Considerations

- Memoize expensive calculations
- Use pagination for large data sets
- Optimize renders in React components

## Accessibility

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast

## Principes de Design et d'Expérience Utilisateur (UX/UI)

L'objectif est de créer des interfaces utilisateur (UI) et des expériences utilisateur (UX) qui rivalisent avec les meilleures startups (ex: standard Y Combinator), en mettant l'accent sur la modernité, l'élégance, l'intuitivité et une esthétique "pixel-perfect".

### Philosophie de Design
- **Modernité et Élégance :** Viser des designs épurés, contemporains et visuellement attrayants.
- **Simplicité Intuitive :** Les interfaces doivent être faciles à comprendre et à utiliser, même pour un nouvel utilisateur.
- **Cohérence :** Maintenir une cohérence visuelle et fonctionnelle à travers toute l'application.
- **Feedback Utilisateur :** Fournir des retours clairs et immédiats aux actions de l'utilisateur.
- **Performance Perçue :** Optimiser pour que l'application semble rapide et réactive.

### Système de Design (Design System)
- **Utilisation de Tailwind CSS :**
    - Suivre une configuration Tailwind CSS centralisée ([`tailwind.config.js`](tailwind.config.js:1) à créer/modifier si besoin) pour définir la palette de couleurs, la typographie, les points de rupture, etc.
    - Privilégier la composition des classes utilitaires de Tailwind pour créer des composants réutilisables.
    - Éviter les styles CSS personnalisés excessifs ; s'appuyer autant que possible sur les capacités de Tailwind.
- **Bibliothèque de Composants UI (Optionnel mais recommandé) :**
    - Envisager l'utilisation d'une bibliothèque de composants headless (ex: Headless UI, Radix UI) ou d'une bibliothèque de composants stylée (ex: Shadcn/UI, Material UI, Ant Design) pour accélérer le développement et assurer la cohérence.
    - Si une bibliothèque est choisie, définir des conventions pour sa customisation et son extension.
- **Palette de Couleurs :** Définir et utiliser de manière cohérente :
    - Couleurs primaires et secondaires.
    - Couleurs neutres (gris, blancs, noirs).
    - Couleurs d'accentuation.
    - Couleurs sémantiques pour les états (succès, erreur, avertissement, information).
- **Typographie :**
    - Définir une hiérarchie typographique claire (polices, tailles, graisses, hauteurs de ligne) pour les titres, sous-titres, corps de texte, labels, etc.
    - Assurer une lisibilité optimale sur tous les appareils.
- **Espacement et Grille (Layout) :**
    - Adopter un système d'espacement cohérent (ex: basé sur une échelle de 4px ou 8px).
    - Utiliser des grilles (CSS Grid, Flexbox) pour structurer les mises en page et assurer l'alignement.
- **Iconographie :**
    - Choisir un style d'icônes cohérent (ex: Heroicons, Feather Icons).
    - Utiliser des SVGs pour la netteté et la scalabilité.
- **Micro-interactions et Animations :**
    - Utiliser des animations et transitions subtiles pour améliorer l'UX (ex: feedback sur un clic, transitions d'état douces).
    - Éviter les animations excessives ou distrayantes. Celles-ci doivent avoir un but.
- **Responsive Design :**
    - Adopter une approche "Mobile-first" ou "Desktop-first" de manière cohérente.
    - Tester sur une variété de tailles d'écran et d'appareils.
- **Gestion des États :**
    - Concevoir des états clairs pour les éléments interactifs (hover, focus, active, disabled).
    - Prévoir des états pour le chargement de données, les listes vides, et les erreurs.

### Accessibilité (Approfondissement)
En plus des points de la section "Accessibilité" :
- **Navigation au clavier complète :** Tous les éléments interactifs doivent être accessibles et utilisables via le clavier.
- **Contraste élevé par défaut :** Viser des contrastes supérieurs aux minima WCAG AA lorsque possible, pour un confort visuel accru.
- **Textes alternatifs pour les images :** Descriptifs et pertinents.
- **Structure sémantique rigoureuse :** Utiliser les balises HTML appropriées pour leur sens.

### Outils et Processus
- **Maquettes (si disponibles) :** Si des maquettes Figma (ou autre) sont fournies, s'efforcer de les respecter fidèlement.
- **Itération :** Le design est un processus itératif. Être ouvert aux retours et aux améliorations continues.

## Security Best Practices
 
- Sanitize user inputs
- Use parameterized queries for database operations
- Implement proper authentication and authorization checks
- Follow the principle of least privilege

## Git Workflow

- Use descriptive branch names (feature/user-authentication, bugfix/login-error)
- Write meaningful commit messages
- Keep commits focused on a single change
- Squash commits before merging

## Code Review Checklist

- Does the code follow the conventions in this document?
- Is the code well-tested?
- Are there any security concerns?
- Is the code efficient and performant?
- **Le design et l'UX/UI sont-ils conformes aux principes définis (modernité, intuitivité, cohérence, esthétique) ?**
- **L'implémentation Tailwind CSS est-elle propre et cohérente ?**
- **Les composants sont-ils responsives et s'affichent-ils correctement sur différentes tailles d'écran ?**
- **Les interactions et animations sont-elles fluides et apportent-elles une valeur ajoutée ?**
- Is the code accessible? (Vérifier les points spécifiques de la section UX/UI et Accessibilité)
- Is the documentation sufficient?
 
---
 
*This document should be reviewed and updated regularly as the project evolves.*
