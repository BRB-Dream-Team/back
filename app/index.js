const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

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
app.use('/users', usersRouter);
app.use('/phones', phonesRouter);
app.use('/entrepreneurs', entrepreneursRouter);
app.use('/contributors', contributorsRouter);
app.use('/categories', categoriesRouter);
app.use('/regions', regionsRouter);
app.use('/startups', startupsRouter);
app.use('/contributions', contributionsRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🙌 DreamTeam Crowdfunding Platform API' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('❌ Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server: ${port}`);
  console.log(`✅ Swagger: http://localhost:${port}/api-docs`);
});

module.exports = app;