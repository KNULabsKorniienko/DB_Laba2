const mongoose = require("mongoose");

const problemRelatedCategorySchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      // required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
  },
  { timestamps: true }
);

const ProblemRelatedCategory = mongoose.model(
  "ProblemRelatedCategory",
  problemRelatedCategorySchema
);

module.exports = ProblemRelatedCategory;
