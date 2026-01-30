'use client';

import { JobComparisonResult } from '@/types/jobOffer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatISK } from '@/lib/calculations/jobOfferComparison';

interface ComparisonResultsProps {
  comparison: JobComparisonResult;
}

export default function ComparisonResults({ comparison }: ComparisonResultsProps) {
  const { offers, metrics, bestOfferId, plainLanguageSummary, monthlyNetDifference } =
    comparison;

  // Get metrics for each offer
  const getMetricForOffer = (offerId: string) =>
    metrics.find((m) => m.offerId === offerId)!;

  return (
    <div className="space-y-6">
      {/* Plain Language Summary */}
      <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Niðurstaða samanburðar
              </h3>
              <p className="text-neutral-700 leading-relaxed">{plainLanguageSummary}</p>
              {Math.abs(monthlyNetDifference) > 0 && (
                <p className="text-sm text-primary-700 mt-2 font-medium">
                  Munur á nettó tekjum:{' '}
                  {monthlyNetDifference > 0 ? '+' : ''}
                  {formatISK(monthlyNetDifference)} kr/mán
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Comparison Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Ítarlegur samanburður
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Mælikvarði
                  </th>
                  {offers.map((offer) => {
                    const isBest = offer.id === bestOfferId;
                    return (
                      <th
                        key={offer.id}
                        className={`text-right py-3 px-4 text-sm font-semibold ${
                          isBest ? 'text-primary-600' : 'text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {offer.name}
                          {isBest && (
                            <Badge variant="success" size="sm">
                              Betra
                            </Badge>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Monthly Salary */}
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4 text-sm text-neutral-700">Mánaðarlaun</td>
                  {offers.map((offer) => (
                    <td
                      key={offer.id}
                      className="py-3 px-4 text-sm text-right text-neutral-900"
                    >
                      {formatISK(offer.monthlySalary)} kr/mán
                    </td>
                  ))}
                </tr>

                {/* Annual Salary */}
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4 text-sm text-neutral-700">Árslaun</td>
                  {metrics.map((metric) => (
                    <td
                      key={metric.offerId}
                      className="py-3 px-4 text-sm text-right text-neutral-900"
                    >
                      {formatISK(metric.annualSalary)} kr
                    </td>
                  ))}
                </tr>

                {/* Benefits */}
                {metrics.some((m) => m.annualBenefits > 0) && (
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 text-sm text-neutral-700">Fríðindi (á ári)</td>
                    {metrics.map((metric) => (
                      <td
                        key={metric.offerId}
                        className="py-3 px-4 text-sm text-right text-neutral-900"
                      >
                        {metric.annualBenefits > 0
                          ? `${formatISK(metric.annualBenefits)} kr`
                          : '—'}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Total Compensation */}
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <td className="py-3 px-4 text-sm font-medium text-neutral-800">
                    Heildartekjur
                  </td>
                  {metrics.map((metric) => (
                    <td
                      key={metric.offerId}
                      className="py-3 px-4 text-sm text-right text-neutral-900 font-medium"
                    >
                      {formatISK(metric.totalCompensation)} kr/ár
                    </td>
                  ))}
                </tr>

                {/* Expenses & Commute Cost */}
                {metrics.some((m) => m.annualExpenses > 0 || m.annualCommuteCost > 0) && (
                  <>
                    <tr className="border-b border-neutral-100">
                      <td className="py-3 px-4 text-sm text-neutral-700">
                        Útgjöld vegna vinnu (á ári)
                      </td>
                      {metrics.map((metric) => (
                        <td
                          key={metric.offerId}
                          className="py-3 px-4 text-sm text-right text-danger-600"
                        >
                          {metric.annualExpenses > 0
                            ? `-${formatISK(metric.annualExpenses)} kr`
                            : '—'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-3 px-4 text-sm text-neutral-700">
                        Ferðakostnaður (á ári)
                      </td>
                      {metrics.map((metric) => (
                        <td
                          key={metric.offerId}
                          className="py-3 px-4 text-sm text-right text-danger-600"
                        >
                          {metric.annualCommuteCost > 0
                            ? `-${formatISK(metric.annualCommuteCost)} kr`
                            : '—'}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* Net Compensation */}
                <tr className="border-b border-neutral-100 bg-success-50">
                  <td className="py-3 px-4 text-sm font-medium text-neutral-800">
                    Nettó tekjur
                  </td>
                  {metrics.map((metric) => {
                    const isBest = metric.offerId === bestOfferId;
                    return (
                      <td
                        key={metric.offerId}
                        className={`py-3 px-4 text-sm text-right font-medium ${
                          isBest ? 'text-success-700' : 'text-neutral-900'
                        }`}
                      >
                        {formatISK(metric.netAnnualCompensation)} kr/ár
                        <div className="text-xs font-normal text-neutral-600">
                          ({formatISK(metric.netAnnualCompensation / 12)} kr/mán)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Divider */}
                <tr>
                  <td colSpan={3} className="py-2">
                    <div className="border-t-2 border-neutral-200"></div>
                  </td>
                </tr>

                {/* Weekly Hours */}
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4 text-sm text-neutral-700">Vinnustundir/viku</td>
                  {offers.map((offer) => (
                    <td
                      key={offer.id}
                      className="py-3 px-4 text-sm text-right text-neutral-900"
                    >
                      {offer.weeklyHours} klst
                    </td>
                  ))}
                </tr>

                {/* Annual Work Hours */}
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4 text-sm text-neutral-700">Vinnustundir á ári</td>
                  {metrics.map((metric) => (
                    <td
                      key={metric.offerId}
                      className="py-3 px-4 text-sm text-right text-neutral-900"
                    >
                      {formatISK(metric.annualWorkHours)} klst
                    </td>
                  ))}
                </tr>

                {/* Commute Hours */}
                <tr className="border-b border-neutral-100">
                  <td className="py-3 px-4 text-sm text-neutral-700">Ferðastundir á ári</td>
                  {metrics.map((metric) => (
                    <td
                      key={metric.offerId}
                      className="py-3 px-4 text-sm text-right text-neutral-900"
                    >
                      {metric.annualCommuteHours > 0
                        ? `${formatISK(metric.annualCommuteHours)} klst`
                        : '—'}
                    </td>
                  ))}
                </tr>

                {/* Total Annual Hours */}
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <td className="py-3 px-4 text-sm font-semibold text-neutral-900">
                    Heildartími á ári
                  </td>
                  {metrics.map((metric) => {
                    const isBest = metric.offerId === bestOfferId;
                    return (
                      <td
                        key={metric.offerId}
                        className={`py-3 px-4 text-sm text-right font-semibold ${
                          isBest ? 'text-primary-600' : 'text-neutral-900'
                        }`}
                      >
                        {formatISK(metric.totalAnnualHours)} klst
                        <div className="text-xs font-normal text-neutral-600 mt-0.5">
                          ({Math.round(metric.totalAnnualHours / 8)} dagar)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Actual Hourly Wage - HIGHLIGHT */}
                <tr className="bg-primary-50 border-b-2 border-primary-200">
                  <td className="py-4 px-4 text-sm font-bold text-neutral-900">
                    ⭐ Raunverulegt tímakaup
                  </td>
                  {metrics.map((metric) => {
                    const isBest = metric.offerId === bestOfferId;
                    const bestMetric = metrics.find((m) => m.offerId === bestOfferId)!;
                    const diff = metric.actualHourlyWage - bestMetric.actualHourlyWage;
                    return (
                      <td
                        key={metric.offerId}
                        className={`py-4 px-4 text-right font-bold ${
                          isBest ? 'text-primary-600' : 'text-neutral-900'
                        }`}
                      >
                        <div className="text-lg">
                          {formatISK(metric.actualHourlyWage)} kr/klst
                        </div>
                        {!isBest && diff !== 0 && (
                          <div className="text-xs font-normal text-danger-600 mt-1">
                            ({formatISK(diff)} kr/klst)
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Life Energy Perspective */}
      <Card className="bg-neutral-50">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Lífsorkuljósi</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => {
              const offer = offers.find((o) => o.id === metric.offerId)!;
              const isBest = metric.offerId === bestOfferId;
              const days = Math.round(metric.totalAnnualHours / 8);
              const weeks = Math.round((metric.totalAnnualHours / 40) * 10) / 10;

              return (
                <div
                  key={metric.offerId}
                  className={`p-4 rounded-lg border-2 ${
                    isBest
                      ? 'bg-primary-50 border-primary-300'
                      : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-neutral-900">{offer.name}</h4>
                    {isBest && <span className="text-lg">🏆</span>}
                  </div>

                  <div className="space-y-2 text-sm text-neutral-700">
                    <div>
                      <div className="text-neutral-600">Lífsorka á ári:</div>
                      <div className="font-semibold text-lg text-neutral-900">
                        {formatISK(metric.totalAnnualHours)} stundir
                      </div>
                      <div className="text-xs text-neutral-600">
                        ≈ {days} dagar eða {weeks} vikur
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <div className="text-neutral-600">Virði hverrar stundar:</div>
                      <div className="font-semibold text-primary-600">
                        {formatISK(metric.actualHourlyWage)} kr
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <div className="text-neutral-600">Nettó á mánuði:</div>
                      <div className="font-semibold text-success-600">
                        {formatISK(metric.netAnnualCompensation / 12)} kr
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
