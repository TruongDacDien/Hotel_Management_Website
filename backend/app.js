// app.js
const express = require('express');
//const bodyParser = require('body-parser');
const branchRoutes = require('./routes/branchRoutes');
const customerRoutes = require('./routes/customerRoutes');
//const roomRoutes = require('./routes/roomRoutes');
// ... import other routes

const app = express();

// Middleware
// app.use(bodyParser.json());

// Routes
app.use('/api/branches', branchRoutes);
app.use('/api/customers', customerRoutes);
// app.use('/api/rooms', roomRoutes);
// ... other routes

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: err.message });
// });

const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
