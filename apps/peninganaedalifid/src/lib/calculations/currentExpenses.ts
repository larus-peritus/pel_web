/**
 * Current Expense Report Calculations
 *
 * Pure functions for calculating totals, breakdowns, life energy,
 * baseline comparisons, and recommendations for the Current Expense Report.
 */

import type {
  CurrentExpenseReport,
  ExpenseCategory,
  LineItem,
  CategoryBreakdown,
  LineItemSummary,
  LifeEnergyBreakdown,
  BaselineComparisonData,
  CategoryComparison,
  Recommendation,
  CurrentExpenseResults,
  EssentialBreakdown,
} from '@/types/currentExpenses';
import type { ExpenseBaseline, ExpenseTier } from '@/types/expenseBaseline';
import { calculateTierTotals } from './expenseBaseline';
import { isItemEssential } from '@/lib/constants/currentExpenses';

/**
 * Calculate total monthly and annual expenses
 */
export function calculateTotalExpenses(
  categories: ExpenseCategory[]
): { monthly: number; annual: number } {
  const activeCategories = categories.filter((c) => !c.isHidden);

  const monthly = activeCategories.reduce((sum, category) => {
    const categoryTotal = category.lineItems.reduce(
      (lineSum, item) => lineSum + item.amount,
      0
    );
    return sum + categoryTotal;
  }, 0);

  return {
    monthly,
    annual: monthly * 12,
  };
}

/**
 * Calculate category totals
 */
export function calculateCategoryTotals(
  categories: ExpenseCategory[]
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const category of categories.filter((c) => !c.isHidden)) {
    totals[category.id] = category.lineItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );
  }

  return totals;
}

/**
 * Get total for a single category
 */
