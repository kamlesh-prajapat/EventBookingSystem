# UI/UX Design Guide - Event Booking System v2.2

## 🎨 Modern Responsive Design with Theme Support

This document explains the new responsive UI system, theme management, and design patterns implemented in the Event Booking System frontend.

---

## 📋 Table of Contents

1. [Theme System](#theme-system)
2. [Responsive Design](#responsive-design)
3. [Component Architecture](#component-architecture)
4. [Color Palette](#color-palette)
5. [Typography](#typography)
6. [Spacing & Sizing](#spacing--sizing)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)
9. [Customization Guide](#customization-guide)

---

## 🎭 Theme System

### Overview

The application supports **Light Mode** and **Dark Mode** themes that automatically persist across sessions.

### How It Works

#### ThemeContext.jsx
```javascript
// Automatically detects system preference and saves to localStorage
const theme = localStorage.getItem('app-theme') || 'light'

// Toggle theme function
const toggleTheme = () => setTheme(prevTheme => 
  prevTheme === 'light' ? 'dark' : 'light'
)
```

#### CSS Variables
Each theme is defined using CSS custom properties in `index.css`:

**Light Mode** (`data-theme="light"`):
```css
--color-background: #FAFAFA
--color-surface: #FFFFFF
--color-text: #212121
--color-primary: #2196F3
```

**Dark Mode** (`data-theme="dark"`):
```css
--color-background: #121212
--color-surface: #1E1E1E
--color-text: #FFFFFF
--color-primary: #64B5F6
```

### Using useTheme Hook

```javascript
import { useTheme } from '../context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  )
}
```

### Theme Persistence

- Automatically saves to `localStorage['app-theme']`
- Persists across browser sessions
- Detects system preference on first visit
- Updates `data-theme` attribute on `<html>` element

---

## 📱 Responsive Design

### Breakpoints

| Device | Width | Usage |
|--------|-------|-------|
| Mobile | < 480px | Small phones |
| Tablet | 480px - 768px | Small tablets |
| Laptop | 768px - 1280px | Desktops & large tablets |
| Large | > 1280px | Large monitors |

### Mobile-First Approach

All styles are designed for mobile first, then enhanced with `@media` queries for larger screens.

```css
/* Mobile (default) */
.container {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### Grid System

#### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Mobile */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

#### Usage
```jsx
<div className="grid">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>
```

### Flexible Navigation

**Desktop** (Navbar shows all items inline):
```
[Logo] [Home] [Bookings] [Dashboard] [Create] [Manage] [Theme] [Logout]
```

**Mobile** (Hamburger menu):
```
[Logo] [☰ Menu]
```

---

## 🏗️ Component Architecture

### Navbar Component

**Features**:
- Responsive hamburger menu (< 768px)
- Theme toggle button
- Role-aware admin menu
- Smooth animations

**Files**:
- `components/Navbar.jsx` - Component logic
- `components/Navbar.css` - Responsive styling

**Usage**:
```jsx
<Navbar />
```

### Event Card Component

**Features**:
- Hover effects with 3D transform
- Availability status badge (color-coded)
- Responsive grid layout
- Smooth animations

**Files**:
- `pages/Home.jsx` - Event card rendering
- `pages/Pages.css` - Card styling

**Responsive Grid**:
```css
.events-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

/* Mobile: 1 column */
@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
```

### Form Components

**Features**:
- Clear labels and placeholders
- Focus states with visual feedback
- Error messages with icons
- Mobile-optimized input sizing (16px to prevent zoom)

**Example**:
```jsx
<div className="form-group">
  <label className="form-label">📧 Email</label>
  <input 
    type="email" 
    className="form-input"
    placeholder="Enter your email"
  />
</div>
```

### Loading States

**Spinner Animation**:
```jsx
<div className="spinner"></div>
```

**Usage**:
```jsx
{loading && (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
)}
```

---

## 🎨 Color Palette

### Light Mode

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Blue | #2196F3 |
| Secondary | Orange | #FF9800 |
| Success | Green | #4CAF50 |
| Warning | Yellow | #FFC107 |
| Error | Red | #F44336 |
| Background | Light Gray | #FAFAFA |
| Surface | White | #FFFFFF |
| Text | Dark Gray | #212121 |

### Dark Mode

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Light Blue | #64B5F6 |
| Secondary | Light Orange | #FFB74D |
| Success | Light Green | #66BB6A |
| Warning | Light Yellow | #FDD835 |
| Error | Light Red | #EF5350 |
| Background | Very Dark Gray | #121212 |
| Surface | Dark Gray | #1E1E1E |
| Text | White | #FFFFFF |

### Using Colors in CSS

```css
/* Using CSS variables */
background-color: var(--color-primary);
color: var(--color-text);
border-color: var(--color-border-light);
```

### Color Utilities

```css
/* Badge colors */
.badge-primary { background-color: var(--color-primary-light); }
.badge-success { background-color: rgba(76, 175, 80, 0.1); }
.badge-error { background-color: rgba(244, 67, 54, 0.1); }

/* Alert colors */
.alert-success { background-color: var(--color-success); }
.alert-error { background-color: var(--color-error); }
```

---

## 📝 Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Font Sizes

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| H1 | 2.5rem | 2rem | 1.75rem |
| H2 | 2rem | 1.5rem | 1.33rem |
| H3 | 1.5rem | 1.25rem | 1.125rem |
| Body | 1rem | 0.95rem | 0.9rem |
| Small | 0.875rem | 0.85rem | 0.8rem |

### Line Heights

- Headings: 1.2 (tight)
- Body text: 1.5 (comfortable reading)
- Labels: 1.3 (form labels)

---

## 📐 Spacing & Sizing

### Spacing Scale

```javascript
const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  xxl: '3rem',    // 48px
}
```

### Usage Examples

```css
/* Margin */
.card {
  margin-bottom: var(--spacing-lg);
}

/* Padding */
.button {
  padding: 0.75rem 1.5rem;
}

/* Gap (Flexbox/Grid) */
.grid {
  gap: var(--spacing-lg);
}
```

### Border Radius

```css
border-radius-sm: 4px    /* Forms, small elements */
border-radius-md: 8px    /* Cards, default */
border-radius-lg: 12px   /* Large components */
border-radius-xl: 16px   /* Major sections */
border-radius-full: 9999px /* Pills, badges */
```

### Shadows

| Level | Usage | CSS |
|-------|-------|-----|
| Subtle | Cards, hover | `var(--shadow-sm)` |
| Medium | Dropdowns, modals | `var(--shadow-md)` |
| Large | Sticky elements, overlays | `var(--shadow-lg)` |

---

## 💡 Usage Examples

### Example 1: Creating a Responsive Card

```jsx
// Component
function MyCard() {
  return (
    <div className="card">
      <h3>Title</h3>
      <p>Description</p>
      <button className="btn-primary">Action</button>
    </div>
  )
}

// CSS (already in Pages.css)
.card {
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease-in-out;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

### Example 2: Responsive Grid Layout

```jsx
<div className="grid grid-3">
  <div className="dashboard-card">
    <h3>Events</h3>
    <div className="dashboard-card-value">25</div>
  </div>
  <div className="dashboard-card">
    <h3>Bookings</h3>
    <div className="dashboard-card-value">150</div>
  </div>
  <div className="dashboard-card">
    <h3>Revenue</h3>
    <div className="dashboard-card-value">₹5,000</div>
  </div>
</div>

/* CSS */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

### Example 3: Theme-Aware Alert

```jsx
<div className="alert alert-success">
  ✅ Event created successfully!
</div>

/* CSS - automatically uses theme colors */
.alert-success {
  background-color: var(--color-success);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--color-success);
}

/* Works in both light and dark modes */
```

### Example 4: Responsive Form

```jsx
<div className="form-container">
  <div className="form-group">
    <label className="form-label">Event Title</label>
    <input type="text" className="form-input" />
  </div>
  
  <div className="form-group">
    <label className="form-label">Description</label>
    <textarea className="form-input"></textarea>
  </div>
  
  <button className="btn-primary" style={{ width: '100%' }}>
    Create Event
  </button>
</div>

/* CSS - automatically responsive */
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .form-container {
    padding: 1rem;
  }
}
```

---

## ✅ Best Practices

### 1. Use CSS Variables

✅ **Good**:
```css
color: var(--color-text);
background-color: var(--color-surface);
```

❌ **Bad**:
```css
color: #212121;  /* Hard to maintain */
background-color: #ffffff;
```

### 2. Responsive First, Mobile Last

✅ **Good**:
```css
/* Mobile first */
.card {
  display: block;
}

/* Then enhance for larger screens */
@media (min-width: 768px) {
  .card {
    display: grid;
  }
}
```

### 3. Use Semantic HTML

✅ **Good**:
```jsx
<header>
  <nav>
    <button>Home</button>
  </nav>
</header>
<main>
  <section>Content</section>
</main>
```

### 4. Consistent Spacing

✅ **Good**:
```css
.component {
  margin: var(--spacing-lg);
  padding: var(--spacing-md);
  gap: var(--spacing-md);
}
```

### 5. Test on Real Devices

- iPhone 12 mini (375px)
- iPad (768px)
- Desktop (1280px)
- Large monitor (1920px)

### 6. Accessibility

- Ensure sufficient color contrast
- Use focus states for keyboard navigation
- Provide alt text for images
- Use semantic HTML

---

## 🛠️ Customization Guide

### Changing the Color Scheme

#### Step 1: Update `themeConfig.js`

```javascript
export const themes = {
  light: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    // ... other colors
  }
}
```

#### Step 2: Update `index.css`

```css
:root[data-theme="light"] {
  --color-primary: #YOUR_COLOR;
  --color-secondary: #YOUR_COLOR;
  /* ... */
}
```

### Changing Breakpoints

Update in `index.css`:

```css
@media (max-width: 600px) {
  /* New mobile breakpoint */
}

@media (max-width: 900px) {
  /* New tablet breakpoint */
}
```

### Adding New CSS Variables

```css
:root[data-theme="light"] {
  /* ... existing variables */
  --color-custom: #MY_COLOR;
}

:root[data-theme="dark"] {
  /* ... existing variables */
  --color-custom: #MY_DARK_COLOR;
}
```

Then use in CSS:
```css
.custom-element {
  color: var(--color-custom);
}
```

### Custom Theme Hook

Create a hook to use with custom colors:

```javascript
// hooks/useThemedColor.js
export const useThemedColor = (colorName) => {
  const { theme } = useTheme()
  const themeColors = themes[theme]
  return themeColors[colorName]
}

// Usage
function MyComponent() {
  const primaryColor = useThemedColor('primary')
  return <div style={{ color: primaryColor }}>Text</div>
}
```

---

## 📦 Files Structure

```
src/
├── context/
│   └── ThemeContext.jsx          # Theme provider & hook
├── theme/
│   └── themeConfig.js            # Color palette & constants
├── components/
│   ├── Navbar.jsx               # Navigation component
│   └── Navbar.css               # Navbar styles
├── pages/
│   ├── Home.jsx                 # Home page
│   ├── Login.jsx                # Login page
│   ├── Register.jsx             # Register page
│   ├── Pages.css                # Page styles
│   └── Auth.css                 # Auth page styles
├── index.css                    # Global styles & theme CSS
├── App.css                      # App layout styles
├── App.jsx                      # Main app component
└── main.jsx                     # App entry point
```

---

## 🎯 Summary

✅ **What's Included**:
- Light/Dark theme system with persistence
- Fully responsive design (mobile-first)
- Modern UI components
- Consistent color palette
- Smooth animations & transitions
- Accessible form inputs
- Mobile-optimized navigation

✅ **You Can**:
- Switch themes with one click
- View on any device size
- Customize colors easily
- Add new components using existing patterns
- Maintain consistency across pages

---

## 📞 Support

For questions about the UI system:
1. Check [themeConfig.js](themeConfig.js) for available theme values
2. Review [index.css](index.css) for CSS variables
3. Check component CSS files for examples
4. Read inline comments in components

---

**Last Updated**: January 2025
**Version**: 2.2
**Theme Support**: Light & Dark
**Responsive**: Mobile, Tablet, Desktop, Large
