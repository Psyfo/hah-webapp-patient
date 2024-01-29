import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patient Microservice API',
      version: '1.0.0',
      description: 'API documentation for HAH Patient Microservice',
    },
  },
  apis: ['./src/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: express.Application): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
