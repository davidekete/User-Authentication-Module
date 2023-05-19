import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Authentication API',
      version: '1.0.0',
      description: 'User Authentication Module',
    },
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    servers: [
      {
        url: 'http://localhost:6060',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsDoc(options);

export default specs;
