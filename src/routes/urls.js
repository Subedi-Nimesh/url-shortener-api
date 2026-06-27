import { Router } from 'express'
import { nanoid } from 'nanoid'
import { authMiddleware } from '../middleware/auth.js'

function isValidUrl(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function urlsRouter(prisma) {
  const router = Router()

  /**
   * @openapi
   * /api/urls:
   *   get:
   *     tags: [URLs]
   *     summary: List user's shortened URLs
   *     security: [{ bearerAuth: [] }]
   *     responses:
   *       200:
   *         description: List of URLs
   */
  router.get('/', authMiddleware, async (req, res) => {
    try {
      const urls = await prisma.url.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          code: true,
          originalUrl: true,
          clicks: true,
          createdAt: true,
        },
      })
      res.json({ urls })
    } catch {
      res.status(500).json({ error: 'Failed to fetch URLs' })
    }
  })

  /**
   * @openapi
   * /api/urls:
   *   post:
   *     tags: [URLs]
   *     summary: Create a shortened URL
   *     security: [{ bearerAuth: [] }]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [originalUrl]
   *             properties:
   *               originalUrl: { type: string, format: uri }
   *     responses:
   *       201:
   *         description: URL created
   */
  router.post('/', authMiddleware, async (req, res) => {
    try {
      const { originalUrl } = req.body
      if (!originalUrl || !isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Valid originalUrl is required (http/https)' })
      }

      const code = nanoid(8)
      const url = await prisma.url.create({
        data: {
          code,
          originalUrl,
          userId: req.user.userId,
        },
      })

      const baseUrl = `${req.protocol}://${req.get('host')}`
      res.status(201).json({
        url: {
          id: url.id,
          code: url.code,
          originalUrl: url.originalUrl,
          shortUrl: `${baseUrl}/${url.code}`,
          clicks: url.clicks,
          createdAt: url.createdAt,
        },
      })
    } catch {
      res.status(500).json({ error: 'Failed to create URL' })
    }
  })

  return router
}
