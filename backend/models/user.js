const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "participant",
  },
  password: {
    type: String,
    required: true,
  },
  team: {
    type: String,
  },
  score: {
    type: String,
  },
});

module.exports = user = mongoose.model("user", UserSchema);
