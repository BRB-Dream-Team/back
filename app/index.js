const express = require('express');

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

const cors = require("cors");
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

// // Middleware to capture and log request and response details
// app.use((req, res, next) => {
//   const allowedHost = ["http://141.98.153.217:5173/"];  

//   // Check if the Host header matches the allowed host
//   if (req.headers.host !== "127.0.0.1:16005" && req.headers.host !== "141.98.153.217:16005" && req.headers.host !== "bot:16005" && !allowedHost.includes(req.headers.referer)) {
//     res.status(403).json({ error: "Forbidden: Access is denied." });
//     return;
//   }

//   // Middleware to log request and response details
//   const originalSend = res.send;

//   res.send = function (data) {
//     res.locals.body = data;
//     originalSend.call(this, data);
//   };

//   res.on('finish', () => {
//     logger.info(`Request Headers: ${JSON.stringify(req.headers)}`);
//     logger.info(`Request Body: ${JSON.stringify(req.body)}`);
//     logger.info(`Response Data: ${res.locals.body}`);
//   });

//   next();
// });

app.use(express.json());

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

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var options = {
  customCss: '.swagger-ui .topbar { display: none }'
};

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Start the server
app.listen(port, () => {
  console.log(`✅ Server: ${port}`);
  console.log(`✅ Swagger Editor: http://localhost:${port}/api-docs`);
});

module.exports = app;