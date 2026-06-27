import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'REST API for URL shortening with JWT authentication and PostgreSQL persistence.',
      contact: { name: 'Nimesh Subedi', url: 'https://subedi-nimesh.github.io' },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' },
      { url: 'https://url-shortener-api-ns.onrender.com', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
