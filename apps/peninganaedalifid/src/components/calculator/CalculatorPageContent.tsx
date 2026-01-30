'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { CalculatorTabsNav, type CalculatorTab } from '@/components/layout/CalculatorTabsNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { useCalculator } from '@/context/CalculatorContext';
import type { Period } from '@/types/calculator';
import { formatNumber } from '@/lib/utils';
import {
  IncomeInputs,
  ExpenseInputs,
  TimeInputs,
  QuickSettingsSlider,
  ResultsDisplay,
  PlainLanguageSummary,
  LifeEnergyConverter,
  BreakdownChart,
  TimeChart,
  ExpenseRankings,
  ScenarioManager,
  ExportImportButtons,
  JobProfitLossScorecard,
} from '@/components/calculator';
import { SubscriptionBurnMeter } from '@/components/subscriptions';
import { MealCostCalculator } from '@/components/mealCost';
import { CommuteCalculator } from '@/components/commute';
import { ConvenienceExpenseTracker } from '@/components/convenience';
import { LifestyleInflationDashboard } from '@/components/lifestyleInflation';
import { HousingCalculator } from '@/components/housing';
import { ChildcareCalculator } from '@/components/childcare';
import { TravelVacationPage } from '@/components/travelVacation';
import { CarOwnershipCalculator } from '@/components/carOwnership';
import { JobOfferComparison } from '@/components/jobOffer';
import { AdditionalIncomeCalculator } from '@/components/additionalIncome';
import { RaiseCalculator } from '@/components/raise';
import { CompoundSavingsCalculator } from '@/components/savings';
import { SavingsRateCalculator } from '@/components/savingsRateSlider';
import { AutomaticSavingsCalculator } from '@/components/automaticSavings';
import { EmergencyFundCalculator } from '@/components/emergencyFund';
import { CascadingCutCalculator } from '@/components/cascading-cut';
import { DebtPayoffPage } from '@/components/debtPayoff';
import { SavingsGoalTracker } from '@/components/savingsGoal/SavingsGoalTracker';
import { SnowballCalculatorPage } from '@/components/snowball';
import { ExpenseBaselineCalculator } from '@/components/expenseBaseline';
import { CurrentExpenseReportCalculator } from '@/components/currentExpenses';
import { SavingsReportCalculator } from '@/components/savingsReport';
import { FINumberBuilderCalculator } from '@/components/fiNumber/FINumberBuilderCalculator';
import { CoastFIRECalculator } from '@/components/coastFire';
import { BaristaFIRECalculator } from '@/components/baristaFire';
import { RetirementSimulatorCalculator } from '@/components/retirementSimulator';
import { LeanFIRECalculator } from '@/components/leanFire';
import { FatFIRECalculator } from '@/components/fatFire';
import { PensionAwareFIRECalculator } from '@/components/pensionAwareFire';

// Helper to create calculator tabs with dynamic values
function createCalculatorTabs(
  actualHourlyWage: number | undefined,
  monthlyExpenses: number | undefined,
  monthlyNetIncome: number | undefined,
  monthlySavings: number | undefined,
  pensionAdjustedFI: number | undefined
): CalculatorTab[] {
  const wageValue = actualHourlyWage && actualHourlyWage > 0
    ? `${formatNumber(actualHourlyWage, 0)} kr/klst`
    : '----';

  const expenseValue = monthlyExpenses && monthlyExpenses > 0
    ? `${formatNumber(monthlyExpenses, 0)} kr/mán`
    : '----';

  const incomeValue = monthlyNetIncome && monthlyNetIncome > 0
    ? `${formatNumber(monthlyNetIncome, 0)} kr/mán`
    : '----';

  const savingsValue = monthlySavings && monthlySavings > 0
    ? `${formatNumber(monthlySavings, 0)} kr/mán`
    : '----';

  // FIRE tab shows pension-adjusted FI if available, otherwise static label
  const fireValue = pensionAdjustedFI && pensionAdjustedFI > 0
    ? `${formatNumber(pensionAdjustedFI / 1_000_000, 1)} M kr`
    : 'FI Skipulag';

  return [
    {
      id: 'timakaup',
      label: 'Raunverulegt Tímakaup',
      shortLabel: 'Tímakaup',
      value: wageValue,
    },
    {
      id: 'ahrif-innkomu',
      label: 'Tekjur',
      shortLabel: 'Tekjur',
      value: incomeValue,
    },
    {
      id: 'ahrif-sparnadar',
      label: 'Sparnaður',
      shortLabel: 'Sparnaður',
      value: savingsValue,
    },
    {
      id: 'ahrif-utgjalda',
      label: 'Útgjöld',
      shortLabel: 'Útgjöld',
      value: expenseValue,
    },
    {
      id: 'fire',
      label: 'FIRE',
      shortLabel: 'FIRE',
      value: fireValue,
    },
  ];
}

// Define expense impact calculators (Phase 2)
interface ExpenseCalculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

const EXPENSE_CALCULATORS: ExpenseCalculator[] = [
  {
    id: 'rauntimautgjold',
    name: 'Núverandi Útgjaldaskýrsla',
    description: 'Fylgstu með nákvæmum útgjöldum þínum með nákvæmum línuliðum. Mælt er með að fylla út fyrst.',
    icon: '📊',
    available: true,
  },
  {
    id: 'utgjaldareiknivel',
    name: 'Útgjaldagrunnur',
    description: 'Skilgreindu útgjöld þín á þremum stigum - Lágmarks, Þægilegt, og Lúxus.',
    icon: '📈',
    available: true,
  },
  {
    id: 'askriftir',
    name: 'Áskriftarkostnaður',
    description: 'Sjáðu hversu mikla lífsorku áskriftirnar þínar kosta og hvað þú gætir sparað ef þú fjárfestir í staðinn.',
    icon: '📺',
    available: true,
  },
  {
    id: 'vinnuferdir',
    name: 'Vinnuferðakostnaður',
    description: 'Reiknaðu raunverulegan kostnað vinnuferða þinna í tíma og peningum.',
    icon: '🚗',
    available: true,
  },
  {
    id: 'threytukostnadur',
    name: 'Vinnuþreytukostnaður',
    description: 'Fylgstu með "þreytu-skattinum" - kostnaði sem þú myndir ekki eyða ef þú værir ekki búin/n á því eftir vinnu.',
    icon: '😴',
    available: true,
  },
  {
    id: 'matur',
    name: 'Matarkostnaður',
    description: 'Berðu saman kostnað við að elda heima á móti því að borða úti.',
    icon: '🍽️',
    available: true,
  },
  {
    id: 'husnaedi',
    name: 'Húsnæðiskostnaður',
    description: 'Reiknaðu og berðu saman kostnað við leigu, veð og eignarhald á húsnæði.',
    icon: '🏠',
    available: true,
  },
  {
    id: 'bornauppeldi',
    name: 'Barna- og menntakostnaður',
    description: 'Reiknaðu kostnað við að ala upp börn - leikskóli, frístund, tímar og háskólasparnaður.',
    icon: '👶',
    available: true,
  },
  {
    id: 'lifsstilsverdbolga',
    name: 'Lífsstílsverðbólgugreining',
    description: 'Fylgstu með því hvort útgjöldin þín séu að aukast hraðar en tekjurnar og sjáðu áhrif á FI-markmið.',
    icon: '📈',
    available: true,
  },
  {
    id: 'ferdalag',
    name: 'Ferða- og fríkostnaður',
    description: 'Reiknaðu raunverulegan kostnað ferðalaga í lífsorku og sjáðu hvað þú gætir sparað.',
    icon: '✈️',
    available: true,
  },
  {
    id: 'einstaklingskaup',
    name: 'Stórkaup',
    description: 'Metið stór kaup (bíll, húsgögn, raftæki) í lífsorku og framtíðarverðmæti.',
    icon: '🛒',
    available: true,
  },
  {
    id: 'bifreida',
    name: 'Bifreiðakostnaður',
    description: 'Reiknaðu heildarkostnað bifreiðaeignar - kaup, rekstur, tryggingar og gjöld.',
    icon: '🚙',
    available: true,
  },
];

