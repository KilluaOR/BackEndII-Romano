import UserModel from "../models/user.model.js";

export default class UserManager {
  async getUser() {
    return await UserModel.find().populate("users.user");
  }

  async createUser() {
    const newUser = await UserModel.create({ users: [] });
    return newUser;
  }
}
