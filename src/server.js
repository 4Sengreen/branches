import Fastify from 'fastify';
import bookRoutes from './routes/books.js';
import bulkRoutes from './routes/bulk.js';

const fastify = Fastify({ logger: true });

fastify.register(bookRoutes);
fastify.register(bulkRoutes);

fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
