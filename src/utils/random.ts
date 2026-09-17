export function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) {
    throw new Error('maxExclusive must be positive')
  }

  const cryptoApi = globalThis.crypto
  if (!cryptoApi?.getRandomValues) {
    return Math.floor(Math.random() * maxExclusive)
  }

  const maxUint = 0xffffffff
  const limit = maxUint - (maxUint % maxExclusive)
  const value = new Uint32Array(1)

  do {
    cryptoApi.getRandomValues(value)
  } while (value[0] >= limit)

  return value[0] % maxExclusive
}
