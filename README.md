# ACA Premium Tax Credit Calculator

**[Live Calculator](https://trexwe.github.io/aca-ptc-calculator/)** | Educational tool for understanding ACA subsidy changes

## What This Calculator Does

This calculator helps you understand how the **expiration of Enhanced Premium Tax Credits (PTCs)** on December 31, 2025 could affect health insurance affordability for millions of Americans. It compares:

- **2025 (Enhanced PTCs)** - Current expanded subsidies from the American Rescue Plan Act (2021) and Inflation Reduction Act (2022)
- **2026 (Standard PTCs)** - What happens if Congress doesn't extend the enhanced subsidies

Enter your household information, and instantly see side-by-side premium and subsidy comparisons across income levels from 125% to 425% of the Federal Poverty Level (FPL).

## Why This Matters: The Stakes for 2026

### The Crisis Looming

Without Congressional action to extend enhanced premium tax credits beyond 2025, millions of Americans will face dramatic health insurance cost increases:

📊 **114% Average Premium Increase**
Subsidized enrollees' out-of-pocket costs would more than double, jumping from an average of **$888/year in 2025 to $1,904/year in 2026**.

👥 **4.8 Million People Could Lose Coverage**
Rising costs will force millions to drop their health insurance, with 7.3 million fewer people receiving subsidized Marketplace coverage.

💰 **The "Subsidy Cliff" Returns**
Currently, anyone earning over 400% FPL (about $62,600 for an individual in 2025) can receive subsidies if premiums exceed 8.5% of income. This protection disappears in 2026—earning just **$1 over the threshold** means losing **all** financial assistance.

### Real-World Impact Examples

**Young Adult, Middle Income:**
- 27-year-old making $35,000/year (224% FPL)
- 2025 premium: $1,033/year
- 2026 premium: $2,615/year
- **Impact: +$1,582 (153% increase)**

**Family of Four, Lower Income:**
- Household income $45,000 (140% FPL)
- 2025 premium: $0/year
- 2026 premium: $1,607/year
- **Impact: From free to $134/month**

**Older Couple, Above 400% FPL:**
- 60-year-old couple, income $85,000 (402% FPL)
- 2025 premium: Subsidized to ~$7,225/year (8.5% of income)
- 2026 premium: **$22,600/year** (no subsidy—over the cliff)
- **Impact: +$15,375 (213% increase)**

### Who Gets Hit Hardest

🎯 **Nearly 725,000 middle-income individuals and families** (400-500% FPL) will completely lose subsidy eligibility

👴 **Older enrollees in their 50s and 60s** face the steepest increases due to age-rated premiums

🏥 **Market destabilization**: As healthier enrollees drop coverage, premiums rise further—CBO projects 4.3% increase in 2026, 7.7% in 2027

## How to Use This Calculator

### Quick Start

1. **Visit**: [https://trexwe.github.io/aca-ptc-calculator/](https://trexwe.github.io/aca-ptc-calculator/)
2. **Enter your information**:
   - Household size
   - Primary adult age (for premium calculation)
   - Current Silver plan premium at age 21
   - Metal tier premium factors (Bronze/Gold/Platinum)
   - Expected premium increases for 2026
   - Select whether 2026 will use Enhanced or Standard PTCs
3. **Review results**: See premiums, subsidies, and net costs across 12 income levels

### Understanding the Results

The calculator shows:
- **Annual Income** at each FPL percentage
- **Monthly Premiums** for your selected metal tiers (2025 vs 2026)
- **Monthly APTC** (Advance Premium Tax Credit) - the subsidy amount
- **Net Premium** - what you actually pay after subsidies
- **Change** - dollar and percentage difference between years

### Key Scenarios to Model

1. **Subsidy Cliff**: Set income at 400-410% FPL, switch 2026 to "Standard PTC" mode
2. **Lower Income Impact**: Look at 138-200% FPL range to see benefit reduction
3. **Premium Shock**: Try 10-20% premium increases to model market instability
4. **Age Rating**: Change the adult age to 50+ to see how older adults are affected

## Policy Background

### What Are Premium Tax Credits?

The Affordable Care Act (2010) created Premium Tax Credits to help eligible households afford health insurance purchased through Healthcare.gov or state Marketplaces. The subsidy is based on:
- **Household income** (as a percentage of FPL)
- **Benchmark Silver plan premium** in your area
- **Household size and ages**

Originally (2014-2020), subsidies were only available to those earning **100-400% FPL**, and required them to pay **2-9.5% of income** toward premiums.

### Enhanced PTCs (2021-2025)

The **American Rescue Plan Act** (March 2021) temporarily expanded subsidies for 2021-2022:
- ✅ **Eliminated the 400% FPL cliff** - no upper income limit
- ✅ **Lowered required contributions** - 0-8.5% of income (instead of 2-9.5%)
- ✅ **Made more people eligible** - those above 400% FPL if premiums exceed 8.5% of income

The **Inflation Reduction Act** (August 2022) extended these enhancements **through 2025 only**.

### What Happens in 2026?

**Without new legislation**, subsidies revert to original 2014 rules on January 1, 2026:
- ❌ 400% FPL cliff returns
- ❌ Higher required income contributions (up to 9.5% vs 8.5%)
- ❌ Less generous subsidies at all income levels

### Current Status (as of November 2025)

Congress has **not yet acted** to extend enhanced PTCs beyond December 31, 2025. Extension would require new legislation and appropriations.

## For Researchers & Advocates

### Data Sources

This calculator uses:
- **CMS Age Curve Factors** for premium rating by age
- **Federal Poverty Line (FPL) data** updated annually by HHS
- **Applicable Percentage Tables** from IRS regulations (26 CFR § 1.36B-3)
- **Enhanced PTC percentages** from American Rescue Plan Act § 9661

### Assumptions & Limitations

**What this calculator models accurately:**
- Age-rated premium factors (CMS curve)
- Household size adjustments for premiums (up to 3 children counted)
- FPL percentage calculations
- APTC formulas for both Standard and Enhanced rules
- Plan metal tier premium relationships

**Limitations:**
- Uses simplified age model (single adult age for household)
- Doesn't account for geographic premium variation
- Doesn't model Cost-Sharing Reductions (CSRs)
- Premium increase projections are user estimates, not official forecasts
- Doesn't include tobacco rating or other factors

**For planning purposes only** - not a substitute for official subsidy calculators at Healthcare.gov or state Marketplaces.

### Cite This Tool

If you use this calculator in research or advocacy:

```
ACA Premium Tax Credit Calculator (2025)
https://trexwe.github.io/aca-ptc-calculator/
GitHub: trexwe/aca-ptc-calculator
License: GPL-3.0
```

## For Developers

### Tech Stack

- **React 19.1.1** - Functional components with hooks
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Create React App** - Build tooling
- **GitHub Pages** - Hosting

### Quick Start

```bash
# Clone and install
git clone https://github.com/trexwe/aca-ptc-calculator.git
cd aca-ptc-calculator
npm install

# Development server (http://localhost:3000)
npm start

# Run tests
npm test

# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Project Structure

```
src/
├── App.js          # Main component (all business logic)
├── index.js        # React entry point
├── index.css       # Global styles + Tailwind
└── App.test.js     # Tests (minimal coverage currently)
```

**Architecture**: Single-component application (all logic in `src/App.js`). See `CLAUDE.md` for detailed technical documentation.

### Contributing

Contributions welcome! Areas for enhancement:
- **Component splitting** - Break up the 411-line App.js
- **Unit tests** - Improve test coverage of calculation logic
- **TypeScript** - Add type safety
- **Accessibility** - ARIA labels, keyboard navigation
- **Data visualization** - Charts showing premium changes
- **Mobile optimization** - Better responsive design

See `CLAUDE.md` for detailed development guidelines.

### Running Locally

```bash
npm start
```

Visit `http://localhost:3000` - changes hot-reload automatically.

### Building for Production

```bash
npm run build
```

Creates optimized build in `/build` directory.

### Deployment

This project auto-deploys to GitHub Pages:

```bash
npm run deploy
```

Requires `GH_TOKEN` environment variable for authentication.

## Resources

### Official ACA Information
- [Healthcare.gov](https://www.healthcare.gov/) - Official marketplace and subsidy information
- [IRS Publication 974](https://www.irs.gov/forms-pubs/about-publication-974) - Premium Tax Credit details
- [CMS Premium Adjustment Percentage](https://www.cms.gov/cciio/resources/regulations-and-guidance/index.html)

### Policy Analysis
- [KFF](https://www.kff.org/affordable-care-act/) - Kaiser Family Foundation ACA coverage
- [Urban Institute](https://www.urban.org/policy-centers/health-policy-center) - Health policy research
- [Bipartisan Policy Center](https://bipartisanpolicy.org/health/) - ACA subsidy analysis
- [Congressional Research Service Reports](https://www.congress.gov/crs-product/R48290) - Enhanced PTC expiration analysis

### Other Subsidy Calculators
- [KFF Subsidy Calculator](https://www.kff.org/interactive/subsidy-calculator/) - Official comparison tool
- [Healthcare.gov See Plans & Prices](https://www.healthcare.gov/see-plans/) - Actual marketplace quotes

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This calculator is an **educational tool** to demonstrate how premium tax credit policies work. It is **not** official government software and should not be used as the sole basis for healthcare decisions.

For actual subsidy eligibility and amounts:
- Visit [Healthcare.gov](https://www.healthcare.gov/)
- Contact your state's Health Insurance Marketplace
- Consult with a licensed health insurance agent or navigator

**Not tax or legal advice.** Consult qualified professionals for personalized guidance.

---

**Made with React** | **Open Source** | **Last Updated: November 2025**

*This calculator was created to help people understand the potential impact of ACA subsidy policy changes. Share it with anyone who might benefit from understanding these critical healthcare affordability issues.*
