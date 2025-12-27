import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema(
  {
    users: [
      {
        id: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },

        email: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
