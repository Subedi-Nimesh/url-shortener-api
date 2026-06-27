import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { PrismaClient } from '@prisma/client'
import { authRouter } from './routes/auth.js'
import { urlsRouter } from './routes/urls.js'
import { swaggerSpec } from './swagger.js'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

app.get('/health', (_req, res) => {
  res.json({ status: 'up', service: 'url-shortener-api' })
})

app.use('/api/auth', authRouter)
app.use('/api/urls', urlsRouter(prisma))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/:code', async (req, res) => {
  try {
    const url = await prisma.url.findUnique({ where: { code: req.params.code } })
    if (!url) return res.status(404).json({ error: 'Short URL not found' })
    await prisma.url.update({ where: { id: url.id }, data: { clicks: { increment: 1 } } })
    res.redirect(302, url.originalUrl)
  } catch {
    res.status(500).json({ error: 'Redirect failed' })
  }
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`URL Shortener API running on port ${PORT}`)
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`)
})

export { prisma }
