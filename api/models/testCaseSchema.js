const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      // required: true,
    },
    input: {
      type: String,
      // Assuming you're storing file paths or references
    },
    expectedResult: {
      type: String,
      // Assuming you're storing file paths or references
    },
  },
  { timestamps: true }
);

const TestCase = mongoose.model("TestCase", testCaseSchema);

module.exports = TestCase;
