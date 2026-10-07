import { useState } from 'react'

function normalize(input) {
  const v = input.trim()
  if (!v) return ''
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

function isValidUrl(v) {
  try {
    const u = new URL(v)
    return u.hostname.includes('.')
  } catch {
    return false
  }
}

export default function UrlForm({ onSubmit, loading }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = normalize(value)
    if (!isValidUrl(url)) {
      setError('올바른 주소를 입력해 주세요. 예: https://example.com/ad')
      return
    }
    setError('')
    onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="url" className="block text-sm font-medium text-ink-soft">
        검사할 광고 페이지 주소
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="url"
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://example.com/product/123"
          disabled={loading}
          aria-invalid={!!error}
          aria-describedby={error ? 'url-error' : undefined}
          className="min-w-0 flex-1 rounded-md border border-line bg-white px-4 py-3 text-base outline-none focus:border-ink focus:ring-2 focus:ring-ink/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-ink px-6 py-3 font-semibold text-white transition hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '분석 중…' : '광고 분석하기'}
        </button>
      </div>
      {error && (
        <p id="url-error" role="alert" className="mt-2 text-sm text-alert">
          {error}
        </p>
      )}
    </form>
  )
}
