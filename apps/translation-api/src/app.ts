import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
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