// Define income impact calculators (Phase 2.3)
interface IncomeCalculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

const INCOME_CALCULATORS: IncomeCalculator[] = [
  {
    id: 'starfshagnadur',
    name: 'Starfshagnaðarmælir',
    description: 'Greindu hvort starfið þitt sé í raun arðbært þegar allur kostnaður er tekinn með.',
    icon: '💼',
    available: true,
  },
  {
    id: 'launahaekkun',
    name: 'Launahækkun og bónusar',
    description: 'Sjáðu raunverulegt verðmæti launahækkunar eða bónuss eftir skatta og áhrif á FI-markmið.',
    icon: '📈',
    available: true,
  },
  {
    id: 'aukatekjur',
    name: 'Aukatekjur og aukavinna',
    description: 'Metið hvort aukavinnan sé þess virði - raunverulegt tímakaup eftir skatta og kostnað.',
    icon: '⏰',
    available: true,
  },
  {
    id: 'starfssamanburdur',
    name: 'Starfstilboðasamanburður',
    description: 'Berðu saman mörg starfstilboð út frá raunverulegum kostnaði og ávinningi.',
    icon: '⚖️',
    available: true,
  },
];

// Define savings impact calculators (Phase 2.2)
interface SavingsCalculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

const SAVINGS_CALCULATORS: SavingsCalculator[] = [
  {
    id: 'sparnadarskyrsla',
    name: 'Sparnaðarskýrsla',
    description: 'Fylgstu með sparnaðinum þínum í mismunandi flokkum og reiknaðu sparnaðarhlutfall.',
    icon: '💰',
    available: true,
  },
  {
    id: 'sparnadarhlutfall',
    name: 'Sparnaðarhlutfallsmælir',
    description: 'Sjáðu hvernig sparnaðarhlutfall þitt hefur áhrif á FI-dagsetninguna þína.',
    icon: '📊',
    available: true,
  },
  {
    id: 'cut-10000kr-impact',
    name: 'Niðurskurður 10.000 kr',
    description: 'Sjáðu áhrif þess að skera niður útgjöld um 10.000 kr á FI-markmiðið þitt.',
    icon: '✂️',
    available: true,
  },
  {
    id: 'vaxtavaxta',
    name: 'Vaxtavextir í lífsorku',
    description: 'Sjáðu hvernig reglulegur sparnaður vex með tímanum í lífsorku.',
    icon: '🌱',
    available: true,
  },
  {
    id: 'neydarsjodur',
    name: 'Neyðarsjóður Frelsissmælir',
    description: 'Sjáðu hversu mikið neyðarsjóðurinn þinn er í mánaðum af frelsi og lífsorku.',
    icon: '🛡️',
    available: true,
  },
  {
    id: 'skuldir-vs-fjarfesting',
    name: 'Skuldir vs fjárfesting',
    description: 'Ákveddu hvort þú átt að greiða niður skuldir eða fjárfesta aukafé.',
    icon: '⚖️',
    available: true,
  },
  {
    id: 'snjoboltareiknivel',
    name: 'Vaxtasparnaður snjóbolti',
    description: 'Sjáðu snjóboltaáhrif vaxtasparnaðar þegar þú borgar aukalega á lán.',
    icon: '❄️',
    available: true,
  },
  {
    id: 'sparnadarmarkmid',
    name: 'Sparnaðarmarkmiðsmælir',
    description: 'Fylgstu með framvindu sparnaðarmarkmiða í lífsorku og vinnutímum.',
    icon: '🎯',
    available: true,
  },
  {
    id: 'sjalfvirkur-sparnadur',
    name: 'Sjálfvirkur sparnaður',
    description: 'Sjáðu langtímaáhrif þess að setja upp sjálfvirkan sparnað.',
    icon: '🤖',
    available: true,
  },
];

// Define FIRE calculators (Epic 2)
interface FireCalculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

const FIRE_CALCULATORS: FireCalculator[] = [
  {
    id: 'fi-tala',
    name: 'FI-tala reiknivél',
    description: 'Reiknaðu FI-töluna þína (fjárhagslegt sjálfstæði) og sjáðu hve langt þú átt eftir.',
    icon: '🎯',
    available: true,
  },
  {
    id: 'fire-leidarvisi',
    name: 'FIRE Leiðarvísir',
    description: 'Kynntu þér mismunandi FIRE-aðferðir og finndu þá sem hentar þér best.',
    icon: '🧭',
    available: true,
  },
  {
    id: 'ro-fire',
    name: 'Sjálfvirkt FIRE',
    description: 'Reiknaðu Coast FIRE - hvenær þú getur hætt að spara og látið vaxtavexti vinna fyrir þig.',
    icon: '🏖️',
    available: true,
  },
  {
    id: 'halfstodvar-fire',
    name: 'Kaffiþjóna FIRE',
    description: 'Barista FIRE - sjáðu hvernig hlutastarf getur flýtt fyrir fjárhagslegu frelsi.',
    icon: '☕',
    available: true,
  },
  {
    id: 'eftirlaunahermir',
    name: 'Eftirlaunahermir',
    description: 'Monte Carlo hermun með þúsundum atburðarása til að meta líkur á árangri eftirlaunaáætlunar. Lífeyrissjóður og ellilífeyrir teknir með.',
    icon: '📊',
    available: true,
  },
  {
    id: 'lagmarks-fire',
    name: 'Lágmarks FIRE',
    description: 'LeanFIRE - náðu fjárhagslegu frelsi fljótt með lágmarksútgjöldum.',
    icon: '🥗',
    available: true,
  },
  {
    id: 'luxus-fire',
    name: 'Lúxus FIRE',
    description: 'FatFIRE - skipulagðu eftirlaunin með rýmri útgjaldamörkum og lúxus.',
    icon: '💎',
    available: true,
  },
  {
    id: 'lifeyristengd-fire',
    name: 'Lífeyristengd FIRE',
    description: 'Reiknaðu raunverulega FI-tölu með tilliti til íslenska lífeyriskerfisins.',
    icon: '🎯',
    available: true,
  },
];

/**
 * Main calculator page content component
 * Handles tab switching between wage calculator and expense impact hub
 */
