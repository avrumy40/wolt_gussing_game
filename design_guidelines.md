# Design Guidelines: Wolt Food Guessing Game

## Design Approach

**Reference-Based Hybrid**: Draw from Wolt's food delivery app aesthetics (clean cards, food photography focus, modern interface) combined with Kahoot's engaging quiz mechanics (bold question displays, immediate feedback, playful energy). The design prioritizes quick recognition, clear choices, and rewarding feedback moments.

**Core Principles**:
- Food-first visual hierarchy: Dish images are hero elements
- Instant clarity: Players should immediately understand their options
- Momentum-driven flow: Smooth transitions between questions maintain engagement
- Celebratory feedback: Visual rewards for correct answers

---

## Typography

**Font Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif` (matches Wolt's modern approach)

**Hierarchy**:
- **Category Headers**: 2.5rem (40px), bold (700), tight leading (1.1)
- **Question Counter**: 1.5rem (24px), semibold (600), "Question 3/10" format
- **Restaurant Names**: 1.125rem (18px), medium (500) for options, bold (700) for correct answer reveal
- **Score Display**: 3rem (48px) for final score number, bold (700)
- **Body Text**: 1rem (16px), regular (400) for instructions and secondary info
- **Buttons**: 1.125rem (18px), semibold (600), uppercase for primary actions

---

## Layout System

**Spacing Units**: Tailwind's 4, 6, 8, 12, 16, 24 for consistent rhythm
- Component padding: `p-6` or `p-8`
- Section spacing: `gap-8` or `gap-12`
- Button spacing: `px-8 py-4`
- Card margins: `space-y-6`

**Container Strategy**:
- Max-width: `max-w-4xl` (768px) for optimal quiz readability
- All screens centered: `mx-auto`
- Mobile padding: `px-4`, Desktop: `px-8`

**Grid Patterns**:
- Category selection: 2-column grid on tablet/desktop (`grid-cols-2 lg:grid-cols-3`), single column mobile
- Answer options: Always 2-column grid (`grid-cols-2`) for consistent layout
- Score summary: Single column centered layout

---

## Component Library

### 1. Category Selection Screen

**Layout**: Full viewport height with vertical centering
- Header section: Logo/title area with game name, centered
- Category grid container: `max-w-4xl mx-auto px-4`
- Category cards: Rounded (`rounded-2xl` = 16px), hoverable with subtle scale transform
- "All Categories" option: Prominent placement at top or as distinct larger card
- Each card displays: Category icon/emoji, category name, count of available restaurants

**Card Specs**:
- Aspect ratio: Near-square for balanced grid
- Padding: `p-6`
- Border: 2px solid treatment for selected state
- Shadow: Soft elevation (`shadow-md`), enhanced on hover (`shadow-xl`)

### 2. Quiz Interface

**Screen Structure** (mobile-first):

**Top Bar** (fixed or sticky):
- Question counter (left): "3/10"
- Current score badge (right): Circular pill showing points
- Progress bar: Thin horizontal bar showing quiz completion

**Dish Image Section**:
- Full-width container with aspect ratio lock (3:2 or 4:3)
- Rounded corners: `rounded-3xl` (24px)
- Object-fit: cover to prevent distortion
- Subtle shadow: `shadow-2xl` for card elevation
- Max height on desktop: 400px to prevent oversized images

**Question Prompt**:
- Clear heading: "Which restaurant serves this dish?"
- Positioned between image and answers
- Text alignment: center
- Spacing: `my-8`

**Answer Options Grid**:
- 2-column responsive grid (`grid-cols-2 gap-4`)
- Each option card:
  - Rounded: `rounded-xl` (12px)
  - Padding: `p-6`
  - Border: 2px solid for clear boundaries
  - Restaurant name: centered, bold
  - Minimum touch target: 64px height
  - Disabled state after selection (opacity reduction)

**Feedback States** (after answer selection):
- Correct answer: Pulsing success border, checkmark icon
- Wrong answer: Shake animation, X icon
- Unselected correct answer: Highlighted with distinct border
- Next button: Appears after selection, prominent placement

### 3. Final Score Screen

**Layout**: Centered vertical stack
- Large score display: "8/10" in hero size (3rem+)
- Score message: Dynamic text based on performance
  - 9-10: "Amazing! Tel Aviv food expert!"
  - 7-8: "Great job! Almost perfect!"
  - 5-6: "Not bad! Keep exploring!"
  - 0-4: "Try again! You'll get better!"
- Score breakdown: List of answered questions with dish thumbnails
- Action buttons: 
  - "Play Again" (primary)
  - "Choose Different Category" (secondary)
- Buttons stacked on mobile, side-by-side on desktop

### 4. Interactive Elements

**Buttons**:
- Primary: Large, rounded (`rounded-xl`), bold text, 56px min height
- Secondary: Outlined variant with 2px border
- Disabled: Reduced opacity (0.5)

**Hover States**:
- Category cards: Scale(1.02) + shadow enhancement
- Answer cards: Subtle scale(1.01) + border emphasis
- Buttons: Slight darkening via opacity overlay

**Transitions**: 
- All interactive elements: `transition-all duration-200`
- Answer reveal: Stagger animation (0.1s delay between cards)
- Score counting: Number count-up animation

---

## Images

**Dish Photography Integration**:
- **Quiz Screen Hero**: Each question features a full-width dish image from JSON data. Images should be high-quality, appetizing food photography showcasing the dish clearly.
- **Image Placement**: Top section of quiz interface, above question prompt
- **Aspect Ratio**: Maintain 4:3 or 3:2 ratio with `object-cover` to prevent distortion
- **Loading State**: Skeleton shimmer placeholder while image loads
- **Error Handling**: Fallback placeholder if image URL fails
- **Category Cards**: Optional small icon/emoji representing food type (🍔, 🍕, 🍣) for visual interest

**No hero section needed** - this is a functional quiz app, not a marketing page. The dish images serve as dynamic hero content within each quiz question.

---

## Responsive Breakpoints

- **Mobile** (< 640px): Single column answers, stacked layouts, full-width images
- **Tablet** (640px - 1024px): 2-column answer grid, optimized spacing
- **Desktop** (> 1024px): Maximum content width (768px), generous white space margins