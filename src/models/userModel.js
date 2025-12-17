import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema(
  {
    users: [
      {
        name: {
          type: string,
          required: true,
        },
        age: {
          type: number,
          required: true,
        },

        email: {
          type: string,
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

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
