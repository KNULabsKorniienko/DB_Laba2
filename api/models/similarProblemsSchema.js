const mongoose = require("mongoose");

const similarProblemsSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      // required: true,
    },
    relatedProblemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RelatedProblem",
      // required: true,
    },
  },
  { timestamps: true }
);

const SimilarProblems = mongoose.model(
  "SimilarProblems",
  similarProblemsSchema
);

module.exports = SimilarProblems;
