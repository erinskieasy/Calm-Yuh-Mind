# Mental Health & Wellness Platform Design Guidelines

## Design Approach: Reference-Based (Wellness Apps)

**Primary References:** Calm, Headspace, Sanvello  
**Core Philosophy:** Create a sanctuary of digital tranquility that builds trust through consistent, calming design while maintaining full functionality

**Key Principles:**
1. Emotional safety through soft, predictable visuals
2. Generous breathing room reduces cognitive load
3. Rounded, approachable forms over sharp edges
4. Progressive disclosure - never overwhelm
5. Consistent, gentle feedback mechanisms

---

## Color Palette

### Light Mode
- **Primary:** 210 65% 92% (Soft Sky Blue) - Main backgrounds, cards
- **Secondary:** 200 25% 88% (Misty Blue) - Secondary backgrounds
- **Accent:** 160 45% 65% (Sage Green) - CTAs, positive actions, progress indicators
- **Text Primary:** 220 15% 25% (Charcoal Blue)
- **Text Secondary:** 220 10% 50% (Muted Slate)

### Dark Mode
- **Primary:** 220 20% 15% (Deep Navy)
- **Secondary:** 220 18% 20% (Midnight Blue)
- **Accent:** 160 40% 55% (Muted Sage)
- **Text Primary:** 210 20% 92% (Soft White)
- **Text Secondary:** 210 15% 70% (Light Gray)

### Mood Colors (for tracking)
- **Joy:** 45 85% 70% (Warm Yellow)
- **Calm:** 200 60% 75% (Serene Blue)
- **Anxious:** 280 40% 70% (Soft Purple)
- **Sad:** 210 35% 60% (Cool Blue-Gray)
- **Energetic:** 25 75% 65% (Peachy Orange)

---

## Typography

**Font Families:**
- **Primary:** Inter (Google Fonts) - UI, body text, data
- **Display:** Outfit (Google Fonts) - Headings, meditation titles

**Scale:**
- **H1:** 2.5rem (40px), Outfit SemiBold, leading-tight
- **H2:** 2rem (32px), Outfit Medium, leading-snug
- **H3:** 1.5rem (24px), Outfit Medium, leading-normal
- **Body Large:** 1.125rem (18px), Inter Regular, leading-relaxed
- **Body:** 1rem (16px), Inter Regular, leading-relaxed
- **Small:** 0.875rem (14px), Inter Regular, leading-normal
- **Caption:** 0.75rem (12px), Inter Medium, leading-tight

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24

**Container Strategy:**
- Max width: `max-w-7xl` for main content
- Dashboard cards: `max-w-md` to `max-w-2xl` based on content
- Padding: `p-4 md:p-6 lg:p-8` for containers
- Gap: `gap-4 md:gap-6` for grids and flex layouts

**Grid Systems:**
- Dashboard: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Meditation exercises: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Mood calendar: Full-width single column with internal grid

---

## Component Library

### Navigation
- **Top Bar:** Sticky, backdrop-blur-md, soft shadow, height h-16
- **Items:** Icon + text, rounded-lg hover states with primary/10 background
- **Active State:** Accent color with subtle background fill

### Cards
- **Base:** Rounded-2xl, soft shadow (shadow-sm), border border-gray-200/50 dark:border-gray-700/50
- **Hover:** Gentle lift (shadow-md transition)
- **Padding:** p-6 for content cards
- **Mood Card:** Larger rounded-3xl, gradient backgrounds matching mood colors at 10% opacity

### Buttons
- **Primary:** Accent color, rounded-xl, px-6 py-3, medium font weight
- **Secondary:** Transparent with border-2, same rounding and padding
- **Ghost:** No background, accent color text, minimal padding
- **Size:** Consistent height h-12 for touch-friendly targets

### Forms & Inputs
- **Text Fields:** Rounded-lg, border-2, focus:ring-2 focus:ring-accent, h-12, px-4
- **Textarea:** Same styling, min-h-32 for journal entries
- **Dark Mode:** Maintain border visibility with lighter borders (border-gray-600)
- **Labels:** Text-sm font-medium, mb-2, text-secondary

