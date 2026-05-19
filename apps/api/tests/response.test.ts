import { describe, expect, it } from 'vitest'
import { ok, fail } from '../src/lib/response.js'

describe('response helpers', () => {
  it('returns success shape', () => {
    expect(ok({ hello: 'world' })).toEqual({
      success: true,
      data: { hello: 'world' },
    })
  })

  it('returns error shape', () => {
    expect(fail('BAD_REQUEST', 'Nope')).toEqual({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Nope' },
    })
  })
})
