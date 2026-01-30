/**
 * Icelandic UI text strings for FI Calculator
 * All user-facing text should be defined here for easy maintenance and translation
 */

export const FI_STRINGS = {
  // Page titles and headings
  title: 'Sparnaðarhlutfall Reiknivél',
  subtitle: 'Sjáðu hvernig sparnaður hefur áhrif á fjármálafrelsi',

  // Input labels
  inputs: {
    fiNumber: 'FI Markmið',
    fiNumberHelp: 'Heildarupphæð sem þú þarft til að vera fjárhagslega sjálfstæður',
    annualIncome: 'Árstekjur',
    annualIncomeHelp: 'Árstekjur eftir vinnutengd útgjöld',
    annualExpenses: 'Árleg útgjöld',
    annualExpensesHelp: 'Heildarútgjöld þín á ári',
    currentNetWorth: 'Núverandi eign',
    currentNetWorthHelp: 'Heildareignir þínar núna (sparnaður + fjárfestingar)',
    expectedReturn: 'Vænt ávöxtun',
    expectedReturnHelp: 'Áætluð ávöxtun fjárfestinga á ári',
    fiMultiplier: 'FI Margföldun',
    fiMultiplierHelp: '30x = 3.3% reglan (mælt með á Íslandi), 25x = 4% (áhættusamara)',
    advancedInputs: 'Ítarlegri stillingar',
  },

  // Results labels
  results: {
    fiDate: 'Fjármálafrelsi',
    yearsToFI: 'Ár til fjármálafrelsis',
    monthsToFI: 'Mánuðir til fjármálafrelsis',
    impactPer1: 'Hver 1% sparar þér',
    impactPer5: '5% meiri sparnaður',
    impactPer10: '10% meiri sparnaður',
    lifeEnergy: 'Vinnuár eftir',
    workHours: 'Vinnustundir',
    workDays: 'Vinnudagar',
    workYears: 'Vinnuár',
    currentProgress: 'Framvinda',
    monthlyInvestment: 'Mánaðarleg fjárfesting',
    annualInvestment: 'Árleg fjárfesting',
  },

  // Slider and controls
  slider: {
    savingsRate: 'Sparnaðarhlutfall',
    current: 'Núverandi',
    target: 'Markmið',
    increase5: '+5%',
    increase10: '+10%',
    increase15: '+15%',
    reset: 'Endurstilla',
  },

  // Scenarios
  scenarios: {
    add: 'Bæta við atburðarás',
    baseline: 'Grunnlína',
    optimal: 'Besta',
    compare: 'Samanburður',
    edit: 'Breyta',
    delete: 'Eyða',
    duplicate: 'Afrita',
    setAsBaseline: 'Setja sem grunnlínu',
    name: 'Nafn atburðarása',
    namePlaceholder: 'T.d. "Núverandi staða"',
    maxScenariosReached: 'Hámark 4 atburðarásir',
    noScenarios: 'Engar atburðarásir vistaðar',
    deleteConfirm: 'Ertu viss um að þú viljir eyða þessari atburðarás?',
  },

  // Progress tracking
  progress: {
    addSnapshot: 'Bæta við eftirfylgni',
    clearAll: 'Hreinsa allt',
    clearConfirm: 'Ertu viss um að þú viljir eyða öllum eftirfylgnum?',
    trend: 'Þróun',
    improving: 'Í bata',
    stable: 'Stöðugt',
    declining: 'Versnandi',
    noData: 'Ófullnægjandi gögn',
    notes: 'Athugasemdir',
    notesPlaceholder: 'Skrifaðu athugasemd hér...',
  },

  // Messages and alerts
  messages: {
    achieved: 'Þú hefur náð fjármálafrelsi!',
    achievedDetail: 'Til hamingju! Núverandi eign þín er hærri en FI markmiðið þitt.',
    negativeDescending: 'Útgjöld eru hærri en tekjur',
    negativeSavingsDetail: 'Þú getur ekki sparað með neikvæðum sparnaði. Lækkaðu útgjöld eða auktu tekjur.',
    farAway: 'Markmiðið er mjög langt í burtu',
    farAwayDetail: 'Það mun taka yfir 100 ár að ná FI markmiðinu. Íhugaðu að lækka útgjöld eða auka tekjur.',
    missingWage: 'Tímakaup vantar',
    missingWageDetail: 'Reiknaðu tímakaup þitt til að sjá lífsorku áhrif.',
    calculateWage: 'Reikna tímakaup',
  },

  // Encouragement messages for progress
  encouragement: {
    improving: 'Vel gert! Þú ert {months} mánuðum nær markmiðinu',
    improving_singular: 'Vel gert! Þú ert 1 mánuði nær markmiðinu',
    declining: 'Athugnið útgjöld eða sparnaðarhlutfall',
    stable: 'Þú ert á réttri braut',
  },

  // Time formatting
  time: {
    years: 'ár',
    year: 'ár',
    months: 'mánuðir',
    month: 'mánuður',
    and: 'og',
    earlier: 'fyrr',
    later: 'seinna',
  },

  // Validation errors
  errors: {
    fiNumberRequired: 'FI markmið er nauðsynlegt',
    fiNumberPositive: 'FI markmið verður að vera jákvæð tala',
    fiNumberTooHigh: 'FI markmið virðist vera mjög hátt',
    incomeRequired: 'Árstekjur eru nauðsynlegar',
    incomePositive: 'Árstekjur verða að vera jákvæðar',
    expensesNegative: 'Útgjöld geta ekki verið neikvæð',
    expensesExceedIncome: 'Útgjöld eru hærri en eða jöfn tekjum (0% sparnaður)',
    netWorthNegative: 'Núverandi eign getur ekki verið neikvæð',
    returnRateRange: 'Ávöxtun verður að vera á milli {min}% og {max}%',
    returnRateTooHigh: 'Ávöxtun yfir 12% er mjög bjartsýn',
    fiMultiplierRange: 'Margföldun verður að vera á milli {min}x og {max}x',
    scenarioNameRequired: 'Nafn atburðarása er nauðsynlegt',
    scenarioNameTooLong: 'Nafn má ekki vera lengra en 50 stafir',
  },

  // Buttons and actions
  actions: {
    save: 'Vista',
    cancel: 'Hætta við',
    keep: 'Halda',
    delete: 'Eyða',
    export: 'Flytja út',
    import: 'Flytja inn',
    reset: 'Endurstilla',
    calculate: 'Reikna',
    apply: 'Nota',
    close: 'Loka',
  },

  // What-if explorer
  whatIf: {
    title: 'Hvað ef...?',
    temporary: 'Tímabundin skoðun',
    keepChanges: 'Halda breytingum',
    cancelChanges: 'Hætta við',
  },
};