export function CalculatorPageContent() {
  const [activeTab, setActiveTab] = useState('timakaup');
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const { results, currentExpenseResults, savingsReportResults, inputs, fiNumberResults } = useCalculator();

  // Get monthly gross income (before work-related costs)
  const monthlyGrossIncome = inputs.income.grossAnnualIncome
    ? inputs.income.grossAnnualIncome / 12
    : undefined;

  // Get pension-adjusted FI number (totalNeeded includes bridge amount + pension-adjusted FI)
  // Falls back to regular FI number if no pension data is entered
  const pensionAdjustedFI = fiNumberResults?.pensionAdjusted?.totalNeeded ?? fiNumberResults?.fiNumber;

  // Create dynamic tabs with actual hourly wage, monthly expenses, monthly income, monthly savings, and pension-adjusted FI values
  const calculatorTabs = createCalculatorTabs(
    results?.actualHourlyWage,
    currentExpenseResults?.totalMonthly,
    monthlyGrossIncome,
    savingsReportResults?.totalMonthlyContribution,
    pensionAdjustedFI
  );

  // Reset selected calculator when switching tabs
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedCalculator(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Site Intro Section with Tabs */}
      <section className="bg-white pt-10 md:pt-14">
        <Container size="lg">
          <div className="text-center space-y-4 pb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
              Peningana eða lífið
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
              Finndu út raunverulegan kostnað og ávinning af fjárhagslegum ákvörðunum þínum.
              Reiknaðu tímakaup, greindu útgjöld og taktu upplýstar ákvarðanir um peninga og tíma.
            </p>
          </div>
        </Container>

        {/* Calculator Tabs - positioned to merge with section below */}
        <div className="bg-white pt-4">
          <Container size="lg">
            <CalculatorTabsNav
              tabs={calculatorTabs}
              defaultTab="timakaup"
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Container>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === 'timakaup' && <WageCalculatorContent />}
      {activeTab === 'ahrif-utgjalda' && (
        <ExpenseImpactContent
          selectedCalculator={selectedCalculator}
          onSelectCalculator={setSelectedCalculator}
        />
      )}
      {activeTab === 'ahrif-sparnadar' && (
        <SavingsImpactContent
          selectedCalculator={selectedCalculator}
          onSelectCalculator={setSelectedCalculator}
        />
      )}
      {activeTab === 'ahrif-innkomu' && (
        <IncomeImpactContent
          selectedCalculator={selectedCalculator}
          onSelectCalculator={setSelectedCalculator}
        />
      )}
      {activeTab === 'fire' && (
        <FireImpactContent
          selectedCalculator={selectedCalculator}
          onSelectCalculator={setSelectedCalculator}
        />
      )}

      {/* Privacy Notice - shared by all tabs */}
      <Section className="bg-neutral-100">
        <Container size="lg">
          <div className="text-center py-4">
            <p className="text-sm text-neutral-600">
              <strong>Persónuvernd:</strong> Allir útreikningar fara fram í vafranum þínum.
              Fjárhagsgögn þín eru geymd á þínu tæki og aldrei send á neinn netþjón.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

/**
 * Wage Calculator Tab Content
 */
function WageCalculatorContent() {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 pt-8 md:pt-12 pb-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
              Raunverulegt Tímakaup
            </h2>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
              Uppgötvaðu hvað þú færð í raun fyrir hvern vinnutíma þegar falinn kostnaður er tekinn með
            </p>
            <p className="text-sm text-neutral-500 italic">
              Byggt á aðferðafræði úr bókinni „Your Money or Your Life" eftir Vicki Robin
            </p>
          </div>
        </Container>
      </section>

      {/* Overview Section - Quick Settings + Results */}
      <Section>
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Quick Settings */}
            <div className="order-2 lg:order-1">
              <QuickSettingsSlider />
            </div>

            {/* Right Column - Results (Sticky on mobile) */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-4 z-10 lg:static space-y-6">
                {/* Main Results */}
                <ResultsDisplay />

                {/* Plain Language Summary */}
                <PlainLanguageSummary />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Detailed Inputs Section */}
      <Section className="bg-white">
        <Container size="xl">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Nákvæmar stillingar
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Custom Inputs */}
            <div className="space-y-6">
              {/* Income */}
              <IncomeInputs />

              {/* Expenses */}
              <ExpenseInputs />

              {/* Time */}
              <TimeInputs />
            </div>

            {/* Right Column - Tools */}
            <div className="space-y-6">
              {/* Life Energy Converter */}
              <LifeEnergyConverter />

              {/* Scenario Management */}
              <ScenarioManager />

              {/* Export/Import */}
              <ExportImportButtons />
            </div>
          </div>
        </Container>
      </Section>

      {/* Charts Section */}
      <Section className="bg-neutral-50">
        <Container size="xl">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Nákvæm sundurliðun
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BreakdownChart />
            <TimeChart />
          </div>
          <div className="mt-8">
            <ExpenseRankings />
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * Expense Impact Hub Content
 * Shows calculator selection or the selected calculator
 */
interface ExpenseImpactContentProps {
  selectedCalculator: string | null;
  onSelectCalculator: (id: string | null) => void;
}

