'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { useCalculator } from '@/context/CalculatorContext';
import { DEFAULT_CURRENT_EXPENSE_CATEGORIES, CATEGORY_COLORS, isItemEssential } from '@/lib/constants/currentExpenses';
import { formatNumber } from '@/lib/utils';

interface ExpenseWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface WizardLineItem {
  id: string;
  label: string;
  amount: number;
  isRecurring: boolean;
  isEssential: boolean;
}

interface CategoryData {
  [categoryId: string]: WizardLineItem[];
}

// Generate unique ID for new items
const generateId = () => `wizard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Expense Wizard - Guides users through expense categories step by step
 * Keeps all data in local state until completion, then saves to context
 */
export function ExpenseWizard({ onComplete, onCancel }: ExpenseWizardProps) {
  const { updateCurrentExpenses, currentExpenses } = useCalculator();
  const [currentStep, setCurrentStep] = useState(0);
  const [customLabel, setCustomLabel] = useState('');
  const [customAmount, setCustomAmount] = useState(0);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const categories = DEFAULT_CURRENT_EXPENSE_CATEGORIES;
  const currentCategory = categories[currentStep];
  const totalSteps = categories.length;
  const isLastStep = currentStep === totalSteps - 1;

  // Initialize wizard data from existing context or empty
  const [wizardData, setWizardData] = useState<CategoryData>(() => {
    const initialData: CategoryData = {};

    // Initialize all categories
    categories.forEach(cat => {
      initialData[cat.id] = [];
    });

    // Load existing data from context if available
    if (currentExpenses?.categories) {
      currentExpenses.categories.forEach(cat => {
        if (cat.lineItems.length > 0) {
          initialData[cat.id] = cat.lineItems.map(item => ({
            id: item.id,
            label: item.label,
            amount: item.amount,
            isRecurring: item.isRecurring,
            isEssential: item.isEssential ?? isItemEssential(cat.id, item.label),
          }));
        }
      });
    }

    return initialData;
  });

  // Get current category's line items
  const lineItems = wizardData[currentCategory.id] || [];

  // Calculate running total for this category
  const categoryTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

  // Calculate grand total across all categories
  const grandTotal = useMemo(() => {
    return Object.values(wizardData).reduce((total, items) => {
      return total + items.reduce((sum, item) => sum + item.amount, 0);
    }, 0);
  }, [wizardData]);

  // Count categories with items
  const categoriesWithItems = useMemo(() => {
    return Object.values(wizardData).filter(items =>
      items.some(item => item.amount > 0)
    ).length;
  }, [wizardData]);

  // Update line items for current category
  const updateCategoryItems = (items: WizardLineItem[]) => {
    setWizardData(prev => ({
      ...prev,
      [currentCategory.id]: items,
    }));
  };

  // Add a suggested line item
  const addSuggestedItem = (label: string) => {
    const newItem: WizardLineItem = {
      id: generateId(),
      label,
      amount: 0,
      isRecurring: true,
      isEssential: isItemEssential(currentCategory.id, label),
    };
    updateCategoryItems([...lineItems, newItem]);
  };

  // Update line item amount
  const updateItemAmount = (id: string, amount: number) => {
    updateCategoryItems(
      lineItems.map(item => item.id === id ? { ...item, amount } : item)
    );
  };

  // Remove a line item
  const removeItem = (id: string) => {
    updateCategoryItems(lineItems.filter(item => item.id !== id));
  };

  // Add custom line item
  const addCustomItem = () => {
    if (customLabel.trim()) {
      const trimmedLabel = customLabel.trim();
      const newItem: WizardLineItem = {
        id: generateId(),
        label: trimmedLabel,
        amount: customAmount,
        isRecurring: true,
        isEssential: isItemEssential(currentCategory.id, trimmedLabel),
      };
      updateCategoryItems([...lineItems, newItem]);
      setCustomLabel('');
      setCustomAmount(0);
      setShowCustomForm(false);
    }
  };

  // Save all wizard data to context
  const saveAllToContext = () => {
    const newCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      lineItems: (wizardData[cat.id] || [])
        .filter(item => item.amount > 0) // Only save items with amounts
        .map(item => ({
          id: item.id,
          label: item.label,
          amount: item.amount,
          isRecurring: item.isRecurring,
          isEssential: item.isEssential,
        })),
      isCustom: false,
      isHidden: false,
      order: cat.order,
    }));

    updateCurrentExpenses({
      categories: newCategories,
      lastUpdated: new Date(),
      version: 1,
    });
  };

  // Complete wizard - save all and exit
  const completeWizard = () => {
    saveAllToContext();
    onComplete();
  };

  // Navigate to next step
  const goNext = () => {
    if (isLastStep) {
      completeWizard();
    } else {
      setCurrentStep(currentStep + 1);
      setShowCustomForm(false);
    }
  };

  // Navigate to previous step
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowCustomForm(false);
    }
  };

  // Navigate to specific step (via pills)
  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setShowCustomForm(false);
    }
  };

  // Check if item is already added
  const isItemAdded = (label: string) => lineItems.some(item => item.label === label);

  const colorClass = CATEGORY_COLORS[currentCategory.id] || 'text-gray-600 bg-gray-50 border-gray-200';

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">
            Skráning útgjalda
          </h2>
          <div className="text-right">
            <span className="text-sm text-neutral-500">
              Skref {currentStep + 1} af {totalSteps}
            </span>
            {grandTotal > 0 && (
              <p className="text-xs text-primary-600 font-medium">
                Samtals: {formatNumber(grandTotal, 0)} kr ({categoriesWithItems} flokkar)
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {categories.map((cat, index) => {
            const catItems = wizardData[cat.id] || [];
            const hasItems = catItems.some(item => item.amount > 0);

            return (
              <button
                key={cat.id}
                onClick={() => goToStep(index)}
                disabled={index > currentStep}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  index === currentStep
                    ? 'bg-primary-500 text-white'
                    : index < currentStep
                      ? hasItems
                        ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                        : 'bg-primary-100 text-primary-700 cursor-pointer hover:bg-primary-200'
                      : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {cat.icon} {cat.name} {hasItems && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Category Card */}
      <Card className={`border-2 ${colorClass}`}>
        <div className="p-6 space-y-6">
          {/* Category Header */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">{currentCategory.icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">{currentCategory.name}</h3>
              <p className="text-neutral-600">
                Veldu útgjöld sem þú hefur í þessum flokki
              </p>
            </div>
          </div>

          {/* Suggested Line Items */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">
              Algeng útgjöld í þessum flokki:
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentCategory.suggestedLineItems.map((item) => (
                <button
                  key={item}
                  onClick={() => !isItemAdded(item) && addSuggestedItem(item)}
                  disabled={isItemAdded(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isItemAdded(item)
                      ? 'bg-primary-100 text-primary-700 cursor-default'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:shadow-sm'
                  }`}
                >
                  {isItemAdded(item) ? '✓ ' : '+ '}
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Added Line Items */}
          {lineItems.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-700">
                Þín útgjöld ({lineItems.length}):
              </h4>
              <div className="space-y-2">
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200"
                  >
                    <span className="flex-1 font-medium text-neutral-900">{item.label}</span>
                    <div className="w-40">
                      <CurrencyInput
                        value={item.amount}
                        onChange={(val) => updateItemAmount(item.id, val)}
                        placeholder="0 kr"
                      />
                    </div>
                    <span className="text-xs text-neutral-500 w-16 text-right">/ mánuð</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-neutral-400 hover:text-danger-500 transition-colors"
                      title="Fjarlægja"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Running Total */}
              <div className="flex justify-end pt-2 border-t border-neutral-200">
                <div className="text-right">
                  <span className="text-sm text-neutral-500">Samtals í {currentCategory.name}: </span>
                  <span className="text-lg font-bold text-neutral-900">
                    {formatNumber(categoryTotal, 0)} kr
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Custom Item Form */}
          {showCustomForm ? (
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
              <h4 className="text-sm font-semibold text-neutral-700">Bæta við sérsniðnu útgjaldi:</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="Heiti útgjalds"
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addCustomItem();
                    if (e.key === 'Escape') setShowCustomForm(false);
                  }}
                />
                <div className="w-36">
                  <CurrencyInput
                    value={customAmount}
                    onChange={setCustomAmount}
                    placeholder="Upphæð"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={addCustomItem}>
                  Bæta við
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowCustomForm(false)}>
                  Hætta við
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomForm(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + Bæta við öðru útgjaldi
            </button>
          )}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="secondary" onClick={goBack}>
              ← Til baka
            </Button>
          )}
          <Button variant="secondary" onClick={onCancel}>
            Hætta við
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={goNext}>
            {isLastStep ? 'Sleppa' : 'Sleppa flokki'}
          </Button>
          <Button variant="primary" onClick={goNext}>
            {isLastStep ? 'Ljúka skráningu ✓' : 'Næsti flokkur →'}
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <p className="text-sm text-neutral-500 text-center">
        Gögn eru vistuð þegar þú lýkur skráningu. Þú getur alltaf breytt útgjöldum síðar.
      </p>
    </div>
  );
}