export function getCategoryTotal(category: ExpenseCategory): number {
  return category.lineItems.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Calculate life energy hours for a line item
 */
export function getLineItemLifeEnergy(
  lineItem: LineItem,
  actualHourlyWage: number | null
): number | null {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;
  return lineItem.amount / actualHourlyWage;
}

/**
 * Calculate category breakdown with percentages and life energy
 */
export function calculateCategoryBreakdown(
  categories: ExpenseCategory[],
  totalMonthly: number,
  actualHourlyWage: number | null
): CategoryBreakdown[] {
  const activeCategories = categories.filter((c) => !c.isHidden);

  return activeCategories
    .map((category) => {
      const total = getCategoryTotal(category);
      const percentage = totalMonthly > 0 ? (total / totalMonthly) * 100 : 0;
      const lifeEnergyHours =
        actualHourlyWage && actualHourlyWage > 0
          ? total / actualHourlyWage
          : null;

      return {
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        total,
        percentage,
        lifeEnergyHours,
        lineItemCount: category.lineItems.length,
      };
    })
    .sort((a, b) => b.total - a.total); // Sort by total descending
}

/**
 * Calculate life energy breakdown across all expenses
 */
export function calculateLifeEnergy(
  categories: ExpenseCategory[],
  totalMonthly: number,
  actualHourlyWage: number | null
): LifeEnergyBreakdown | null {
  if (!actualHourlyWage || actualHourlyWage <= 0) return null;

  const categoryHours: Record<string, number> = {};
  const lineItemHours: Record<string, number> = {};

  const activeCategories = categories.filter((c) => !c.isHidden);

  for (const category of activeCategories) {
    let categoryTotal = 0;
    for (const lineItem of category.lineItems) {
      const hours = lineItem.amount / actualHourlyWage;
      lineItemHours[lineItem.id] = hours;
      categoryTotal += hours;
    }
    categoryHours[category.id] = categoryTotal;
  }

  return {
    totalMonthlyHours: totalMonthly / actualHourlyWage,
    totalAnnualHours: (totalMonthly * 12) / actualHourlyWage,
    categoryHours,
    lineItemHours,
  };
}

/**
 * Calculate essential vs non-essential breakdown
 */
export function calculateEssentialBreakdown(
  categories: ExpenseCategory[],
  totalMonthly: number,
  actualHourlyWage: number | null
): EssentialBreakdown {
  let essentialTotal = 0;
  let nonEssentialTotal = 0;

  const activeCategories = categories.filter((c) => !c.isHidden);

  for (const category of activeCategories) {
    for (const lineItem of category.lineItems) {
      // Use the item's isEssential flag if set, otherwise calculate from defaults
      const essential = lineItem.isEssential ?? isItemEssential(category.id, lineItem.label);

      if (essential) {
        essentialTotal += lineItem.amount;
      } else {
        nonEssentialTotal += lineItem.amount;
      }
    }
  }

  const essentialPercentage = totalMonthly > 0 ? (essentialTotal / totalMonthly) * 100 : 0;
  const nonEssentialPercentage = totalMonthly > 0 ? (nonEssentialTotal / totalMonthly) * 100 : 0;

  return {
    essentialMonthly: essentialTotal,
    nonEssentialMonthly: nonEssentialTotal,
    essentialPercentage,
    nonEssentialPercentage,
    essentialLifeEnergy: actualHourlyWage && actualHourlyWage > 0
      ? essentialTotal / actualHourlyWage
      : null,
    nonEssentialLifeEnergy: actualHourlyWage && actualHourlyWage > 0
      ? nonEssentialTotal / actualHourlyWage
      : null,
  };
}

/**
 * Get top N expenses across all categories
 */
export function getTopExpenses(
  categories: ExpenseCategory[],
  limit: number,
  actualHourlyWage: number | null
): LineItemSummary[] {
  const allLineItems: LineItemSummary[] = [];

  const activeCategories = categories.filter((c) => !c.isHidden);

  for (const category of activeCategories) {
    for (const lineItem of category.lineItems) {
      allLineItems.push({
        categoryId: category.id,
        categoryName: category.name,
        lineItemId: lineItem.id,
        label: lineItem.label,
        amount: lineItem.amount,
        lifeEnergyHours:
          actualHourlyWage && actualHourlyWage > 0
            ? lineItem.amount / actualHourlyWage
            : null,
        isRecurring: lineItem.isRecurring,
        isEssential: lineItem.isEssential ?? isItemEssential(category.id, lineItem.label),
      });
    }
  }

  return allLineItems.sort((a, b) => b.amount - a.amount).slice(0, limit);
}

/**
 * Compare current expenses to expense baseline
 */
export function compareToBaseline(
  currentExpenses: CurrentExpenseReport,
  expenseBaseline: ExpenseBaseline
): BaselineComparisonData | null {
  if (!expenseBaseline) return null;

  const currentTotal = calculateTotalExpenses(currentExpenses.categories).monthly;
  const baselineTotals = calculateTierTotals(expenseBaseline.categories);

  // Find closest tier
  const tiers: Array<{ tier: ExpenseTier; total: number }> = [
    { tier: 'barebones', total: baselineTotals.barebones },
    { tier: 'comfortable', total: baselineTotals.comfortable },
    { tier: 'deluxe', total: baselineTotals.deluxe },
  ];

  const closest = tiers.reduce((prev, curr) =>
    Math.abs(curr.total - currentTotal) < Math.abs(prev.total - currentTotal)
      ? curr
      : prev
  );

  const difference = currentTotal - closest.total;
  const differencePercentage = (difference / closest.total) * 100;

  // Category-level comparisons
  const categoryComparisons: CategoryComparison[] = [];
  const currentCategoryTotals = calculateCategoryTotals(currentExpenses.categories);

  for (const baselineCategory of expenseBaseline.categories.filter(c => !c.isHidden)) {
    const currentAmount = currentCategoryTotals[baselineCategory.id] || 0;
    const baselineAmount = baselineCategory.values[closest.tier];
    const categoryDiff = currentAmount - baselineAmount;
    const categoryDiffPercent =
      baselineAmount > 0 ? (Math.abs(categoryDiff) / baselineAmount) * 100 : 0;

    let status: 'over' | 'under' | 'match';
    if (categoryDiffPercent < 10) {
      status = 'match';
    } else if (categoryDiff > 0) {
      status = 'over';
    } else {
      status = 'under';
    }

    categoryComparisons.push({
      categoryId: baselineCategory.id,
      categoryName: baselineCategory.name,
      currentAmount,
      baselineAmount,
      difference: categoryDiff,
      status,
    });
  }

  return {
    closestTier: closest.tier,
    currentTotal,
    tierTotal: closest.total,
    difference,
    differencePercentage,
    categoryComparisons,
  };
}

/**
 * Extract actual subscriptions (from Áskriftir category)
 * Streaming services are now in the Áskriftir category
 */
export function extractSubscriptions(expenses: CurrentExpenseReport): LineItem[] {
  const subscriptionCategory = expenses.categories.find((c) => c.id === 'askriftir');
  if (!subscriptionCategory) return [];

  return subscriptionCategory.lineItems;
}

/**
 * Extract total commute expenses from transport category
 */
export function extractCommuteExpenses(expenses: CurrentExpenseReport): number {
  const transportCategory = expenses.categories.find((c) => c.id === 'samgongur');
  if (!transportCategory) return 0;

  return transportCategory.lineItems.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Extract total housing expenses from housing category
 */
export function extractHousingExpenses(expenses: CurrentExpenseReport): number {
  const housingCategory = expenses.categories.find((c) => c.id === 'husnaedi');
  if (!housingCategory) return 0;

  return housingCategory.lineItems.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Extract total expenses for a specific category
 */
export function extractCategoryExpenses(
  expenses: CurrentExpenseReport,
  categoryId: string
): number {
  const category = expenses.categories.find((c) => c.id === categoryId);
  if (!category) return 0;

  return category.lineItems.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Extract dining out expenses (restaurants, fast food, coffee shops)
 * Returns breakdown by type for detailed recommendations
 */
export function extractDiningOutExpenses(expenses: CurrentExpenseReport): {
  restaurants: number;
  fastFood: number;
  coffeeShops: number;
  total: number;
} {
  const foodCategory = expenses.categories.find((c) => c.id === 'matur');
  if (!foodCategory) return { restaurants: 0, fastFood: 0, coffeeShops: 0, total: 0 };

  let restaurants = 0;
  let fastFood = 0;
  let coffeeShops = 0;

  for (const item of foodCategory.lineItems) {
    const label = item.label.toLowerCase();

    if (label.includes('veitingasta') || label.includes('restaurant')) {
      restaurants += item.amount;
    } else if (label.includes('skyndibiti') || label.includes('fast food') || label.includes('domino') || label.includes('kfc') || label.includes('subway') || label.includes('mcdonalds')) {
      fastFood += item.amount;
    } else if (label.includes('kaffi') || label.includes('coffee') || label.includes('starbucks') || label.includes('te og kaffi')) {
      coffeeShops += item.amount;
    }
  }

  return {
    restaurants,
    fastFood,
    coffeeShops,
    total: restaurants + fastFood + coffeeShops,
  };
}

/**
 * Extract convenience/lifestyle expenses that could be reduced
 * These are expenses that are nice-to-have but not strictly necessary
 */
export function extractConvenienceExpenses(expenses: CurrentExpenseReport): {
  haircare: number;
  entertainment: number;
  workLunch: number;
  total: number;
} {
  let haircare = 0;
  let entertainment = 0;
  let workLunch = 0;

  // Personal care - haircuts etc.
  const personalCategory = expenses.categories.find((c) => c.id === 'personuleg');
  if (personalCategory) {
    for (const item of personalCategory.lineItems) {
      const label = item.label.toLowerCase();
      if (label.includes('hár') || label.includes('hair') || label.includes('rakning')) {
        haircare += item.amount;
      }
    }
  }

  // Entertainment category total
  const entertainmentCategory = expenses.categories.find((c) => c.id === 'afthreying');
  if (entertainmentCategory) {
    entertainment = entertainmentCategory.lineItems.reduce((sum, item) => sum + item.amount, 0);
  }

  // Work lunch from food category
  const foodCategory = expenses.categories.find((c) => c.id === 'matur');
  if (foodCategory) {
    for (const item of foodCategory.lineItems) {
      const label = item.label.toLowerCase();
      if (label.includes('vinnuhádegi') || label.includes('hádegi') || label.includes('lunch')) {
        workLunch += item.amount;
      }
    }
  }

  return {
    haircare,
    entertainment,
    workLunch,
    total: haircare + entertainment + workLunch,
  };
}

/**
 * Generate recommendations based on expense patterns
 */
export function generateRecommendations(
  currentExpenses: CurrentExpenseReport,
  results: CurrentExpenseResults,
  expenseBaseline: ExpenseBaseline | null
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Subscription recommendation
  const subscriptions = extractSubscriptions(currentExpenses);
  const subscriptionTotal = subscriptions.reduce((sum, item) => sum + item.amount, 0);
  if (subscriptionTotal > 10000) {
    recommendations.push({
      id: 'sub-recommendation',
      type: 'subscription',
      title: 'Áskriftir eru verulegur hluti útgjalda',
      message: `Þú ert að eyða ${subscriptionTotal.toLocaleString('is-IS')} kr í áskriftir á mánuði. Farðu yfir áskriftirnar og íhugaðu hvort þú notir þær allar.`,
      priority: subscriptionTotal > 20000 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Commute recommendation
  const commuteCosts = extractCommuteExpenses(currentExpenses);
  if (commuteCosts > 30000) {
    recommendations.push({
      id: 'commute-recommendation',
      type: 'commute',
      title: 'Samgöngur eru há í útgjöldum',
      message: `Samgöngukostnaður er ${commuteCosts.toLocaleString('is-IS')} kr á mánuði. Íhugaðu hvort hægt sé að lækka þennan kostnað.`,
      priority: commuteCosts > 50000 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Housing recommendation
  const housingCosts = extractHousingExpenses(currentExpenses);
  const housingPercentage = (housingCosts / results.totalMonthly) * 100;
  if (housingPercentage > 30) {
    recommendations.push({
      id: 'housing-recommendation',
      type: 'housing',
      title: 'Húsnæði er stór hluti útgjalda',
      message: `Húsnæði er ${housingPercentage.toFixed(1)}% af útgjöldum. Almenn viðmið eru 25-30% af tekjum.`,
      priority: housingPercentage > 40 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Dining out recommendation (restaurants, fast food, coffee shops)
  const diningOut = extractDiningOutExpenses(currentExpenses);
  if (diningOut.total > 15000) {
    // Build detailed message based on what they're spending on
    const parts: string[] = [];
    if (diningOut.restaurants > 0) parts.push(`veitingastaði (${diningOut.restaurants.toLocaleString('is-IS')} kr)`);
    if (diningOut.fastFood > 0) parts.push(`skyndibiti (${diningOut.fastFood.toLocaleString('is-IS')} kr)`);
    if (diningOut.coffeeShops > 0) parts.push(`kaffihús (${diningOut.coffeeShops.toLocaleString('is-IS')} kr)`);

    const breakdown = parts.length > 0 ? ` Þar af: ${parts.join(', ')}.` : '';

    recommendations.push({
      id: 'dining-recommendation',
      type: 'dining',
      title: 'Útgjöld í mat utan heimilis',
      message: `Þú eyðir ${diningOut.total.toLocaleString('is-IS')} kr á mánuði í mat utan heimilis.${breakdown} Að elda heima gæti sparað verulega.`,
      priority: diningOut.total > 40000 ? 'high' : diningOut.total > 25000 ? 'medium' : 'low',
      dismissable: true,
    });
  }

  // Fast food specific recommendation (if significant)
  if (diningOut.fastFood > 10000) {
    recommendations.push({
      id: 'fastfood-recommendation',
      type: 'dining',
      title: 'Skyndibiti er verulegur kostnaður',
      message: `Þú eyðir ${diningOut.fastFood.toLocaleString('is-IS')} kr í skyndibiti á mánuði. Þetta er bæði dýrt og oft óhollara en heimaeldaður matur.`,
      priority: diningOut.fastFood > 20000 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Coffee shop recommendation (if significant)
  if (diningOut.coffeeShops > 8000) {
    // Calculate how many coffees this is (assuming ~700 kr per coffee on average)
    const estimatedCoffees = Math.round(diningOut.coffeeShops / 700);
    recommendations.push({
      id: 'coffee-recommendation',
      type: 'convenience',
      title: 'Kaffihúsavenja kostar',
      message: `Þú eyðir ${diningOut.coffeeShops.toLocaleString('is-IS')} kr í kaffihús á mánuði (u.þ.b. ${estimatedCoffees} kaffi). Kaffi heima kostar brot af þessu.`,
      priority: diningOut.coffeeShops > 15000 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Convenience expenses recommendation
  const convenience = extractConvenienceExpenses(currentExpenses);

  // Work lunch recommendation
  if (convenience.workLunch > 15000) {
    // Calculate average per day (assuming 22 work days)
    const avgPerDay = Math.round(convenience.workLunch / 22);
    recommendations.push({
      id: 'worklunch-recommendation',
      type: 'convenience',
      title: 'Vinnuhádegismatur er kostnaðarsamur',
      message: `Þú eyðir ${convenience.workLunch.toLocaleString('is-IS')} kr í vinnuhádegismat á mánuði (u.þ.b. ${avgPerDay.toLocaleString('is-IS')} kr á dag). Að taka nesti með gæti sparað þúsundir.`,
      priority: convenience.workLunch > 25000 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Entertainment recommendation (if high relative to total)
  if (convenience.entertainment > 20000) {
    const entertainmentPercentage = (convenience.entertainment / results.totalMonthly) * 100;
    recommendations.push({
      id: 'entertainment-recommendation',
      type: 'convenience',
      title: 'Afþreying er stór hluti útgjalda',
      message: `Þú eyðir ${convenience.entertainment.toLocaleString('is-IS')} kr í afþreyingu á mánuði (${entertainmentPercentage.toFixed(1)}% af útgjöldum). Íhugaðu ókeypis eða ódýrari afþreyingu.`,
      priority: entertainmentPercentage > 10 ? 'high' : 'medium',
      dismissable: true,
    });
  }

  // Baseline comparison recommendation
  if (expenseBaseline && results.baselineComparison) {
    const { difference } = results.baselineComparison;
    if (Math.abs(difference) > 50000) {
      recommendations.push({
        id: 'baseline-recommendation',
        type: 'baseline',
        title: 'Verulegur munur á raunverulegum útgjöldum og áætlun',
        message: `Núverandi útgjöld eru ${Math.abs(difference).toLocaleString('is-IS')} kr ${difference > 0 ? 'yfir' : 'undir'} áætlun. Íhugaðu að uppfæra útgjaldagrunn.`,
        actionUrl: '/utgjaldareiknivel',
        actionLabel: 'Uppfæra útgjaldagrunn',
        priority: Math.abs(difference) > 100000 ? 'high' : 'medium',
        dismissable: true,
      });
    }
  }

  // Essential vs Non-Essential breakdown recommendation
  // Always show this as informational (low priority)
  if (results.essentialBreakdown && results.totalMonthly > 0) {
    const { essentialMonthly, nonEssentialMonthly, nonEssentialPercentage } = results.essentialBreakdown;

    // Determine priority based on non-essential percentage
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (nonEssentialPercentage > 40) {
      priority = 'high';
    } else if (nonEssentialPercentage > 25) {
      priority = 'medium';
    }

    recommendations.push({
      id: 'essential-recommendation',
      type: 'essential',
      title: 'Skipting nauðsynlegra og valkvæðra útgjalda',
      message: `Nauðsynleg útgjöld eru ${essentialMonthly.toLocaleString('is-IS')} kr og valkvæð útgjöld eru ${nonEssentialMonthly.toLocaleString('is-IS')} kr (${nonEssentialPercentage.toFixed(0)}% af heildarútgjöldum).`,
      priority,
      dismissable: true,
    });
  }

  // Sort by priority
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Calculate complete current expense results
 */
export function calculateCurrentExpenseResults(
  expenses: CurrentExpenseReport,
  actualHourlyWage: number | null,
  expenseBaseline: ExpenseBaseline | null
): CurrentExpenseResults {
  const { monthly: totalMonthly, annual: totalAnnual } = calculateTotalExpenses(
    expenses.categories
  );

  const categoryBreakdown = calculateCategoryBreakdown(
    expenses.categories,
    totalMonthly,
    actualHourlyWage
  );

  // Get all expenses sorted by amount (component will handle limiting display)
  const topExpenses = getTopExpenses(expenses.categories, 999, actualHourlyWage);

  const lifeEnergy = calculateLifeEnergy(
    expenses.categories,
    totalMonthly,
    actualHourlyWage
  );

  const essentialBreakdown = calculateEssentialBreakdown(
    expenses.categories,
    totalMonthly,
    actualHourlyWage
  );

  const baselineComparison = expenseBaseline
    ? compareToBaseline(expenses, expenseBaseline)
    : null;

  const results: CurrentExpenseResults = {
    totalMonthly,
    totalAnnual,
    categoryBreakdown,
    topExpenses,
    lifeEnergy,
    essentialBreakdown,
    baselineComparison,
    recommendations: [], // Will be populated next
  };

  const recommendations = generateRecommendations(expenses, results, expenseBaseline);

  results.recommendations = recommendations;

  return results;
}
