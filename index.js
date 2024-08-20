const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();

const usersRouter = require('./routes/users');
const phonesRouter = require('./routes/phones');
const entrepreneursRouter = require('./routes/entrepreneurs');
const contributorsRouter = require('./routes/contributors');
const categoriesRouter = require('./routes/categories');
const regionsRouter = require('./routes/regions');
const startupsRouter = require('./routes/startups');
const contributionsRouter = require('./routes/contributions');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/phones', phonesRouter);
app.use('/api/entrepreneurs', entrepreneursRouter);
app.use('/api/contributors', contributorsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/regions', regionsRouter);
app.use('/api/startups', startupsRouter);
app.use('/api/contributions', contributionsRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the DreamTeam Crowdfunding Platform API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

module.exports = app;