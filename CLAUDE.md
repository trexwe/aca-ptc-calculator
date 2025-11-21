# CLAUDE.md - AI Assistant Guide for ACA PTC Calculator

## Project Overview

This is the **ACA Premium Tax Credit (PTC) Calculator** - a React-based web application that helps users compare Affordable Care Act premium tax credits and net premiums between 2025 and 2026. The calculator models both Enhanced and Standard PTC rules to show how policy changes affect household healthcare costs across different income levels.

**Live URL**: https://trexwe.github.io/aca-ptc-calculator

**Repository**: trexwe/aca-ptc-calculator

**License**: GNU General Public License v3.0 (GPL-3.0)

**Purpose**: Educational tool for understanding how ACA subsidies work under different policy scenarios, allowing users to model the financial impact of premium increases, poverty line changes, and PTC policy changes.

## Codebase Structure

```
/home/user/aca-ptc-calculator/
├── public/                    # Static assets
│   ├── index.html            # Single HTML entry point
│   ├── manifest.json         # PWA manifest
│   ├── favicon.ico           # Site icon
│   ├── robots.txt            # SEO crawler instructions
│   └── logo*.png             # App icons (192px, 512px)
│
├── src/                       # React application source
│   ├── App.js               # Main application component (411 lines)
│   │                         # Contains ALL business logic and UI
│   ├── App.test.js          # Placeholder test file
│   ├── App.css              # Legacy CSS (mostly unused)
│   ├── index.js             # React entry point
│   ├── index.css            # Global styles + Tailwind imports
│   ├── setupTests.js        # Jest configuration
│   ├── reportWebVitals.js   # Performance monitoring
│   └── logo.svg             # React logo
│
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS plugins (Tailwind + Autoprefixer)
├── .gitignore              # Git ignore patterns
├── README.md               # Standard Create React App documentation
└── LICENSE                 # GPL-3.0 license text
```

**Key Architectural Note**: This is a **single-component architecture**. All application logic, calculations, and UI rendering happen in `src/App.js`. While simple and easy to understand, this could benefit from component splitting if the app grows.

## Technology Stack

### Core
- **React 19.1.1** - Modern functional components with hooks
- **React DOM 19.1.1** - DOM rendering
- **Create React App** - Zero-config build setup (react-scripts 5.0.1)

### Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **PostCSS 8.5.6** + **Autoprefixer 10.4.21** - CSS processing

### Testing
- **@testing-library/react 16.3.0** - Component testing
- **@testing-library/jest-dom 6.7.0** - DOM assertions
- **@testing-library/user-event 13.5.0** - User interaction simulation
- **Jest** - Test runner (via react-scripts)

### Deployment
- **gh-pages 6.3.0** - GitHub Pages deployment

### Performance
- **web-vitals 2.1.4** - Core Web Vitals monitoring

### Browser Support
- **Production**: >0.2% market share, not dead, not Opera Mini
- **Development**: Latest Chrome, Firefox, Safari

## Development Workflows

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/trexwe/aca-ptc-calculator.git
cd aca-ptc-calculator

# Install dependencies
npm install
```

### Development
```bash
# Start development server (hot reload enabled)
npm start

# Opens http://localhost:3000
# Changes auto-reload
# ESLint errors appear in console
```

### Testing
```bash
# Run tests in interactive watch mode
npm test

# Note: Currently minimal test coverage
```

### Building
```bash
# Create optimized production build
npm run build

# Output: /build directory
# Minified, optimized, content-hashed filenames
```

### Deployment
```bash
# Deploy to GitHub Pages
npm run deploy

