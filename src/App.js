import React, { useState, useEffect, useMemo } from 'react';

// --- Constants and Static Data ---
// By moving static data outside the component, we prevent it from being re-declared on every render.
// This is cleaner and slightly more performant.

const AGE_CURVE_DATA = {
  '0-14': 0.765, 15: 0.635, 16: 0.635, 17: 0.885, 18: 0.913, 19: 0.941, 20: 0.970,
  21: 1.000, 22: 1.000, 23: 1.000, 24: 1.004, 25: 1.004, 26: 1.048, 27: 1.048, 28: 1.087,
  29: 1.087, 30: 1.135, 31: 1.159, 32: 1.183, 33: 1.198, 34: 1.214, 35: 1.222, 36: 1.230,
  37: 1.239, 38: 1.246, 39: 1.262, 40: 1.278, 41: 1.302, 42: 1.325, 43: 1.357, 44: 1.397,
  45: 1.444, 46: 1.500, 47: 1.562, 48: 1.635, 49: 1.706, 50: 1.786, 51: 1.865, 52: 1.952,
  53: 2.040, 54: 2.135, 55: 2.230, 56: 2.333, 57: 2.437, 58: 2.548, 59: 2.603, 60: 2.714,
  61: 2.810, 62: 2.873, 63: 2.952, '64 and Older': 3.000,
};

const FPL_BASE_DATA = [
  15650, 21150, 26650, 32150, 37650, 43150, 48650, 54150,
];

// --- Helper Functions ---
// These are "pure" functions. They take inputs and return outputs without side effects.
// This makes them easy to test and reason about.

const buildAgeCurveFactors = () => {
  const factors = {};
  for (const key in AGE_CURVE_DATA) {
    if (key.includes('-')) {
      const [start, end] = key.split('-').map(Number);
      for (let i = start; i <= end; i++) factors[i] = AGE_CURVE_DATA[key];
    } else {
      factors[Number(key)] = AGE_CURVE_DATA[key];
    }
  }
  for (let i = 64; i <= 100; i++) factors[i] = AGE_CURVE_DATA['64 and Older'];
  return factors;
};

const AGE_CURVE_FACTORS = buildAgeCurveFactors();

const getFplForHousehold = (size, year, fplIncrease2026) => {
  if (size < 1) return 0;
  let baseFpl = size > 8 ? FPL_BASE_DATA[7] + (size - 8) * 5500 : FPL_BASE_DATA[size - 1];
  return year === 2026 ? baseFpl * (1 + fplIncrease2026) : baseFpl;
};

const getApplicablePercentage = (fplPercent, year, ptcType2026) => {
  const fpl = fplPercent;
  if (year === 2025 || ptcType2026 === 'enhanced') {
    if (fpl <= 150) return 0;
    if (fpl <= 200) return (0.02 / 50) * (fpl - 150);
    if (fpl <= 250) return 0.02 + (0.02 / 50) * (fpl - 200);
    if (fpl <= 300) return 0.04 + (0.025 / 50) * (fpl - 250);
    if (fpl <= 400) return 0.065 + (0.02 / 100) * (fpl - 300);
    return 0.085;
  }
  if (year === 2026 && ptcType2026 === 'standard') {
    if (fpl < 100) return 0; // Not eligible
    if (fpl < 133) return 0.02;
    if (fpl < 150) return 0.03;
    if (fpl < 200) return 0.04;
    if (fpl < 250) return 0.063;
    if (fpl < 300) return 0.0805;
    if (fpl <= 400) return 0.095;
    return -1; // Subsidy cliff
  }
  return 0;
};

