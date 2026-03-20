export interface Fund {
  name: string;
  shortName: string;
  category: string;
  xirr: number;
  currentValue: number;
  investedValue: number;
  expenseRatio: number;
  plan: 'Regular' | 'Direct';
}

export const funds: Fund[] = [
  { name: 'Mirae Asset Large Cap Fund', shortName: 'Mirae Large', category: 'Large Cap', xirr: 11.2, currentValue: 240000, investedValue: 195000, expenseRatio: 1.72, plan: 'Regular' },
  { name: 'Axis Bluechip Fund', shortName: 'Axis Blue', category: 'Large Cap', xirr: 9.8, currentValue: 185000, investedValue: 160000, expenseRatio: 1.65, plan: 'Regular' },
  { name: 'Parag Parikh Flexi Cap Fund', shortName: 'PPFAS Flexi', category: 'Flexi Cap', xirr: 14.3, currentValue: 310000, investedValue: 230000, expenseRatio: 1.33, plan: 'Regular' },
  { name: 'SBI Small Cap Fund', shortName: 'SBI Small', category: 'Small Cap', xirr: 18.1, currentValue: 90000, investedValue: 62000, expenseRatio: 2.15, plan: 'Regular' },
  { name: 'HDFC Mid-Cap Opportunities Fund', shortName: 'HDFC Mid', category: 'Mid Cap', xirr: 13.7, currentValue: 75000, investedValue: 58000, expenseRatio: 1.91, plan: 'Regular' },
];

export const portfolioScore = 72;
export const portfolioXirr = 11.4;
export const niftyXirr = 13.2;
export const totalCorpus = 800000;
export const totalInvested = 705000;
export const weightedExpenseRatio = 1.82;
export const tenYearExpenseDrag = 324000;

export const scoreBreakdown = [
  { category: 'Returns Quality', score: 22, max: 30 },
  { category: 'Diversification', score: 18, max: 25 },
  { category: 'Cost Efficiency', score: 17, max: 25 },
  { category: 'Consistency', score: 15, max: 20 },
];

export const overlapMatrix: Record<string, Record<string, number>> = {
  'Mirae Large': { 'Mirae Large': 100, 'Axis Blue': 58, 'PPFAS Flexi': 22, 'SBI Small': 8, 'HDFC Mid': 15 },
  'Axis Blue': { 'Mirae Large': 58, 'Axis Blue': 100, 'PPFAS Flexi': 19, 'SBI Small': 5, 'HDFC Mid': 31 },
  'PPFAS Flexi': { 'Mirae Large': 22, 'Axis Blue': 19, 'PPFAS Flexi': 100, 'SBI Small': 12, 'HDFC Mid': 14 },
  'SBI Small': { 'Mirae Large': 8, 'Axis Blue': 5, 'PPFAS Flexi': 12, 'SBI Small': 100, 'HDFC Mid': 18 },
  'HDFC Mid': { 'Mirae Large': 15, 'Axis Blue': 31, 'PPFAS Flexi': 14, 'SBI Small': 18, 'HDFC Mid': 100 },
};

export const timelineData = [
  { year: '2019', invested: 120000, value: 118000 },
  { year: '2020', invested: 240000, value: 210000 },
  { year: '2021', invested: 380000, value: 420000 },
  { year: '2022', invested: 500000, value: 485000 },
  { year: '2023', invested: 620000, value: 650000 },
  { year: '2024', invested: 705000, value: 800000 },
];

export const recommendations = [
  {
    priority: 'High Priority' as const,
    action: 'Switch Axis Bluechip Fund from Regular to Direct plan',
    reason: 'Saves ₹12,400/year in expense ratio',
  },
  {
    priority: 'High Priority' as const,
    action: 'Reduce overlap: exit Axis Bluechip, consolidate into Mirae Asset Large Cap',
    reason: '58% holdings overlap — you\'re paying double AMC fees for similar exposure',
  },
  {
    priority: 'Consider' as const,
    action: 'Add an international fund for geographical diversification',
    reason: '100% India exposure adds concentration risk',
  },
];

export const formatCurrency = (value: number): string => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};