function ExpenseImpactContent({
  selectedCalculator,
  onSelectCalculator,
}: ExpenseImpactContentProps) {
  // If a calculator is selected, show it
  if (selectedCalculator === 'rauntimautgjold') {
    return (
      <CurrentExpenseReportContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'utgjaldareiknivel') {
    return (
      <ExpenseBaselineContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'askriftir') {
    return (
      <SubscriptionCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'matur') {
    return (
      <MealCostCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'vinnuferdir') {
    return (
      <CommuteCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'threytukostnadur') {
    return (
      <ConvenienceExpenseCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'husnaedi') {
    return (
      <HousingCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'bornauppeldi') {
    return (
      <ChildcareCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'lifsstilsverdbolga') {
    return (
      <LifestyleInflationCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'ferdalag') {
    return (
      <TravelVacationCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'einstaklingskaup') {
    return (
      <OneTimePurchaseCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  if (selectedCalculator === 'bifreida') {
    return (
      <CarOwnershipCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // Otherwise show the calculator selection hub
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 pt-8 md:pt-12 pb-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
              Áhrif útgjalda
            </h2>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
              Greindu hvernig útgjöld þín hafa áhrif á lífsorku og fjárhagslegt frelsi
            </p>
            <p className="text-sm text-neutral-500 italic">
              Veldu reiknivél til að byrja
            </p>
          </div>
        </Container>
      </section>

      {/* Calculator Selection Grid */}
      <Section>
        <Container size="xl">
          {/* Featured: Current Expense Report - DOUBLE WIDTH at TOP */}
          <Card className="mb-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => onSelectCalculator('rauntimautgjold')}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-200 flex items-center justify-center text-4xl">
                  📊
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Núverandi Útgjaldaskýrsla
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    Mælt er með að fylla út útgjaldaskýrsluna fyrst til að geta notað upplýsingarnar í öðrum útgjaldareiknivélum.
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    Fylgstu með nákvæmum útgjöldum þínum með nákvæmum línuliðum. Gögnin eru sjálfkrafa tiltæk fyrir Áskriftakostnað, Vinnuferðakostnað, Húsnæðiskostnað og fleiri reiknivélar.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCalculator('rauntimautgjold');
                    }}
                  >
                    Opna útgjaldaskýrslu →
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Regular Calculator Grid (excluding rauntimautgjold which is featured above) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPENSE_CALCULATORS.filter(calc => calc.id !== 'rauntimautgjold').map((calc) => (
              <Card
                key={calc.id}
                className={`relative overflow-hidden transition-all duration-200 ${
                  calc.available
                    ? 'hover:shadow-lg hover:border-primary-300 cursor-pointer'
                    : 'opacity-60'
                }`}
                onClick={() => calc.available && onSelectCalculator(calc.id)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-3xl">
                      {calc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {calc.name}
                        </h3>
                        {!calc.available && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-200 text-neutral-600 rounded">
                            Væntanlegt
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">
                        {calc.description}
                      </p>
                      {calc.available && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCalculator(calc.id);
                          }}
                        >
                          Opna reiknivél →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Info Section */}
      <Section className="bg-white">
        <Container size="lg">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Hvernig virka þessar reiknivélar?
            </h3>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Allar reiknivélar nota <strong>raunverulegt tímakaup</strong> þitt til að umbreyta
              krónum í lífsorku. Þannig sérðu ekki bara hvað hlutirnir kosta í peningum, heldur
              hversu margar klukkustundir af lífi þínu þú þarft að vinna fyrir þeim.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * Income Impact Hub Content
 * Shows calculator selection or the selected calculator for income/job-related tools
 */
interface IncomeImpactContentProps {
  selectedCalculator: string | null;
  onSelectCalculator: (id: string | null) => void;
}

function IncomeImpactContent({
  selectedCalculator,
  onSelectCalculator,
}: IncomeImpactContentProps) {
  // If job profit/loss scorecard is selected, show it
  if (selectedCalculator === 'starfshagnadur') {
    return (
      <JobProfitLossScorecardContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If job offer comparison is selected, show it
  if (selectedCalculator === 'starfssamanburdur') {
    return (
      <JobOfferComparisonContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If additional income calculator is selected, show it
  if (selectedCalculator === 'aukatekjur') {
    return (
      <AdditionalIncomeCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If raise/bonus calculator is selected, show it
  if (selectedCalculator === 'launahaekkun') {
    return (
      <RaiseCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // Otherwise show the calculator selection hub
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 pt-8 md:pt-12 pb-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
              Áhrif tekna
            </h2>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
              Greindu hvernig tekjur þínar hafa áhrif á lífsorku og fjárhagslegt frelsi
            </p>
            <p className="text-sm text-neutral-500 italic">
              Veldu reiknivél til að byrja
            </p>
          </div>
        </Container>
      </section>

      {/* Calculator Selection Grid */}
      <Section>
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INCOME_CALCULATORS.map((calc) => (
              <Card
                key={calc.id}
                className={`relative overflow-hidden transition-all duration-200 ${
                  calc.available
                    ? 'hover:shadow-lg hover:border-primary-300 cursor-pointer'
                    : 'opacity-60'
                }`}
                onClick={() => calc.available && onSelectCalculator(calc.id)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-3xl">
                      {calc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {calc.name}
                        </h3>
                        {!calc.available && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-200 text-neutral-600 rounded">
                            Væntanlegt
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">
                        {calc.description}
                      </p>
                      {calc.available && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCalculator(calc.id);
                          }}
                        >
                          Opna reiknivél →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Info Section */}
      <Section className="bg-white">
        <Container size="lg">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Hvernig virka þessar reiknivélar?
            </h3>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Allar reiknivélar nota <strong>raunverulegt tímakaup</strong> þitt og íslenska skattkerfið
              til að reikna út raunverulegan ávinning af tekjubreytingum. Þannig sérðu ekki bara brúttólaun,
              heldur hversu margar klukkustundir af frelsi þú færð í raun og veru.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * Savings Impact Hub Content
 * Shows calculator selection or the selected calculator for savings-related tools
 */
interface SavingsImpactContentProps {
  selectedCalculator: string | null;
  onSelectCalculator: (id: string | null) => void;
}

function SavingsImpactContent({
  selectedCalculator,
  onSelectCalculator,
}: SavingsImpactContentProps) {
  // If savings report is selected, show it
  if (selectedCalculator === 'sparnadarskyrsla') {
    return (
      <SavingsReportCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If savings rate calculator is selected, show it
  if (selectedCalculator === 'sparnadarhlutfall') {
    return (
      <SavingsRateCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If cut 10000kr impact calculator is selected, show it
  if (selectedCalculator === 'cut-10000kr-impact') {
    return (
      <CutImpactCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If compound savings calculator is selected, show it
  if (selectedCalculator === 'vaxtavaxta') {
    return (
      <CompoundSavingsCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If automatic savings calculator is selected, show it
  if (selectedCalculator === 'sjalfvirkur-sparnadur') {
    return (
      <AutomaticSavingsCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If emergency fund calculator is selected, show it
  if (selectedCalculator === 'neydarsjodur') {
    return (
      <EmergencyFundCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If debt payoff calculator is selected, show it
  if (selectedCalculator === 'skuldir-vs-fjarfesting') {
    return (
      <DebtPayoffCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If savings goal tracker is selected, show it
  if (selectedCalculator === 'sparnadarmarkmid') {
    return (
      <SavingsGoalTrackerContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If snowball calculator is selected, show it
  if (selectedCalculator === 'snjoboltareiknivel') {
    return (
      <SnowballCalculatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // Otherwise show the calculator selection hub
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 pt-8 md:pt-12 pb-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
              Áhrif sparnaðar
            </h2>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
              Sjáðu hvernig sparnaður þinn hefur áhrif á fjárhagslegt frelsi og lífsorku
            </p>
            <p className="text-sm text-neutral-500 italic">
              Veldu reiknivél til að byrja
            </p>
          </div>
        </Container>
      </section>

      {/* Calculator Selection Grid */}
      <Section>
        <Container size="xl">
          {/* Featured: Savings Report - DOUBLE WIDTH at TOP */}
          <Card className="mb-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => onSelectCalculator('sparnadarskyrsla')}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-200 flex items-center justify-center text-4xl">
                  💰
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Sparnaðarskýrsla
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    Mælt er með að fylla út sparnaðarskýrsluna fyrst til að geta notað upplýsingarnar í öðrum sparnaðarreiknivélum.
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    Fylgstu með sparnaðinum þínum í mismunandi flokkum - neyðarsjóður, skammtímasparnaður, lífeyrissjóður og fleira. Gögnin eru sjálfkrafa tiltæk fyrir sparnaðarhlutfall, neyðarsjóðsmælir og aðrar reiknivélar.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCalculator('sparnadarskyrsla');
                    }}
                  >
                    Opna sparnaðarskýrslu →
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Regular Calculator Grid (excluding sparnadarskyrsla which is featured above) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAVINGS_CALCULATORS.filter(calc => calc.id !== 'sparnadarskyrsla').map((calc) => (
              <Card
                key={calc.id}
                className={`relative overflow-hidden transition-all duration-200 ${
                  calc.available
                    ? 'hover:shadow-lg hover:border-primary-300 cursor-pointer'
                    : 'opacity-60'
                }`}
                onClick={() => calc.available && onSelectCalculator(calc.id)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-3xl">
                      {calc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {calc.name}
                        </h3>
                        {!calc.available && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-200 text-neutral-600 rounded">
                            Væntanlegt
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">
                        {calc.description}
                      </p>
                      {calc.available && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCalculator(calc.id);
                          }}
                        >
                          Opna reiknivél →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Info Section */}
      <Section className="bg-white">
        <Container size="lg">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Hvernig virka þessar reiknivélar?
            </h3>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Allar reiknivélar nota <strong>raunverulegt tímakaup</strong> þitt til að umbreyta
              sparnaði í lífsorku. Þannig sérðu ekki bara hvað þú sparar í krónum, heldur
              hversu margar klukkustundir af frelsi þú vinnur þér inn.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * FIRE Impact Hub Content
 * Shows calculator selection or the selected calculator for FIRE-related tools
 */
interface FireImpactContentProps {
  selectedCalculator: string | null;
  onSelectCalculator: (id: string | null) => void;
}

function FireImpactContent({
  selectedCalculator,
  onSelectCalculator,
}: FireImpactContentProps) {
  // If FI Number Builder is selected, show it
  if (selectedCalculator === 'fi-tala') {
    return (
      <FINumberBuilderContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If FIRE Type Explorer is selected, show it
  if (selectedCalculator === 'fire-leidarvisi') {
    return (
      <FireTypeExplorerContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If Coast FIRE is selected, show it
  if (selectedCalculator === 'ro-fire') {
    return (
      <CoastFireContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If Barista FIRE is selected, show it
  if (selectedCalculator === 'halfstodvar-fire') {
    return (
      <BaristaFireContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If Retirement Simulator is selected, show it
  if (selectedCalculator === 'eftirlaunahermir') {
    return (
      <RetirementSimulatorContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If LeanFIRE is selected, show it
  if (selectedCalculator === 'lagmarks-fire') {
    return (
      <LeanFireContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If FatFIRE is selected, show it
  if (selectedCalculator === 'luxus-fire') {
    return (
      <FatFireContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // If Pension-Aware FIRE is selected, show it
  if (selectedCalculator === 'lifeyristengd-fire') {
    return (
      <PensionAwareFIREContent onBack={() => onSelectCalculator(null)} />
    );
  }

  // Otherwise show the calculator selection hub
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 pt-8 md:pt-12 pb-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
              FIRE Reiknivélar
            </h2>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
              Skipuleggðu leiðina að fjárhagslegu frelsi með FIRE-reiknivélum
            </p>
            <p className="text-sm text-neutral-500 italic">
              Financial Independence, Retire Early - Veldu reiknivél til að byrja
            </p>
          </div>
        </Container>
      </section>

      {/* Calculator Selection Grid */}
      <Section>
        <Container size="xl">
          {/* Featured: FI Number Builder - DOUBLE WIDTH at TOP */}
          <Card className="mb-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => onSelectCalculator('fi-tala')}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-200 flex items-center justify-center text-4xl">
                  🎯
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    FI-tala reiknivél
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    Mælt er með að byrja hér - reiknaðu FI-töluna þína (fjárhagslegt sjálfstæði) til að nota í öðrum FIRE-reiknivélum.
                  </p>
                  <p className="text-sm text-neutral-600 mb-4">
                    FI-talan segir þér hversu mikið þú þarft að eiga til að lifa af arðsemi fjárfestinga. Gögnin eru sjálfkrafa tiltæk fyrir aðrar FIRE-reiknivélar.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCalculator('fi-tala');
                    }}
                  >
                    Opna FI-tölu reiknivél →
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Regular Calculator Grid (excluding fi-tala which is featured above) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FIRE_CALCULATORS.filter(calc => calc.id !== 'fi-tala').map((calc) => (
              <Card
                key={calc.id}
                className={`relative overflow-hidden transition-all duration-200 ${
                  calc.available
                    ? 'hover:shadow-lg hover:border-primary-300 cursor-pointer'
                    : 'opacity-60'
                }`}
                onClick={() => calc.available && onSelectCalculator(calc.id)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-3xl">
                      {calc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {calc.name}
                        </h3>
                        {!calc.available && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-neutral-200 text-neutral-600 rounded">
                            Væntanlegt
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">
                        {calc.description}
                      </p>
                      {calc.available && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCalculator(calc.id);
                          }}
                        >
                          Opna reiknivél →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Info Section */}
      <Section className="bg-white">
        <Container size="lg">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Hvað er FIRE?
            </h3>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              FIRE (Financial Independence, Retire Early) er hreyfing sem miðar að því að spara
              og fjárfesta nóg til að geta hætt að vinna fyrir tekjur fyrr en venjulegan eftirlaunaaldur.
              Reiknivélarnar hér hjálpa þér að skipuleggja leiðina og velja þá FIRE-aðferð sem hentar þér best.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * FI Number Builder Content
 * Integrates the FINumberBuilderCalculator component with navigation
 */
interface FINumberBuilderContentProps {
  onBack: () => void;
}

function FINumberBuilderContent({ onBack }: FINumberBuilderContentProps) {
  return (
    <>
      {/* Back button - positioned above the calculator's hero section */}
      <section className="bg-gradient-to-b from-blue-50 to-neutral-50 pt-8">
        <Container size="lg">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <span>←</span>
            <span>Til baka í FIRE reiknivélalista</span>
          </button>
        </Container>
      </section>

      {/* FI Number Builder Calculator - includes its own hero and content sections */}
      <FINumberBuilderCalculator />
    </>
  );
}

/**
 * FIRE Type Explorer Content
 */
interface FireTypeExplorerContentProps {
  onBack: () => void;
}

function FireTypeExplorerContent({ onBack }: FireTypeExplorerContentProps) {
  // Dynamically import FIRETypeExplorer to avoid circular dependencies
  const { FIRETypeExplorer } = require('@/components/fireTypes/FIRETypeExplorer');

  return <FIRETypeExplorer onBack={onBack} />;
}

/**
 * Coast FIRE Content
 * Epic 8, Task 8.2
 */
interface CoastFireContentProps {
  onBack: () => void;
}

function CoastFireContent({ onBack }: CoastFireContentProps) {
  return <CoastFIRECalculator onBack={onBack} />;
}

/**
 * Barista FIRE Content
 */
interface BaristaFireContentProps {
  onBack: () => void;
}

function BaristaFireContent({ onBack }: BaristaFireContentProps) {
  return <BaristaFIRECalculator onBack={onBack} />;
}

/**
 * Retirement Simulator Content (placeholder)
 */
interface RetirementSimulatorContentProps {
  onBack: () => void;
}

function RetirementSimulatorContent({ onBack }: RetirementSimulatorContentProps) {
  return (
    <>
      {/* Back button - positioned above the calculator's hero section */}
      <section className="bg-gradient-to-b from-purple-50 to-neutral-50 pt-8">
        <Container size="lg">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <span>←</span>
            <span>Til baka í FIRE reiknivélalista</span>
          </button>
        </Container>
      </section>

      {/* Retirement Simulator Calculator - includes its own hero and content sections */}
      <RetirementSimulatorCalculator />
    </>
  );
}

/**
 * LeanFIRE Content (placeholder)
 */
interface LeanFireContentProps {
  onBack: () => void;
}

function LeanFireContent({ onBack }: LeanFireContentProps) {
  return <LeanFIRECalculator onBack={onBack} />;
}

/**
 * FatFIRE Content (placeholder)
 */
interface FatFireContentProps {
  onBack: () => void;
}

function FatFireContent({ onBack }: FatFireContentProps) {
  return <FatFIRECalculator onBack={onBack} />;
}

/**
 * Pension-Aware FIRE Content
 * Task 8.2 - Pension-Aware FIRE Calculator
 */
interface PensionAwareFIREContentProps {
  onBack: () => void;
}

function PensionAwareFIREContent({ onBack }: PensionAwareFIREContentProps) {
  return <PensionAwareFIRECalculator onBack={onBack} />;
}

/**
 * Current Expense Report Content (with back button)
 */
interface CurrentExpenseReportContentProps {
  onBack: () => void;
}

function CurrentExpenseReportContent({ onBack }: CurrentExpenseReportContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Núverandi Útgjaldaskýrsla
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Fylgstu með nákvæmum mánaðarlegum útgjöldum þínum með nákvæmum línuliðum
              </p>
              <p className="text-sm text-neutral-500 italic">
                Mælt er með að fylla út fyrst - gögnin eru sjálfkrafa tiltæk fyrir aðrar reiknivélar
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Current Expense Report Calculator */}
      <Section>
        <Container size="xl">
          <CurrentExpenseReportCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Expense Baseline Calculator Content (with back button)
 */
interface ExpenseBaselineContentProps {
  onBack: () => void;
}

function ExpenseBaselineContent({ onBack }: ExpenseBaselineContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Útgjaldagrunnur
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Skilgreindu mánaðarleg útgjöld þín á þremum stigum - Lágmarks, Þægilegt, og Lúxus
              </p>
              <p className="text-sm text-neutral-500 italic">
                Grunnurinn að öllum FIRE-útreikningum þínum
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Expense Baseline Calculator */}
      <Section>
        <Container size="xl">
          <ExpenseBaselineCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Subscription Calculator Content (with back button)
 */
interface SubscriptionCalculatorContentProps {
  onBack: () => void;
}

function SubscriptionCalculatorContent({ onBack }: SubscriptionCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Áskriftakostnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Sjáðu hversu mikla lífsorku áskriftirnar þínar kosta og hvað þú gætir sparað í staðinn.
              </p>
              <p className="text-sm text-neutral-500 italic">
                Umbreyttu áskriftarkostnaði í vinnutíma og framtíðarverðmæti
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Subscription Burn Meter */}
      <Section>
        <Container size="xl">
          <SubscriptionBurnMeter />
        </Container>
      </Section>
    </>
  );
}

/**
 * Meal Cost Calculator Content (with back button)
 */
interface MealCostCalculatorContentProps {
  onBack: () => void;
}

function MealCostCalculatorContent({ onBack }: MealCostCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Matarkostnaðarmælir
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Berðu saman kostnað við að elda heima á móti því að borða úti
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu hversu mikla lífsorku maturinn þinn kostar
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Meal Cost Calculator */}
      <Section>
        <Container size="xl">
          <MealCostCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Commute Calculator Content (with back button)
 */
interface CommuteCalculatorContentProps {
  onBack: () => void;
}

function CommuteCalculatorContent({ onBack }: CommuteCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Vinnuferðakostnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Reiknaðu raunverulegan kostnað vinnuferða þinna í tíma og peningum
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu hversu mikla lífsorku vinnuferðir þínar kosta
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Commute Calculator */}
      <Section>
        <Container size="xl">
          <CommuteCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Convenience Expense Calculator Content (with back button)
 */
interface ConvenienceExpenseCalculatorContentProps {
  onBack: () => void;
}

function ConvenienceExpenseCalculatorContent({ onBack }: ConvenienceExpenseCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Vinnuþreytukostnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Fylgstu með "þreytu-skattinum" þínum og sjáðu áhrifin á ári
              </p>
              <p className="text-sm text-neutral-500 italic">
                Kostnaður sem þú myndir ekki eyða ef þú værir ekki útslitin eftir vinnu
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Convenience Expense Tracker */}
      <Section>
        <Container size="xl">
          <ConvenienceExpenseTracker />
        </Container>
      </Section>
    </>
  );
}

/**
 * Housing Calculator Content (with back button)
 */
interface HousingCalculatorContentProps {
  onBack: () => void;
}

function HousingCalculatorContent({ onBack }: HousingCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Húsnæðiskostnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Reiknaðu og berðu saman kostnað við leigu, veð og eignarhald
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu hversu mikla lífsorku húsnæðið þitt kostar
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Housing Calculator */}
      <Section>
        <Container size="xl">
          <HousingCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Childcare Calculator Content (with back button)
 */
interface ChildcareCalculatorContentProps {
  onBack: () => void;
}

function ChildcareCalculatorContent({ onBack }: ChildcareCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Barna- og menntakostnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Reiknaðu kostnað við að ala upp börn og skipuleggja menntun
              </p>
              <p className="text-sm text-neutral-500 italic">
                Leikskóli, frístund, tímar og háskólasparnaður
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Childcare Calculator */}
      <Section>
        <Container size="xl">
          <ChildcareCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Lifestyle Inflation Calculator Content (with back button)
 */
interface LifestyleInflationCalculatorContentProps {
  onBack: () => void;
}

function LifestyleInflationCalculatorContent({ onBack }: LifestyleInflationCalculatorContentProps) {
  const { periods, addPeriod, updatePeriod, deletePeriod, results } = useCalculator();

  const handleAddPeriod = (periodData: Omit<Period, 'id' | 'createdAt' | 'updatedAt'>) => {
    addPeriod(periodData);
  };

  const handleUpdatePeriod = (id: string, updates: Partial<Period>) => {
    updatePeriod(id, updates);
  };

  const handleDeletePeriod = (id: string) => {
    deletePeriod(id);
  };

  return (
    <>
      {/* Calculator Hero Section - continues from tab */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Lífsstílsverðbólgugreining
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Fylgstu með því hvort útgjöldin þín séu að aukast hraðar en tekjurnar
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu áhrif lífsstílsverðbólgu á FI-markmið þín
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Lifestyle Inflation Dashboard */}
      <Section>
        <Container size="xl">
          <LifestyleInflationDashboard
            periods={periods}
            actualHourlyWage={results?.actualHourlyWage}
            onAddPeriod={handleAddPeriod}
            onUpdatePeriod={handleUpdatePeriod}
            onDeletePeriod={handleDeletePeriod}
          />
        </Container>
      </Section>
    </>
  );
}

/**
 * Travel/Vacation Calculator Content (with back button)
 */
interface TravelVacationCalculatorContentProps {
  onBack: () => void;
}

function TravelVacationCalculatorContent({ onBack }: TravelVacationCalculatorContentProps) {
  const { results } = useCalculator();

  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Ferða- og fríkostnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Reiknaðu raunverulegan kostnað ferðalaga í lífsorku
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu hvað ferðir þínar kosta í vinnutímum
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Travel/Vacation Calculator */}
      <Section>
        <Container size="xl">
          <TravelVacationPage
            calculatorData={{
              actualHourlyWage: results?.actualHourlyWage ?? null,
            }}
          />
        </Container>
      </Section>
    </>
  );
}

/**
 * One-Time Purchase Calculator Content (with back button)
 */
interface OneTimePurchaseCalculatorContentProps {
  onBack: () => void;
}

function OneTimePurchaseCalculatorContent({ onBack }: OneTimePurchaseCalculatorContentProps) {
  const { results } = useCalculator();

  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Stórkaup
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Metið stór kaup í lífsorku og framtíðarverðmæti
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu hvað kaup þín kosta í vinnutímum og hvað þú gætir sparað
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* One-Time Purchase Calculator - embedded inline */}
      <Section>
        <Container size="xl">
          <OneTimePurchaseCalculator actualHourlyWage={results?.actualHourlyWage} />
        </Container>
      </Section>
    </>
  );
}

/**
 * Car Ownership Calculator Content (with back button)
 */
interface CarOwnershipCalculatorContentProps {
  onBack: () => void;
}

function CarOwnershipCalculatorContent({ onBack }: CarOwnershipCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Bifreiðakostnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Reiknaðu heildarkostnað bifreiðaeignar og berðu saman bíla
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu hvað bíllinn kostar þig í lífsorku
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Car Ownership Calculator */}
      <Section>
        <Container size="xl">
          <CarOwnershipCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Additional Income Calculator Content (with back button)
 */
interface AdditionalIncomeCalculatorContentProps {
  onBack: () => void;
}

function AdditionalIncomeCalculatorContent({ onBack }: AdditionalIncomeCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Aukatekjur og aukavinna
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Er aukavinnan þess virði? Reiknaðu raunverulegt nettó tímakaup eftir skatta og kostnað.
              </p>
              <p className="text-sm text-neutral-500 italic">
                Tekur tillit til jaðarskatts, nýrra útgjalda og viðbótartíma
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Additional Income Calculator */}
      <Section>
        <Container size="xl">
          <AdditionalIncomeCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Job Offer Comparison Calculator Content (with back button)
 */
interface JobOfferComparisonContentProps {
  onBack: () => void;
}

function JobOfferComparisonContent({ onBack }: JobOfferComparisonContentProps) {
  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Starfstilboðasamanburður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Berðu saman núverandi vinnu við starfstilboð út frá raunverulegu tímakaupi
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu hvaða tilboð gefur þér mest fyrir þína lífsorku
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Job Offer Comparison Calculator */}
      <Section>
        <Container size="xl">
          <JobOfferComparison />
        </Container>
      </Section>
    </>
  );
}

/**
 * Simple One-Time Purchase Calculator Component
 * Inline implementation for integration
 */
interface OneTimePurchaseCalculatorProps {
  actualHourlyWage?: number;
}

function OneTimePurchaseCalculator({ actualHourlyWage }: OneTimePurchaseCalculatorProps) {
  const [price, setPrice] = useState<number>(0);
  const [returnRate, setReturnRate] = useState<number>(7);

  const lifeEnergyHours = actualHourlyWage && price > 0 ? price / actualHourlyWage : 0;
  const futureValue10 = price * Math.pow(1 + returnRate / 100, 10);
  const futureValue20 = price * Math.pow(1 + returnRate / 100, 20);
  const futureValue30 = price * Math.pow(1 + returnRate / 100, 30);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('is-IS', { maximumFractionDigits: 0 }).format(value) + ' kr';
  };

  const formatHours = (hours: number) => {
    if (hours < 8) return `${hours.toFixed(1)} klst`;
    if (hours < 40) return `${(hours / 8).toFixed(1)} vinnudagar`;
    return `${(hours / 40).toFixed(1)} vinnuvikur`;
  };

  if (!actualHourlyWage) {
    return (
      <Card className="p-6">
        <div className="text-center text-neutral-600">
          <p className="text-lg font-medium mb-2">⚠️ Tímakaup vantar</p>
          <p>Reiknaðu fyrst raunverulegt tímakaup þitt í "Tímakaup" flipanum.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Kaupverð</h3>
        <div className="space-y-4">
          <CurrencyInput
            label="Verð"
            value={price}
            onChange={setPrice}
            suffix="kr"
          />
          <NumberInput
            label="Ávöxtun"
            value={returnRate}
            onChange={setReturnRate}
            min={0}
            max={15}
            step={0.5}
            suffix="%"
          />
        </div>
      </Card>

      {price > 0 && (
        <>
          {/* Life Energy */}
          <Card className="p-6 bg-primary-50">
            <h3 className="text-lg font-semibold mb-2">Lífsorka</h3>
            <p className="text-3xl font-bold text-primary-700">
              {formatHours(lifeEnergyHours)}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Þú þarft að vinna {formatHours(lifeEnergyHours)} til að borga fyrir þetta
            </p>
          </Card>

          {/* Future Value */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Framtíðarverðmæti ef fjárfest</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-neutral-500">10 ár</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(futureValue10)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500">20 ár</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(futureValue20)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500">30 ár</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(futureValue30)}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-3 text-center">
              Miðað við {returnRate}% árlega ávöxtun
            </p>
          </Card>
        </>
      )}
    </div>
  );
}

/**
 * Job Profit/Loss Scorecard Content (with back button)
 */
interface JobProfitLossScorecardContentProps {
  onBack: () => void;
}

function JobProfitLossScorecardContent({ onBack }: JobProfitLossScorecardContentProps) {
  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Starfshagnaðarmælir
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Greindu hvort starfið þitt sé í raun arðbært þegar allur kostnaður er tekinn með
              </p>
              <p className="text-sm text-neutral-500 italic">
                Fáðu heildarmynd af hagkvæmni starfsins þíns með einkunn frá A til F
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Job Profit/Loss Scorecard */}
      <Section>
        <Container size="xl">
          <JobProfitLossScorecard />
        </Container>
      </Section>

      {/* Info Section */}
      <Section className="bg-white">
        <Container size="lg">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Hvernig virkar einkunnakerfið?
            </h3>
            <div className="max-w-2xl mx-auto text-left space-y-3">
              <p className="text-neutral-600">
                Einkunnin er byggð á <strong>hlutfalli lækkunar</strong> frá brúttólaunum þínum að raunverulegu tímakaupi:
              </p>
              <ul className="space-y-2 text-neutral-600">
                <li><strong className="text-success-600">A (Framúrskarandi):</strong> Minna en 15% lækkun - mjög hagkvæmt starf</li>
                <li><strong className="text-success-600">B (Gott):</strong> 15-30% lækkun - nokkuð hagkvæmt starf</li>
                <li><strong className="text-warning-600">C (Í meðallagi):</strong> 30-45% lækkun - getur bætt sig</li>
                <li><strong className="text-warning-600">D (Slæmt):</strong> 45-60% lækkun - þarfnast úrbóta</li>
                <li><strong className="text-danger-600">F (Mjög slæmt):</strong> Yfir 60% lækkun eða neikvæð laun - alvarleg endurskoðun nauðsynleg</li>
              </ul>
              <p className="text-neutral-600 mt-4">
                Notaðu þessa einkunn til að meta hvort þú þurfir að lækka vinnukostnað,
                semja um hærri laun, eða íhuga annað starf.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

/**
 * Raise Calculator Content (with back button)
 */
interface RaiseCalculatorContentProps {
  onBack: () => void;
}

function RaiseCalculatorContent({ onBack }: RaiseCalculatorContentProps) {
  const { inputs, results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? 0;
  const grossAnnualIncome = inputs?.income?.grossAnnualIncome ?? 0;
  const workHoursPerWeek = inputs?.income?.workHoursPerWeek ?? 40;

  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Launahækkun og bónusar
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Sjáðu raunverulegt verðmæti launahækkunar eða bónuss eftir skatta
              </p>
              <p className="text-sm text-neutral-500 italic">
                Tekur tillit til íslenska skattkerfisins og áhrifa á FI-markmið
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Raise Calculator */}
      <Section>
        <Container size="xl">
          <RaiseCalculator
            actualHourlyWage={actualHourlyWage}
            grossAnnualIncome={grossAnnualIncome}
            workHoursPerWeek={workHoursPerWeek}
          />
        </Container>
      </Section>
    </>
  );
}

/**
 * Savings Rate Calculator Content (with back button)
 */
interface SavingsRateCalculatorContentProps {
  onBack: () => void;
}

function SavingsRateCalculatorContent({ onBack }: SavingsRateCalculatorContentProps) {
  const { results } = useCalculator();

  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Sparnaðarhlutfallsmælir
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Sjáðu hvernig sparnaðarhlutfall þitt hefur áhrif á FI-dagsetninguna þína
              </p>
              <p className="text-sm text-neutral-500 italic">
                Stilltu sparnaðarhlutfall og sjáðu strax áhrifin á fjármálafrelsi
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Savings Rate Calculator */}
      <Section>
        <Container size="xl">
          <SavingsRateCalculator actualHourlyWage={results?.actualHourlyWage} />
        </Container>
      </Section>
    </>
  );
}

/**
 * Compound Savings Calculator Content (with back button)
 */
interface CompoundSavingsCalculatorContentProps {
  onBack: () => void;
}

function CompoundSavingsCalculatorContent({ onBack }: CompoundSavingsCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Vaxtavextir í lífsorku
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Sjáðu hvernig reglulegur sparnaður vex með tímanum í lífsorku
              </p>
              <p className="text-sm text-neutral-500 italic">
                Kraftur samsettrar ávöxtunar umbreytt í vinnutíma
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Compound Savings Calculator */}
      <Section>
        <Container size="xl">
          <CompoundSavingsCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Automatic Savings Calculator Content (with back button)
 */
interface AutomaticSavingsCalculatorContentProps {
  onBack: () => void;
}

function AutomaticSavingsCalculatorContent({ onBack }: AutomaticSavingsCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Sjálfvirkur sparnaður
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Sjáðu langtímaáhrif þess að setja upp sjálfvirkan sparnað
              </p>
              <p className="text-sm text-neutral-500 italic">
                "Pay Yourself First" með krafti samsettrar ávöxtunar
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Automatic Savings Calculator */}
      <Section>
        <Container size="xl">
          <AutomaticSavingsCalculator />
        </Container>
      </Section>
    </>
  );
}

/**
 * Cut Impact Calculator Content (with back button)
 */
interface CutImpactCalculatorContentProps {
  onBack: () => void;
}

function CutImpactCalculatorContent({ onBack }: CutImpactCalculatorContentProps) {
  const { results, inputs, fiNumberResults, savingsReportResults, expenseBaseline } = useCalculator();

  return (
    <>
      {/* Calculator Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Niðurskurður útgjalda
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Veldu niðurskurðarmarkmið og raðaðu flokkum eftir forgangi
              </p>
              <p className="text-sm text-neutral-500 italic">
                Niðurskurður fer fyrst í efstu flokka þar til markmiði er náð
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Cascading Cut Calculator */}
      <Section>
        <Container size="xl">
          <CascadingCutCalculator
            expenseBaseline={expenseBaseline}
            actualHourlyWage={results?.actualHourlyWage ?? 0}
            fiInputs={
              fiNumberResults && savingsReportResults && inputs.income.grossAnnualIncome > 0
                ? {
                    fiNumber: fiNumberResults.pensionAdjusted?.totalNeeded ?? fiNumberResults.fiNumber,
                    savingsRate: (savingsReportResults.savingsRate ?? 0) / 100,
                    currentNetWorth: savingsReportResults.totalSavings,
                    grossAnnualIncome: inputs.income.grossAnnualIncome,
                  }
                : undefined
            }
            tier="comfortable"
          />
        </Container>
      </Section>
    </>
  );
}

/**
 * Emergency Fund Calculator Content (with back button)
 */
interface EmergencyFundCalculatorContentProps {
  onBack: () => void;
}

function EmergencyFundCalculatorContent({ onBack }: EmergencyFundCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section with back button */}
      <section className="bg-gradient-to-b from-emerald-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-4">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Main Calculator */}
      <EmergencyFundCalculator />
    </>
  );
}

/**
 * Debt Payoff Calculator Content (with back button)
 */
interface DebtPayoffCalculatorContentProps {
  onBack: () => void;
}

function DebtPayoffCalculatorContent({ onBack }: DebtPayoffCalculatorContentProps) {
  const { results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  return (
    <>
      {/* Calculator Hero Section with back button */}
      <section className="bg-gradient-to-b from-blue-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-4">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Main Calculator */}
      <DebtPayoffPage actualHourlyWage={actualHourlyWage} />
    </>
  );
}

/**
 * Savings Goal Tracker Content (with back button)
 */
interface SavingsGoalTrackerContentProps {
  onBack: () => void;
}

function SavingsGoalTrackerContent({ onBack }: SavingsGoalTrackerContentProps) {
  return (
    <>
      {/* Calculator Hero Section with back button */}
      <section className="bg-gradient-to-b from-amber-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-4">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Main Calculator */}
      <SavingsGoalTracker />
    </>
  );
}

/**
 * Snowball Calculator Content (with back button)
 */
interface SnowballCalculatorContentProps {
  onBack: () => void;
}

function SnowballCalculatorContent({ onBack }: SnowballCalculatorContentProps) {
  const { results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage ?? 0;

  return (
    <>
      {/* Calculator Hero Section with back button */}
      <section className="bg-gradient-to-b from-indigo-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-4">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Main Calculator */}
      <SnowballCalculatorPage actualHourlyWage={actualHourlyWage} />
    </>
  );
}

/**
 * Savings Report Calculator Content (with back button)
 */
interface SavingsReportCalculatorContentProps {
  onBack: () => void;
}

function SavingsReportCalculatorContent({ onBack }: SavingsReportCalculatorContentProps) {
  return (
    <>
      {/* Calculator Hero Section with back button */}
      <section className="bg-gradient-to-b from-success-50 to-neutral-50">
        <Container size="lg">
          <div className="space-y-4 pt-8 md:pt-12 pb-0">
            {/* Back button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-success-600 hover:text-success-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>Til baka í reiknivélalista</span>
            </button>

            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Sparnaðarskýrsla
              </h2>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Fylgstu með sparnaðinum þínum í mismunandi flokkum og reiknaðu sparnaðarhlutfall
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu sparnaðinn þinn í lífsorku og vinnutímum
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Calculator */}
      <Section>
        <Container size="xl">
          <SavingsReportCalculator />
        </Container>
      </Section>
    </>
  );
}