const calculateHouseholdPremiumFactor = (householdSize, silverPremiumAge) => {
  if (householdSize <= 0) return 0;
  const ageFactor = AGE_CURVE_FACTORS[silverPremiumAge] || 1.278;
  if (householdSize === 1) return ageFactor;
  if (householdSize === 2) return ageFactor * 2;
  // Per ACA rules, premiums are only charged for up to 3 children.
  const childrenCount = householdSize > 2 ? Math.min(householdSize - 2, 3) : 0;
  const childFactor = AGE_CURVE_FACTORS[16] || 0.635;
  return 2 * ageFactor + childrenCount * childFactor;
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(amount);


// --- Custom Hook for Calculation Logic ---
// This hook encapsulates all the complex calculation logic.
// The main App component will use this hook to get the results, loading state, and errors.
// This is the biggest improvement for separating logic from presentation.
const useAcaCalculator = (inputs) => {
  const { householdSize, silverPremiumAge, individualSilverPremium, bronzeFactor, goldFactor, platinumFactor, premiumIncrease2026, fplIncrease2026, ptcType2026, planSelection2025, planSelection2026 } = inputs;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const householdPremiumFactor = useMemo(() => 
    calculateHouseholdPremiumFactor(householdSize, silverPremiumAge), 
    [householdSize, silverPremiumAge]
  );

  useEffect(() => {
    setLoading(true);
    setError('');

    if (householdSize < 1 || individualSilverPremium <= 0 || bronzeFactor <= 0 || goldFactor <= 0 || platinumFactor <= 0 || premiumIncrease2026 < 0 || fplIncrease2026 < 0) {
      setError('Please enter valid inputs. All premium and factor inputs must be greater than 0, household size must be 1 or more, and increases cannot be negative.');
      setLoading(false);
      return;
    }

    const familyPremiums2025 = {
      silver: individualSilverPremium * householdPremiumFactor,
      bronze: individualSilverPremium * bronzeFactor * householdPremiumFactor,
      gold: individualSilverPremium * goldFactor * householdPremiumFactor,
      platinum: individualSilverPremium * platinumFactor * householdPremiumFactor,
    };
    const familyPremiums2026 = {
      silver: familyPremiums2025.silver * (1 + premiumIncrease2026),
      bronze: familyPremiums2025.bronze * (1 + premiumIncrease2026),
      gold: familyPremiums2025.gold * (1 + premiumIncrease2026),
      platinum: familyPremiums2025.platinum * (1 + premiumIncrease2026),
    };

    const newResults = [];
    const baseFpl2025 = getFplForHousehold(householdSize, 2025, fplIncrease2026);
    const baseFpl2026 = getFplForHousehold(householdSize, 2026, fplIncrease2026);

    for (let i = 125; i <= 425; i += 25) {
      const fplPercent = i;
      const annualHouseholdIncome2025 = (baseFpl2025 * fplPercent) / 100;
      const annualHouseholdIncome2026 = annualHouseholdIncome2025 * (1 + fplIncrease2026);

      const aptcPercent2025 = getApplicablePercentage(fplPercent, 2025, ptcType2026);
      const expectedContribution2025 = annualHouseholdIncome2025 * aptcPercent2025;
      const aptc2025Annual = Math.max(0, (familyPremiums2025.silver * 12) - expectedContribution2025);
      const netPremiums2025 = {
        bronze: Math.max(0, (familyPremiums2025.bronze * 12 - aptc2025Annual) / 12),
        silver: Math.max(0, (familyPremiums2025.silver * 12 - aptc2025Annual) / 12),
        gold: Math.max(0, (familyPremiums2025.gold * 12 - aptc2025Annual) / 12),
        platinum: Math.max(0, (familyPremiums2025.platinum * 12 - aptc2025Annual) / 12),
      };

      const fplPercent2026 = (annualHouseholdIncome2026 / baseFpl2026) * 100;
      const aptcPercent2026 = getApplicablePercentage(fplPercent2026, 2026, ptcType2026);
      let aptc2026Annual = 0;
      if (ptcType2026 === 'standard' && fplPercent2026 > 400) {
        aptc2026Annual = 0;
      } else {
        const expectedContribution2026 = annualHouseholdIncome2026 * aptcPercent2026;
        aptc2026Annual = Math.max(0, (familyPremiums2026.silver * 12) - expectedContribution2026);
      }
      const netPremiums2026 = {
        bronze: Math.max(0, (familyPremiums2026.bronze * 12 - aptc2026Annual) / 12),
        silver: Math.max(0, (familyPremiums2026.silver * 12 - aptc2026Annual) / 12),
        gold: Math.max(0, (familyPremiums2026.gold * 12 - aptc2026Annual) / 12),
        platinum: Math.max(0, (familyPremiums2026.platinum * 12 - aptc2026Annual) / 12),
      };

      const premium2025 = netPremiums2025[planSelection2025] || 0;
      const premium2026 = netPremiums2026[planSelection2026] || 0;
      const netChange = premium2026 - premium2025;
      const netChangePercent = premium2025 > 0 ? (netChange / premium2025) * 100 : (netChange > 0 ? Infinity : 0);

      newResults.push({
        fplPercent,
        income2025: annualHouseholdIncome2025,
        income2026: annualHouseholdIncome2026,
        aptc2025: aptc2025Annual / 12,
        netPremium2025: premium2025,
        aptc2026: aptc2026Annual / 12,
        netPremium2026: premium2026,
        netChange,
        netChangePercent,
      });
    }

    setResults(newResults);
    setLoading(false);
  }, [householdSize, silverPremiumAge, individualSilverPremium, bronzeFactor, goldFactor, platinumFactor, premiumIncrease2026, fplIncrease2026, ptcType2026, planSelection2025, planSelection2026, householdPremiumFactor]); // Re-run the entire calculation when any input changes

  return { results, loading, error, householdPremiumFactor };
};


// --- UI Components ---
// These are "presentational" components. They receive data via props and render the UI.
// They don't contain complex logic, making them easy to read and reuse.

const Header = () => (
  <>
    <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-700 mb-2">
      Example Scenario ACA Tax Credit Comparison Tool
    </h1>
    <p className="text-center text-lg text-gray-600 mb-8">
      Compare example scenario monthly premium tax credits and net premiums for 2025 and 2026.
    </p>
  </>
);

const InputPanel = ({ inputs, setInputs }) => {
  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    const isNumeric = type === 'number';
    let parsedValue = isNumeric ? parseFloat(value) : value;

    if (id === 'premiumIncrease2026' || id === 'fplIncrease2026') {
      parsedValue = (parsedValue || 0) / 100;
    }
    
    setInputs(prev => ({ ...prev, [id]: parsedValue || (isNumeric ? 0 : '') }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
      {/* Household Size */}
      <div>
        <label htmlFor="householdSize" className="block text-sm font-semibold text-gray-700 mb-1">Household Size</label>
        <input id="householdSize" type="number" value={inputs.householdSize} onChange={handleInputChange} min="1" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"/>
      </div>
      {/* Monthly Silver Premium */}
      <div>
        <label htmlFor="individualSilverPremium" className="block text-sm font-semibold text-gray-700 mb-1">Monthly Silver Premium (Age 21)</label>
        <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">$</div>
          <input id="individualSilverPremium" type="number" value={inputs.individualSilverPremium} onChange={handleInputChange} min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-7 pr-2 py-2"/>
        </div>
      </div>
      {/* Primary Adult Age */}
      <div>
        <label htmlFor="silverPremiumAge" className="block text-sm font-semibold text-gray-700 mb-1">Primary Adult Age</label>
        <input id="silverPremiumAge" type="number" value={inputs.silverPremiumAge} onChange={handleInputChange} min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"/>
      </div>
      {/* Metal Factors */}
      <div>
        <label htmlFor="bronzeFactor" className="block text-sm font-semibold text-gray-700 mb-1">Bronze Factor</label>
        <input id="bronzeFactor" type="number" value={inputs.bronzeFactor} onChange={handleInputChange} step="0.01" min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"/>
      </div>
      <div>
        <label htmlFor="goldFactor" className="block text-sm font-semibold text-gray-700 mb-1">Gold Factor</label>
        <input id="goldFactor" type="number" value={inputs.goldFactor} onChange={handleInputChange} step="0.01" min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"/>
      </div>
      <div>
        <label htmlFor="platinumFactor" className="block text-sm font-semibold text-gray-700 mb-1">Platinum Factor</label>
        <input id="platinumFactor" type="number" value={inputs.platinumFactor} onChange={handleInputChange} step="0.01" min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"/>
      </div>
      {/* 2026 Increases */}
      <div>
        <label htmlFor="premiumIncrease2026" className="block text-sm font-semibold text-gray-700 mb-1">2026 Premium Increase (%)</label>
        <div className="relative">
          <input id="premiumIncrease2026" type="number" value={inputs.premiumIncrease2026 * 100} onChange={handleInputChange} step="1" min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"/>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">%</div>
        </div>
      </div>
      <div>
        <label htmlFor="fplIncrease2026" className="block text-sm font-semibold text-gray-700 mb-1">2026 FPL Change (%)</label>
        <div className="relative">
          <input id="fplIncrease2026" type="number" value={inputs.fplIncrease2026 * 100} onChange={handleInputChange} step="1" min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"/>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">%</div>
        </div>
      </div>
      {/* 2026 PTC Type */}
      <div>
        <label htmlFor="ptcType2026" className="block text-sm font-semibold text-gray-700 mb-1">2026 PTC Type</label>
        <select id="ptcType2026" value={inputs.ptcType2026} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2">
          <option value="standard">Standard PTC</option>
          <option value="enhanced">Enhanced PTC (If Extended)</option>
        </select>
      </div>
      {/* Plan Selections */}
      <div>
        <label htmlFor="planSelection2025" className="block text-sm font-semibold text-gray-700 mb-1">2025 Plan</label>
        <select id="planSelection2025" value={inputs.planSelection2025} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2">
          <option value="bronze">Bronze</option><option value="silver">Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option>
        </select>
      </div>
      <div>
        <label htmlFor="planSelection2026" className="block text-sm font-semibold text-gray-700 mb-1">2026 Plan</label>
        <select id="planSelection2026" value={inputs.planSelection2026} onChange={handleInputChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2">
          <option value="bronze">Bronze</option><option value="silver">Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option>
        </select>
      </div>
    </div>
  );
};

const PremiumsDisplay = ({ inputs, householdPremiumFactor }) => {
  const { individualSilverPremium, bronzeFactor, goldFactor, platinumFactor, premiumIncrease2026 } = inputs;
  
  const premiums2025 = {
    bronze: individualSilverPremium * bronzeFactor * householdPremiumFactor,
    silver: individualSilverPremium * householdPremiumFactor,
    gold: individualSilverPremium * goldFactor * householdPremiumFactor,
    platinum: individualSilverPremium * platinumFactor * householdPremiumFactor,
  };
  const premiums2026 = {
    bronze: premiums2025.bronze * (1 + premiumIncrease2026),
    silver: premiums2025.silver * (1 + premiumIncrease2026),
    gold: premiums2025.gold * (1 + premiumIncrease2026),
    platinum: premiums2025.platinum * (1 + premiumIncrease2026),
  };

  const factorDescription = () => {
    if (inputs.householdSize === 1) return `A single adult age ${inputs.silverPremiumAge}. The factor is ${AGE_CURVE_FACTORS[inputs.silverPremiumAge]?.toFixed(2) || 'N/A'}.`;
    if (inputs.householdSize === 2) return `A couple of the same age (${inputs.silverPremiumAge}). The factor is ${householdPremiumFactor.toFixed(2)}.`;
    return `A couple of the same age (${inputs.silverPremiumAge}) and ${inputs.householdSize - 2} children age 16. The factor is ${householdPremiumFactor.toFixed(2)}.`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-gray-100 rounded-lg">
      <div className="text-center md:col-span-2"><div className="text-sm text-gray-500">Calculated Household Premium Factor:<br/>{factorDescription()}</div></div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">2025 Monthly Premiums</h3>
        <div className="space-y-2">
          {Object.entries(premiums2025).map(([plan, premium]) => (
            <div key={plan} className="flex justify-between"><span className="font-semibold capitalize">{plan}:</span><span>{formatCurrency(premium)}</span></div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">2026 Monthly Premiums</h3>
        <div className="space-y-2">
          {Object.entries(premiums2026).map(([plan, premium]) => (
            <div key={plan} className="flex justify-between"><span className="font-semibold capitalize">{plan}:</span><span>{formatCurrency(premium)}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResultsTable = ({ results, inputs }) => (
  <div className="overflow-x-auto shadow-lg rounded-xl">
    <table className="w-full text-sm text-left text-gray-500 rounded-xl">
      <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-10">
        <tr>
          <th rowSpan="2" className="px-3 py-4 text-center">FPL %</th>
          <th colSpan="2" className="px-3 py-4 text-center">Annual Income</th>
          <th colSpan="2" className="px-3 py-4 text-center">2025 (Enhanced PTC)</th>
          <th colSpan="2" className="px-3 py-4 text-center">2026 ({inputs.ptcType2026 === 'standard' ? 'Standard' : 'Enhanced'} PTC)</th>
          <th colSpan="2" className="px-3 py-4 text-center">Change in Monthly Net Premium ({inputs.planSelection2025} to {inputs.planSelection2026})</th>
        </tr>
        <tr>
          <th className="px-3 py-2 text-center">2025</th><th className="px-3 py-2 text-center">2026</th>
          <th className="px-3 py-2 text-center">Monthly APTC</th><th className="px-3 py-2 text-center">Monthly Net Premium ({inputs.planSelection2025})</th>
          <th className="px-3 py-2 text-center">Monthly APTC</th><th className="px-3 py-2 text-center">Monthly Net Premium ({inputs.planSelection2026})</th>
          <th className="px-3 py-2 text-center">Change ($)</th><th className="px-3 py-2 text-center">Change (%)</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {results.map((row, index) => (
          <tr key={index} className="hover:bg-gray-100 transition-colors">
            <td className="px-3 py-2 text-center font-medium text-gray-900">{row.fplPercent}%</td>
            <td className="px-3 py-2 text-center">{formatCurrency(row.income2025)}</td>
            <td className="px-3 py-2 text-center">{formatCurrency(row.income2026)}</td>
            <td className="px-3 py-2 text-center">{formatCurrency(row.aptc2025)}</td>
            <td className="px-3 py-2 text-center font-bold text-green-700">{formatCurrency(row.netPremium2025)}</td>
            <td className="px-3 py-2 text-center">{formatCurrency(row.aptc2026)}</td>
            <td className="px-3 py-2 text-center font-bold text-red-700">{formatCurrency(row.netPremium2026)}</td>
            <td className="px-3 py-2 text-center font-bold">{formatCurrency(row.netChange)}</td>
            <td className="px-3 py-2 text-center font-bold">{row.netChangePercent === Infinity ? 'N/A' : `${row.netChangePercent.toFixed(0)}%`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


// --- Main App Component ---
// The App component is now much simpler. Its main job is to manage the state
// and compose the other components together.
export default function App() {
  const [inputs, setInputs] = useState({
    householdSize: 4,
    silverPremiumAge: 40,
    individualSilverPremium: 400,
    bronzeFactor: 0.70,
    goldFactor: 1.10,
    platinumFactor: 1.35,
    premiumIncrease2026: 0.10,
    fplIncrease2026: 0.03,
    ptcType2026: 'standard',
    planSelection2025: 'silver',
    planSelection2026: 'silver',
  });

  // The custom hook handles all the heavy lifting.
  const { results, loading, error, householdPremiumFactor } = useAcaCalculator(inputs);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto rounded-xl shadow-2xl overflow-hidden bg-white">
        <div className="p-6 sm-p-10">
          <Header />
          <InputPanel inputs={inputs} setInputs={setInputs} />
          <PremiumsDisplay inputs={inputs} householdPremiumFactor={householdPremiumFactor} />

          {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <ResultsTable results={results} inputs={inputs} />
          )}
        </div>
      </div>
    </div>
  );
}