### Mood Tracker
- **Calendar View:** Grid of days with circular mood indicators
- **Mood Selector:** Horizontal row of emoji/icon + color combinations, size h-16 w-16
- **Active Selection:** Ring-4 ring-accent with scale-110 transform

### Meditation Timer
- **Circular Progress:** SVG circle with stroke animation, diameter 200-300px
- **Center Display:** Large time remaining (text-4xl), breathing instruction below
- **Controls:** Icon-only buttons (play/pause) centered below circle

### Journal Interface
- **Editor:** Clean, distraction-free with toolbar hidden until hover
- **Entry List:** Timeline view with date headers, preview text, and mood indicator dot
- **Card Style:** Minimal borders, generous line-height (leading-loose)

### AI Chat Support
- **Message Bubbles:** Rounded-2xl, max-w-md, p-4
- **User Messages:** Accent background at 20% opacity, align-right
- **AI Messages:** Secondary background, align-left, with avatar icon
- **Input:** Fixed bottom, backdrop-blur, rounded-full input field

### Assessment Tools
- **Question Cards:** One question per card, radio/checkbox with custom styling
- **Progress Bar:** Thin (h-2), rounded-full, accent fill, at top of form
- **Results Display:** Circular gauge or horizontal bar chart, soft colors

### Audio Player (Soothing Tracks)
- **Mini Player:** Bottom sticky bar, backdrop-blur, h-20
- **Controls:** Icon buttons, track title, progress bar
- **Track List:** Scrollable cards with play button overlay on artwork placeholders

### Data Visualization
- **Mood Trends:** Line chart with smooth curves, soft gradient fill below line
- **Progress Charts:** Rounded bar charts, gentle colors from palette
- **Library:** Use Chart.js or Recharts with custom theming

---

## Images

### Hero Section (Dashboard Welcome)
**Placement:** Top of dashboard, full-width
**Description:** Soft gradient background (primary to secondary color, 135deg) with abstract organic shapes or minimalist line art suggesting calmness - floating leaves, gentle waves, or peaceful horizon. No photographic imagery.
**Treatment:** Semi-transparent overlay, text on left or centered, height 40vh on desktop, 30vh mobile

### Meditation Exercises
**Placement:** Card thumbnails in meditation library
**Description:** Abstract calming visuals - soft gradients, nature-inspired patterns (water ripples, clouds, forest silhouettes)
**Treatment:** Rounded-2xl, aspect-ratio-video, subtle overlay on hover

### Empty States
**Description:** Gentle illustrations (not photos) for empty journal, no mood entries yet, no chat history
**Style:** Line art in accent color, minimal detail, centered with helpful text below

---

## Animation Guidelines

**Use Sparingly:** Mental health context requires calm, not distraction

**Permitted:**
- Mood selection: Gentle scale (scale-105) and ring appearance on click
- Card hovers: Subtle shadow increase and 1px translate-y
- Page transitions: Soft fade-in (opacity 0 to 1, 300ms)
- Meditation timer: Smooth circular progress animation

**Forbidden:**
- Bouncing or elastic animations
- Spinning loaders (use gentle pulse instead)
- Parallax scrolling
- Complex page transitions

---

## Accessibility & Tone

- **Contrast Ratios:** Minimum WCAG AA (4.5:1 for text)
- **Focus States:** Always visible, 2px ring in accent color
- **Touch Targets:** Minimum 44px height for all interactive elements
- **Language Tone:** Supportive, non-clinical, encouraging ("How are you feeling?" vs "Log your symptoms")
- **Error Messages:** Gentle, helpful, never alarming ("Let's try that again" vs "Error!")

---

## Mobile Considerations

- **Bottom Navigation:** Fixed tab bar on mobile with 4-5 key sections
- **One-Hand Use:** Important actions in bottom 2/3 of screen
- **Swipe Gestures:** Calendar navigation, journal entries
- **Responsive Cards:** Stack to single column below md breakpoint
- **Touch-Optimized:** All interactive elements minimum h-12