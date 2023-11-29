import pino from 'pino';

export const logger = pino();

// Create a child logger with a specific name
export const createLogger = (name) => logger.child({ name });