# Requires: GH_TOKEN environment variable
# Runs: npm run build → gh-pages -d build
# Deploys to: https://trexwe.github.io/aca-ptc-calculator
```

### Branch Strategy
- **Main branch**: Production-ready code
- **Feature branches**: Use `claude/` prefix for AI-assisted development
- Always push to the specified branch in context (check session instructions)

## Code Conventions and Patterns

### Naming Conventions
- **Variables/Functions**: `camelCase` (e.g., `calculateHouseholdPremiumFactor`)
- **React Components**: `PascalCase` (e.g., `InputPanel`, `ResultsTable`)
- **Constants**: `UPPERCASE_SNAKE_CASE` (e.g., `AGE_CURVE_DATA`, `FPL_BASE_DATA`)
- **Descriptive Names**: Favor clarity over brevity

### React Patterns
1. **Functional Components Only** - No class components
2. **Hooks Usage**:
   - `useState` for component state
   - `useEffect` for calculation triggers
   - `useMemo` for expensive computations
   - Custom hooks for logic encapsulation (`useAcaCalculator`)
3. **Props Destructuring**: Always destructure in function signatures
4. **Conditional Rendering**: Use ternary operators for simple cases

### Code Organization in App.js
The 411-line App.js is organized into clear sections:

```javascript
// 1. Constants (Lines 3-19)
const AGE_CURVE_DATA = { ... };
const FPL_BASE_DATA = [ ... ];

// 2. Helper Functions (Lines 21-83)
// Pure functions - easy to test
const buildAgeCurveFactors = () => { ... };
const getFplForHousehold = (size, year, fplIncrease) => { ... };
const getApplicablePercentage = (fplPercent, year, ptcType) => { ... };
const calculateHouseholdPremiumFactor = (...) => { ... };
const formatCurrency = (amount) => { ... };

// 3. Custom Hook (Lines 86-183)
const useAcaCalculator = (inputs) => {
  // Encapsulates calculation logic
  // Returns: { results, loading, error, householdPremiumFactor }
};

// 4. Presentational Components (Lines 186-366)
const Header = () => { ... };
const InputPanel = ({ inputs, setInputs }) => { ... };
const PremiumsDisplay = ({ inputs, householdPremiumFactor }) => { ... };
const ResultsTable = ({ results, inputs }) => { ... };

