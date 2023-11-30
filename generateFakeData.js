const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
// Import your models
const Problem = require("./api/models/problemSchema");
const SimilarProblems = require("./api/models/similarProblemsSchema");
const ProblemRelatedCategory = require("./api/models/problemRelatedCategorySchema");
const Category = require("./api/models/categorySchema");
const TestCase = require("./api/models/testCaseSchema");

const { pool } = require("./db");

async function getRandomPostgresProblemId(client) {
  try {
    const result = await client.query(
      'SELECT "id" FROM "problem" ORDER BY random() LIMIT 1'
    );
    return result.rows[0]?.id || 1;
  } catch (e) {
    return 1;
  }
}

async function getRandomPostgresCategoryId(client) {
  try {
    const result = await client.query(
      'SELECT "id" FROM "category" ORDER BY random() LIMIT 1'
    );
    return result.rows[0]?.id || 1;
  } catch (e) {
    return 1;
  }
}

const pgParams = {
  generateProblemData: () => ({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    userId: faker.number.int({ min: 1, max: 100 }),
    updated_at: new Date(faker.date.recent())
      .toISOString()
      .replace("T", " ")
      .slice(0, 19),
  }),
  generateCategoryData: () => ({
    name: faker.lorem.word(),
  }),
  generateSimilarProblemsData: async (client) => ({
    problemid: await getRandomPostgresProblemId(client),
    problemid: await getRandomPostgresProblemId(client),
  }),
  generateProblemRelatedCategoryData: async (client) => ({
    problemid: await getRandomPostgresProblemId(client),
    categoryid: await getRandomPostgresCategoryId(client),
  }),
  generateTestCaseData: async (client) => ({
    problemid: await getRandomPostgresProblemId(client),
    input: faker.system.filePath(),
    expectedresult: faker.system.filePath(),
  }),
};

// Function to get a random problem ID from the database
const getRandomProblemId = async () => {
  const problems = await Problem.find();
  const randomProblem = faker.helpers.arrayElements(problems); // Choose a random problem

  return mongoose.Types.ObjectId(randomProblem[0]?._id);
};

const getRandomCategoryId = async () => {
  const categories = await Category.find();
  const randomCategories = faker.helpers.arrayElements(categories); // Choose a random category
  return mongoose.Types.ObjectId(randomCategories[0]?._id);
};

// Function to generate fake data for each collection
const generateFakeData = async (model, dataGenerator) => {
  const fakeData = [];

  const generatedData = await dataGenerator();
  fakeData.push(generatedData);

  return model.insertMany(fakeData);
};

// Function to generate fake data for the Problem collection
const generateProblemData = () => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  userId: faker.number.int({ min: 1, max: 100 }),
  updated_at: faker.date.recent(),
});

// Function to generate fake data for the SimilarProblems collection
const generateSimilarProblemsData = async () => ({
  problemId: await getRandomProblemId(),
  relatedProblemId: await getRandomProblemId(),
});

// Function to generate fake data for the ProblemRelatedCategory collection
const generateProblemRelatedCategoryData = async () => ({
  problemId: await getRandomProblemId(),
  categoryId: await getRandomCategoryId(),
});

// Function to generate fake data for the Category collection
const generateCategoryData = () => ({
  name: faker.lorem.word(),
});

// Function to generate fake data for the TestCase collection
const generateTestCaseData = async () => ({
  problemId: await getRandomProblemId(),
  input: faker.system.filePath(),
  expectedResult: faker.system.filePath(),
});

// Insert fake data into each collection
const generateMongoDBFakeData = async (N) => {
  const startTime = performance.now();
  for (let i = 0; i < N; i++) {
    await Promise.all([
      generateFakeData(Problem, generateProblemData),
      generateFakeData(Category, generateCategoryData),
      generateFakeData(SimilarProblems, generateSimilarProblemsData),
      generateFakeData(
        ProblemRelatedCategory,
        generateProblemRelatedCategoryData
      ),
      generateFakeData(TestCase, generateTestCaseData),
    ]);
  }

  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  console.log(
    `Time taken for NoSQL: ${elapsedTime} milliseconds to generate ${
      N * 5
    } rows `
  );

  console.log("Fake data inserted successfully");
};

async function generatePostgresFakeData(N) {
  const client = await pool.connect();
  const startTime = performance.now();
  try {
    for (let i = 0; i < N; i++) {
      await Promise.all([
        generateFakeDataForTable(
          client,
          "problem",
          pgParams.generateProblemData
        ),
        generateFakeDataForTable(
          client,
          "category",
          pgParams.generateCategoryData
        ),
        generateFakeDataForTable(
          client,
          "similarproblems",
          pgParams.generateSimilarProblemsData
        ),
        generateFakeDataForTable(
          client,
          "problemrelatedcategory",
          pgParams.generateProblemRelatedCategoryData
        ),
        generateFakeDataForTable(
          client,
          "testcase",
          pgParams.generateTestCaseData
        ),
      ]);
    }
  } finally {
    client.release();
  }
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  console.log(
    `Time taken for SQL: ${elapsedTime} milliseconds to generate ${N * 5} rows`
  );
}
async function generateFakeDataForTable(client, tableName, dataGenerator) {
  try {
    const fakeData = await dataGenerator(client);

    const columns = Object.keys(fakeData).join(", ");
    const values = Object.values(fakeData)
      .map((v) => (+v === v ? v : `'${v}'`))
      .join(", ");

    const query = `
        INSERT INTO "${tableName}" (${columns})
        VALUES (${values})
        RETURNING *;
      `;
    const result = await client.query(query);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  generateMongoDBFakeData,
  getRandomProblemId,
  generatePostgresFakeData,
};
