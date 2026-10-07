/**
 * 탐지 API
 * 백엔드 응답 형식(예상):
 * {
 *   url, analyzedAt,
 *   verdict: 'violation' | 'suspected' | 'safe',
 *   riskScore: 0~100,
 *   summary: string,
 *   violations: [{ category, severity: 'high'|'medium'|'low', law, reason, evidence }]
 * }
 * 백엔드와 필드명이 다르면 이 파일에서만 변환하면 됩니다.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function detectAd(url) {
  if (USE_MOCK) return mockDetect(url)

  const res = await fetch('/api/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error(`분석 요청에 실패했습니다. (오류 코드 ${res.status})`)
  return res.json()
}

async function mockDetect(url) {
  await new Promise((r) => setTimeout(r, 1800))
  if (url.includes('safe')) {
    return {
      url,
      analyzedAt: new Date().toISOString(),
      verdict: 'safe',
      riskScore: 8,
      summary: '확인된 위반 사항이 없습니다.',
      violations: [],
    }
  }
  return {
    url,
    analyzedAt: new Date().toISOString(),
    verdict: 'violation',
    riskScore: 87,
    summary: '허위·과장 표현과 의약품 효능 표방이 확인되어 위반 가능성이 높습니다.',
    violations: [
      {
        category: '의약품 효능 표방',
        severity: 'high',
        law: '식품 등의 표시·광고에 관한 법률 제8조',
        reason: '일반 식품을 질병 치료·예방에 효과가 있는 것처럼 광고했습니다.',
        evidence: '"복용 2주 만에 당뇨 완치" 문구 (상단 배너)',
      },
      {
        category: '허위·과장 광고',
        severity: 'medium',
        law: '표시·광고의 공정화에 관한 법률 제3조',
        reason: '근거 없는 수치를 제시해 소비자를 오인하게 할 수 있습니다.',
        evidence: '"만족도 99.9%" 문구, 출처 표기 없음',
      },
      {
        category: '후기 조작 의심',
        severity: 'low',
        law: '표시·광고의 공정화에 관한 법률 제3조',
        reason: '동일한 문장 구조의 후기가 반복되어 조작 가능성이 있습니다.',
        evidence: '후기 12건 중 9건이 유사 문장',
      },
    ],
  }
}