// 5. Main App Component (Lines 372-411)
export default function App() {
  const [inputs, setInputs] = useState({ ... });
  const { results, loading, error, householdPremiumFactor } = useAcaCalculator(inputs);
  return ( ... );
}
```

### Styling Conventions
- **Primary Approach**: Tailwind CSS utility classes
- **Responsive Design**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Color Palette**:
  - Primary: Indigo (`indigo-700`, `indigo-500`)
  - Success: Green (`green-700`)
  - Error: Red (`red-700`)
  - Neutral: Gray scales
- **Minimal Custom CSS**: App.css exists but is largely unused

### Data Flow
```
User Input → State Change → useEffect Trigger → Calculation → Results Update → UI Re-render
```

**Unidirectional Flow**: State flows down, events bubble up.

## Key Files and Their Purposes

### `/home/user/aca-ptc-calculator/src/App.js` (411 lines)

This is the **heart of the application**. Everything happens here.

#### Section A: Constants (Lines 3-39)
```javascript
AGE_CURVE_DATA // Age-based premium multipliers (0.635x to 3.0x)
FPL_BASE_DATA  // Federal Poverty Line base amounts by household size
AGE_CURVE_FACTORS // Computed lookup table (ages 0-100)
```

#### Section B: Helper Functions (Lines 41-83)
Pure, testable utility functions:
- `getFplForHousehold(size, year, fplIncrease)` - Calculates poverty line
- `getApplicablePercentage(fplPercent, year, ptcType)` - Income-to-premium ratio
- `calculateHouseholdPremiumFactor(size, age)` - Household premium multiplier
- `formatCurrency(amount)` - USD formatting

#### Section C: Custom Hook (Lines 86-183)
`useAcaCalculator(inputs)` - Encapsulates all calculation logic:
- Validates inputs
- Calculates premiums for both years
- Iterates through FPL percentages (125%-425%)
- Computes APTC and net premiums
- Returns `{ results, loading, error, householdPremiumFactor }`

#### Section D: UI Components (Lines 186-366)
- `Header()` - Title and description
- `InputPanel({ inputs, setInputs })` - 12 input fields
- `PremiumsDisplay({ inputs, householdPremiumFactor })` - Premium breakdown
- `ResultsTable({ results, inputs })` - 12-column comparison table

#### Section E: Main Component (Lines 372-411)
Manages state and composes sub-components.

### `/home/user/aca-ptc-calculator/src/index.js`
React entry point - creates root and renders App in StrictMode.

### `/home/user/aca-ptc-calculator/src/index.css`
Global styles:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `/home/user/aca-ptc-calculator/package.json`
Project configuration:
- **Scripts**: `start`, `build`, `test`, `deploy`
- **Homepage**: GitHub Pages URL
- **ESLint Config**: Extends `react-app`

### `/home/user/aca-ptc-calculator/tailwind.config.js`
Minimal Tailwind config - scans `src/**/*.{js,jsx,ts,tsx}` for classes.

## Business Logic Explained

### ACA Premium Tax Credit Calculation

The calculator models complex ACA subsidy rules. Here's how it works:

#### 1. Age-Based Rating
Premiums vary by age (CMS age curve):
- Children (0-14): 0.765x
- Age 21 (baseline): 1.000x
- Age 40: 1.278x
- Age 64+: 3.000x

**Code Reference**: `AGE_CURVE_DATA` in `src/App.js:7-15`

#### 2. Household Premium Calculation
```javascript
// For 1 person: ageFactor
// For 2 people: ageFactor × 2
// For 2+ people: (2 × adultFactor) + (min(children, 3) × childFactor)
// Note: Only first 3 children count toward premiums (ACA rule)
```

**Code Reference**: `calculateHouseholdPremiumFactor()` in `src/App.js:70-79`

#### 3. Federal Poverty Line (FPL)
Base amounts by household size (2025):
- 1 person: $15,650
- 2 people: $21,150
- Each additional: +$5,500

**Code Reference**: `FPL_BASE_DATA` in `src/App.js:17-19`

#### 4. Income Brackets and Applicable Percentages

**2025 Enhanced PTC** (also 2026 if extended):
- 0-150% FPL: 0% of income
- 150-200% FPL: 0-2% of income
- 200-250% FPL: 2-4% of income
- 250-300% FPL: 4-6.5% of income
- 300-400% FPL: 6.5-8.5% of income
- 400%+ FPL: 8.5% of income (no subsidy cliff)

**2026 Standard PTC**:
- 100-133% FPL: 2% of income
- 133-150% FPL: 3% of income
- 150-200% FPL: 4% of income
- 200-250% FPL: 6.3% of income
- 250-300% FPL: 8.05% of income
- 300-400% FPL: 9.5% of income
- 400%+ FPL: **NO SUBSIDY** (cliff)

**Code Reference**: `getApplicablePercentage()` in `src/App.js:47-68`

#### 5. APTC Calculation
```
Annual APTC = Silver Premium (annual) - (Annual Income × Applicable Percentage)
Monthly APTC = Annual APTC / 12
Net Premium = Full Premium - APTC
```

**Code Reference**: `useAcaCalculator()` in `src/App.js:102-180`

#### 6. Plan Metal Tiers
- **Bronze**: Lowest premium, highest out-of-pocket (typically ~70% of Silver)
- **Silver**: Benchmark plan used for subsidy calculation
- **Gold**: Higher premium, lower out-of-pocket (typically ~110% of Silver)
- **Platinum**: Highest premium, lowest out-of-pocket (typically ~135% of Silver)

**Important**: APTC is always based on Silver premium, but can be applied to any metal tier.

### Default Scenario Parameters

The calculator loads with a realistic example scenario:
```javascript
householdSize: 4              // Family of 4
silverPremiumAge: 40          // 40-year-old primary adult
individualSilverPremium: 400  // $400/month Silver premium at age 21
bronzeFactor: 0.70           // Bronze is 70% of Silver
goldFactor: 1.10             // Gold is 110% of Silver
platinumFactor: 1.35         // Platinum is 135% of Silver
premiumIncrease2026: 0.10    // 10% premium increase
fplIncrease2026: 0.03        // 3% FPL increase
ptcType2026: 'standard'      // Standard PTC (no extension)
planSelection2025: 'silver'  // Silver plan in 2025
planSelection2026: 'silver'  // Silver plan in 2026
```

**Code Reference**: `useState()` initialization in `src/App.js:373-385`

## Testing Strategy

### Current State
- **Minimal Coverage**: Only placeholder test exists
- **Infrastructure Ready**: Testing Library and Jest configured
- **Test File**: `src/App.test.js` (basic render test)

### Priority Testing Targets

#### 1. Helper Functions (High Priority)
Pure functions are easiest to test:
```javascript
// Example tests to write:
describe('getFplForHousehold', () => {
  test('calculates 2025 FPL correctly for family of 4', () => {
    expect(getFplForHousehold(4, 2025, 0.03)).toBe(32150);
  });
  test('applies 2026 FPL increase', () => {
    expect(getFplForHousehold(4, 2026, 0.03)).toBeCloseTo(33114.5);
  });
});
```

#### 2. Calculation Logic
Test `useAcaCalculator` hook with various scenarios:
- Edge cases (FPL 400% with Standard PTC - subsidy cliff)
- Different household sizes
- Age rating factors
- Premium increases

#### 3. Component Rendering
Test UI components with React Testing Library:
- Input validation
- Table rendering with different data
- Loading states
- Error displays

### Testing Commands
```bash
# Run all tests in watch mode
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- App.test.js
```

## Common Tasks for AI Assistants

### Task 1: Modify Calculation Logic
**Example**: "Change the FPL base amounts for 2026"

**Steps**:
1. Edit `FPL_BASE_DATA` constant in `src/App.js:17-19`
2. If changing calculation logic, edit `getFplForHousehold()` in `src/App.js:41-45`
3. Test changes: `npm start` and verify calculations
4. Write tests for new logic in `src/App.test.js`
5. Commit with clear message: `git commit -m "Update FPL base amounts for 2026"`

**Key Files**: `src/App.js` (constants and helper functions)

### Task 2: Add New Input Field
**Example**: "Add a field for spouse age"

**Steps**:
1. Add to default state in `src/App.js:373-385`
2. Update `InputPanel` component to render new field (`src/App.js:201-283`)
3. Modify `calculateHouseholdPremiumFactor()` to use spouse age (`src/App.js:70-79`)
4. Update `useAcaCalculator` to recalculate on change (already in dependency array)
5. Test thoroughly with various ages

**Key Files**: `src/App.js` (state, InputPanel, calculation logic)

### Task 3: Modify Styling
**Example**: "Change the color scheme from indigo to blue"

**Steps**:
1. Search for `indigo-` classes in `src/App.js`
2. Replace with `blue-` equivalents (use Find & Replace)
3. Test responsive design at different breakpoints
4. Check color contrast for accessibility

**Note**: This project uses Tailwind. Avoid adding custom CSS unless absolutely necessary.

### Task 4: Add New Metal Tier
**Example**: "Add Catastrophic plan option"

**Steps**:
1. Add `catastrophicFactor` to default state (`src/App.js:373-385`)
2. Add input field in `InputPanel` (`src/App.js:215-283`)
3. Update premium calculations in `useAcaCalculator` (`src/App.js:112-123`)
4. Add to plan selection dropdowns (`src/App.js:270-280`)
5. Update `PremiumsDisplay` and `ResultsTable` components

**Key Files**: `src/App.js` (all sections)

### Task 5: Export Results to CSV
**Example**: "Add a 'Download CSV' button"

**Steps**:
1. Create new helper function `exportToCSV(results)`
2. Add button to UI below `ResultsTable`
3. Use JavaScript Blob API to create downloadable file
4. Test with various scenarios

**Implementation Tip**:
```javascript
const exportToCSV = (results) => {
  const headers = ['FPL %', 'Income 2025', 'Income 2026', ...];
  const csvContent = [
    headers.join(','),
    ...results.map(row => [row.fplPercent, row.income2025, ...].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aca-ptc-results.csv';
  a.click();
};
```

### Task 6: Improve Accessibility
**Example**: "Add ARIA labels and keyboard navigation"

**Steps**:
1. Add `aria-label` to all input fields
2. Add `role` attributes to table elements
3. Test with keyboard only (Tab, Enter, Arrow keys)
4. Test with screen reader (NVDA/JAWS)
5. Add focus indicators (visible outlines)
6. Ensure color contrast meets WCAG AA standards

**Tools**: axe DevTools browser extension, Lighthouse audit

### Task 7: Split Components into Separate Files
**Example**: "Refactor App.js into multiple files"

**Steps**:
1. Create `src/components/` directory
2. Extract each component to its own file:
   - `Header.js`
   - `InputPanel.js`
   - `PremiumsDisplay.js`
   - `ResultsTable.js`
3. Create `src/hooks/useAcaCalculator.js`
4. Create `src/utils/calculations.js` for helper functions
5. Create `src/constants/acaData.js` for static data
6. Update imports in `App.js`
7. Test thoroughly - ensure no regressions

**Benefits**: Better organization, easier testing, clearer separation of concerns

### Task 8: Add Unit Tests
**Example**: "Write comprehensive tests for all helper functions"

**Steps**:
1. Create test files (e.g., `src/utils/calculations.test.js`)
2. Test each helper function with multiple scenarios
3. Test edge cases (0, negative, very large numbers)
4. Test boundary conditions (FPL 400% with Standard PTC)
5. Run coverage report: `npm test -- --coverage`
6. Aim for >80% coverage on calculation logic

**Example Test**:
```javascript
import { getApplicablePercentage } from './calculations';

describe('getApplicablePercentage', () => {
  test('returns 0% for 150% FPL in 2025', () => {
    expect(getApplicablePercentage(150, 2025, 'enhanced')).toBe(0);
  });

  test('handles 2026 Standard PTC subsidy cliff at 400%', () => {
    expect(getApplicablePercentage(401, 2026, 'standard')).toBe(-1);
  });
});
```

## Git Workflow Best Practices

### Committing Changes
```bash
# Check current status
git status

# Stage specific files
git add src/App.js

# Commit with descriptive message
git commit -m "Add catastrophic plan tier option

- Added catastrophicFactor input field
- Updated premium calculations
- Added to plan selection dropdowns
- Tested with various household scenarios"

# Push to feature branch
git push -u origin claude/feature-branch-name
```

### Commit Message Format
```
<type>: <short summary>

<detailed description>

<optional footer: related issues, breaking changes>
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `style`, `chore`

### Creating Pull Requests
```bash
# Ensure you're on the correct branch
git branch --show-current

# Push latest changes
git push -u origin <branch-name>

# Create PR (user will do this manually or via gh CLI if available)
```

**PR Description Template**:
```markdown
## Summary
Brief description of changes

## Changes Made
- Bullet list of specific changes
- Include file paths for clarity

## Testing
How changes were tested

## Screenshots (if UI changes)
Before/after comparisons
```

## Areas for Enhancement

### High Priority
1. **Component Splitting**: Break App.js into separate files for maintainability
2. **Unit Tests**: Add comprehensive tests for calculation logic
3. **TypeScript**: Add type safety to prevent calculation errors
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **Error Handling**: Better validation and user feedback for invalid inputs

### Medium Priority
6. **Export Functionality**: CSV/PDF export of results
7. **Print Styles**: Optimize for printing results
8. **Mobile UX**: Improve table scrolling on small screens
9. **State Management**: Consider Context API if complexity grows
10. **Performance**: Memoize expensive calculations, virtualize large tables

### Low Priority
11. **Dark Mode**: Theme toggle for accessibility
12. **Saved Scenarios**: LocalStorage for saving/loading scenarios
13. **Comparison Mode**: Side-by-side scenario comparison
14. **Data Visualization**: Charts showing premium changes across FPL levels
15. **Share URLs**: Encode scenario in URL params for sharing

## Important Conventions for AI Assistants

### Before Making Changes
1. **Always read the file first**: Use Read tool before Edit
2. **Understand context**: Check related components and functions
3. **Preserve formatting**: Match existing indentation and style
4. **Test assumptions**: Don't guess - verify by reading code

### When Writing Code
1. **Follow React 19 patterns**: Use functional components and modern hooks
2. **Use Tailwind for styling**: Avoid adding custom CSS
3. **Keep functions pure**: Especially helper functions in App.js
4. **Comment complex logic**: Especially ACA calculation rules
5. **Validate inputs**: Always check for edge cases (0, negative, undefined)

### Testing Your Changes
1. **Run locally**: Always `npm start` to verify
2. **Test edge cases**: Very large/small values, 400% FPL cliff
3. **Check responsiveness**: Test on mobile, tablet, desktop sizes
4. **Review console**: No errors or warnings
5. **Build successfully**: `npm run build` should complete without errors

### Git and Deployment
1. **Commit often**: Small, focused commits with clear messages
2. **Push to feature branch**: Never directly to main unless instructed
3. **Test before deploying**: Verify build works before `npm run deploy`
4. **Document changes**: Update this file if architecture changes significantly

## Key Formulas Reference

### Federal Poverty Line
```
FPL(household_size, year) =
  if size <= 8: FPL_BASE_DATA[size - 1]
  if size > 8:  FPL_BASE_DATA[7] + ((size - 8) × 5500)

  if year === 2026: FPL(size, 2025) × (1 + fplIncrease)
```

### Household Premium Factor
```
factor(household_size, adult_age) =
  if size === 1: AGE_CURVE_FACTORS[adult_age]
  if size === 2: AGE_CURVE_FACTORS[adult_age] × 2
  if size >= 3:  (2 × AGE_CURVE_FACTORS[adult_age]) +
                 (min(size - 2, 3) × AGE_CURVE_FACTORS[16])
```

### Premium Calculation
```
Premium(metal_tier, year) =
  individual_silver_premium × metal_factor × household_factor

  if year === 2026: Premium(tier, 2025) × (1 + premium_increase)
```

### APTC Calculation
```
Annual_Income = FPL(household_size, year) × (fpl_percent / 100)
Expected_Contribution = Annual_Income × Applicable_Percentage
Annual_APTC = max(0, (Silver_Premium × 12) - Expected_Contribution)
Monthly_APTC = Annual_APTC / 12
```

### Net Premium
```
Net_Premium(metal_tier) = max(0, Premium(tier) - Monthly_APTC)
```

## Resources and References

### ACA Policy Documentation
- [HealthCare.gov Glossary](https://www.healthcare.gov/glossary/)
- [CMS Age Curve Rates](https://www.cms.gov/)
- [KFF ACA Subsidy Calculator](https://www.kff.org/interactive/subsidy-calculator/)

### React and Tooling
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/react)
- [Create React App Docs](https://create-react-app.dev/)

### Development Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Contact and Support

For issues, questions, or contributions, refer to the GitHub repository issue tracker or README.md file.

---

**Last Updated**: 2025-11-21
**Version**: 0.1.0
**Maintained by**: AI Assistant (Claude)

**Note to AI Assistants**: This document should be updated whenever significant architectural changes are made to the codebase. Keep it current and accurate.
