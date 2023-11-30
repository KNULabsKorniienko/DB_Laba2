require("dotenv").config();
const {
  generatePostgresFakeData,
  generateMongoDBFakeData,
} = require("./generateFakeData");

const db = require("./db");

const mongoose = require("mongoose");

mongoose.connection.on("error", () => {
  console.log("Error connecting database");
});

const N = 10;

mongoose.connection.once("open", () => {
  console.log("Database successfully connected");
  // db.dropTables();
  // db.createTables();
  // mongoose.connection.dropDatabase();

  // generatePostgresFakeData(N);
  // generateMongoDBFakeData(N);
});

const app = require("./app");

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

app.get("/", async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
