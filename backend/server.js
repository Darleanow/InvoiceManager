const app = require('./app');
const pool = require('./config/database');
const port = 3001;

(async () => {
  try {
    await pool.getConnection();
    console.log('Connected to the database successfully.');

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
})();
