const VERDICT = {
  violation: { label: '위반 가능성 높음', cls: 'bg-alert-bg text-alert border-alert', bar: 'bg-alert' },
  suspected: { label: '위반 의심', cls: 'bg-caution-bg text-caution border-caution', bar: 'bg-caution' },
  safe: { label: '위반 사항 없음', cls: 'bg-safe-bg text-safe border-safe', bar: 'bg-safe' },
}

const SEVERITY = {
  high: { label: '심각', cls: 'bg-alert text-white' },
  medium: { label: '주의', cls: 'bg-caution-bg text-caution' },
  low: { label: '경미', cls: 'bg-paper text-ink-soft border border-line' },
}

export default function ResultReport({ result }) {
  const v = VERDICT[result.verdict] ?? VERDICT.suspected
  const date = new Date(result.analyzedAt).toLocaleString('ko-KR')

  return (
    <article className="rounded-lg border border-line bg-white" aria-live="polite">
      {/* 판정 요약 */}
      <header className="border-b border-line p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`rounded-md border px-3 py-1 text-sm font-bold ${v.cls}`}>{v.label}</span>
          <span className="text-sm text-ink-soft">분석 시각 {date}</span>
        </div>
        <p className="mt-4 break-all text-sm text-ink-soft">{result.url}</p>
        <p className="mt-2 text-xl font-semibold leading-snug">{result.summary}</p>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-ink-soft">위험도</span>
            <span className="font-bold tabular-nums">{result.riskScore} / 100</span>
          </div>
          <div
            className="mt-1 h-2 overflow-hidden rounded-full bg-paper"
            role="meter"
            aria-valuenow={result.riskScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="위험도"
          >
            <div className={`h-full ${v.bar}`} style={{ width: `${result.riskScore}%` }} />
          </div>
        </div>
      </header>

      {/* 위반 항목 */}
      <section className="p-6">
        <h2 className="text-lg font-semibold">
          위반 항목 <span className="text-ink-soft">{result.violations.length}건</span>
        </h2>

        {result.violations.length === 0 ? (
          <p className="mt-3 text-ink-soft">이 페이지에서 탐지된 위반 항목이 없습니다.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {result.violations.map((item, i) => {
              const s = SEVERITY[item.severity] ?? SEVERITY.low
              return (
                <li key={i} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${s.cls}`}>{s.label}</span>
                    <h3 className="font-semibold">{item.category}</h3>
                  </div>
                  <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[5rem_1fr]">
                    <dt className="text-ink-soft">사유</dt>
                    <dd>{item.reason}</dd>
                    <dt className="text-ink-soft">관련 법령</dt>
                    <dd>{item.law}</dd>
                    <dt className="text-ink-soft">탐지 근거</dt>
                    <dd className="rounded bg-paper px-3 py-2">{item.evidence}</dd>
                  </dl>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </article>
  )
}
