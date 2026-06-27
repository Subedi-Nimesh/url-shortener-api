import test from 'node:test'
import assert from 'node:assert/strict'
import { app } from '../src/index.js'

test('GET / returns API information', async () => {
  const server = app.listen(0)

  await new Promise((resolve) => server.once('listening', resolve))

  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0

  try {
    const response = await fetch(`http://127.0.0.1:${port}/`)
    assert.equal(response.status, 200)

    const body = await response.json()
    assert.equal(body.service, 'url-shortener-api')
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())))
  }
})
