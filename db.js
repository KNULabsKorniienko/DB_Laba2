const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  password: process.env.PASSWORD,
  host: "localhost",
  port: 5432, // default Postgres port
  database: "laba2",
});

async function createTables() {
  const client = await pool.connect();

  try {
    // Create Category Table
    await client.query(`
      CREATE TABLE Category (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR
      );
    `);

    // Create Problem Table
    await client.query(`
      CREATE TABLE Problem (
        Id SERIAL PRIMARY KEY,
        Title VARCHAR,
        Description VARCHAR,
        UserId INTEGER,
        Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        Updated_at TIMESTAMP
      );
    `);

    // Create SimilarProblems Table
    await client.query(`
      CREATE TABLE SimilarProblems (
        Id SERIAL PRIMARY KEY,
        ProblemId INTEGER,
        RelatedProblemId INTEGER,
        FOREIGN KEY (ProblemId) REFERENCES Problem(Id),
        FOREIGN KEY (RelatedProblemId) REFERENCES Problem(Id)
      );
    `);

    // Create ProblemRelatedCategory Table
    await client.query(`
      CREATE TABLE ProblemRelatedCategory (
        Id SERIAL PRIMARY KEY,
        ProblemId INTEGER,
        CategoryId INTEGER,
        FOREIGN KEY (ProblemId) REFERENCES Problem(Id),
        FOREIGN KEY (CategoryId) REFERENCES Category(Id)
      );
    `);

    // Create TestCase Table
    await client.query(`
      CREATE TABLE TestCase (
        Id SERIAL PRIMARY KEY,
        ProblemId INTEGER,
        Input TEXT,
        ExpectedResult TEXT,
        FOREIGN KEY (ProblemId) REFERENCES Problem(Id)
      );
    `);
  } finally {
    client.release();
  }
}

async function dropTables() {
  const client = await pool.connect();

  try {
    // Drop tables in reverse order to avoid foreign key constraints issues
    await client.query("DROP TABLE IF EXISTS TestCase;");
    await client.query("DROP TABLE IF EXISTS ProblemRelatedCategory;");
    await client.query("DROP TABLE IF EXISTS SimilarProblems;");
    await client.query("DROP TABLE IF EXISTS Problem;");
    await client.query("DROP TABLE IF EXISTS Category;");
  } finally {
    client.release();
  }
}

// createTables(); // Run this to apply the migration
// dropTables(); // Run this to rollback the migration

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  dropTables,
  createTables,
};
