

## Analysis

Your project is already well-prepared for dark mode:

- `tailwind.config.ts` has `darkMode: ["class"]` configured
- `src/index.css` already defines both `:root` (light) and `.dark` (dark) CSS variable sets
- All components use CSS variable-based colors (e.g., `bg-background`, `text-foreground`)

You only need two things: a theme context/provider and a toggle button.

## Recommended Prompt

Here is a prompt you can pass directly:

---

**Add a dark/light mode toggle to my app. Here is exactly what to do:**

1. **Create `src/components/ThemeProvider.tsx`** — a React context provider that:
   - Reads the initial theme from `localStorage` (key: `"theme"`), defaulting to `"light"`
   - Adds or removes the `"dark"` class on `document.documentElement`
   - Exposes `theme` and `toggleTheme` via context
   - Persists the choice to `localStorage` on change

2. **Wrap the app** — In `src/App.tsx`, wrap everything inside `<ThemeProvider>`.

3. **Create `src/components/ThemeToggle.tsx`** — a small button component that:
   - Uses the `useTheme` hook from ThemeProvider
   - Shows a Sun icon in dark mode and a Moon icon in light mode (from `lucide-react`)
   - Calls `toggleTheme` on click
   - Uses the existing `Button` component with `variant="ghost"` and `size="icon"`

4. **Add the toggle button** to the header area of each view:
   - `RoleSelection.tsx` — top-right corner, fixed position
   - `VisitorDashboard.tsx` — in the existing header bar, right side
   - `EnterpriseRegistration.tsx` — in the existing header bar, right side

**Do not modify the CSS variables or Tailwind config — they are already set up for dark mode. Only add the provider, toggle component, and place the toggle in the existing layouts.**

---

This prompt is specific enough to prevent unnecessary changes while giving the AI everything it needs.

