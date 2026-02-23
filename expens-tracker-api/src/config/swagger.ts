import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Expense Tracker API - V1',
            version: '1.0.0',
            description: 'API para controle de despesas pessoais, carteiras e recorrências.',
            contact: {
                name: 'Marcus Phellypp',
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: 'http://localhost:3333/api/v1',
                description: 'Servidor Local (v1)',
            },
        ],
    },
    // Caminhos onde o swagger vai buscar as anotações @swagger
    apis: ['./src/modules/**/*.routes.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
