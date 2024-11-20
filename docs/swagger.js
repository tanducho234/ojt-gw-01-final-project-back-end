// docs/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config()
const serverUrl = process.env.SWAGGER_URL || "http://localhost:3000"
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OJT FINAL",
      version: "1.0.0",
      description: "User account: user@gmail.com. Pass:123.  Admin Account: tanducho234@gmail.com. Pass:123",
    },
    servers: [
      {
        url: serverUrl, // Update with your server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes folder
};

const specs = swaggerJsdoc(options);

module.exports = specs;