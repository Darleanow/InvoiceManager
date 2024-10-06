const { MySqlContainer } = require('@testcontainers/mysql');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '../.env.test' });

let container;
let pool;

async function initDatabase() {
  // Start MySQL container with root user and test user, using .env.test variables
  const rootUser = process.env.DB_ROOT_USER;
  const rootPassword = process.env.DB_ROOT_PASSWORD;
  const databaseName = process.env.DB_NAME;

  container = await new MySqlContainer()
    .withRootPassword(rootPassword)
    .withDatabase(databaseName)
    .start();

  // Set environment variables for MySQL pool connection
  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort();

  // Use environment variables for test user credentials
  const testUser = process.env.DB_USER;
  const testPassword = process.env.DB_PASSWORD;

  // Create a temporary connection as root with multipleStatements: true
  const tempConnection = await mysql.createConnection({
    host: container.getHost(),
    user: rootUser,
    password: rootPassword,
    database: databaseName,
    port: container.getPort(),
    multipleStatements: true,
  });

  // Load schema and populate SQL scripts
  const schemaPath = path.join(__dirname, '..', 'bin', 'schema.sql');
  const populatePath = path.join(__dirname, '..', 'bin', 'populate.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const populateSql = fs.readFileSync(populatePath, 'utf8');

  // Execute schema and populate scripts
  await tempConnection.query(schemaSql);
  await tempConnection.query(populateSql);

  // Grant all privileges to 'testuser' on 'invoice_manager' database
  await tempConnection.query(`
    CREATE USER '${testUser}'@'%' IDENTIFIED BY '${testPassword}';
    GRANT ALL PRIVILEGES ON ${databaseName}.* TO '${testUser}'@'%';
    FLUSH PRIVILEGES;
  `);

  // Close the temporary connection
  await tempConnection.end();

  // Import the pool after setting environment variables
  pool = require('../config/database');

  return { pool, container };
}

async function teardownDatabase() {
  if (container) {
    await container.stop();
  }
  if (pool) {
    await pool.end();
  }
}

module.exports = {
  initDatabase,
  teardownDatabase,
};
