import { useState } from 'react'
import UrlForm from './components/UrlForm.jsx'
import ResultReport from './components/ResultReport.jsx'
import { detectAd } from './api/detect.js'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (url) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      setResult(await detectAd(url))
    } catch (e) {
      setError(e.message || '분석 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">불법 광고 탐지</h1>
      <p className="mt-3 max-w-[60ch] text-ink-soft">
        광고 페이지 주소를 입력하면 AI가 내용을 검토해 위반 여부와 사유, 관련 법령을 정리해 드립니다.
      </p>

      <div className="mt-8 rounded-lg border border-line bg-white p-6">
        <UrlForm onSubmit={handleSubmit} loading={loading} />
      </div>

      <div className="mt-6">
        {loading && (
          <div className="rounded-lg border border-line bg-white p-6" role="status">
            <div className="h-2 w-full animate-pulse rounded bg-paper" />
            <p className="mt-3 text-sm text-ink-soft">페이지를 수집하고 광고 문구를 분석하고 있습니다…</p>
          </div>
        )}
        {error && (
          <div role="alert" className="rounded-lg border border-alert bg-alert-bg p-4 text-alert">
            {error}
          </div>
        )}
        {result && <ResultReport result={result} />}
      </div>
    </main>
  )
}
