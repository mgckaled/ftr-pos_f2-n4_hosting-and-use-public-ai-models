import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifyScalar from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import translateRoutes from './routes/translate.js';

/**
 * Build and configure Fastify application
 */
export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Set Zod as the validator and serializer compiler
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Register Swagger (generates OpenAPI specification)
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Translation API',
        description:
          'AI-powered translation API using NLLB-200 model from Hugging Face Transformers',
        version: '0.1.0',
        contact: {
          name: 'API Support',
          url: 'https://github.com/your-repo',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'translation',
          description: 'Translation endpoints using AI models',
        },
        {
          name: 'health',
          description: 'Health check and monitoring endpoints',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  // Register Scalar API Reference (modern documentation UI)
  await app.register(fastifyScalar, {
    routePrefix: '/reference',
    configuration: {
      theme: 'purple',
      layout: 'modern',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    },
  });

  // Register CORS plugin
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Register routes with type provider
  await app.withTypeProvider<ZodTypeProvider>().register(translateRoutes);

  // Custom error handler for better error messages
  app.setErrorHandler((error, request, reply) => {
    // Log error
    app.log.error({
      error,
      url: request.url,
      method: request.method,
    });

    // Handle Zod validation errors
    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Request validation failed',
        statusCode: 400,
        details: error.validation,
      });
    }

    // Handle other errors
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    return reply.status(statusCode).send({
      error: error.name || 'Error',
      message,
      statusCode,
    });
  });

  return app;
}
