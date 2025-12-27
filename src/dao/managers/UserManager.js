import UserModel from "../models/user.model.js";

export default class UserManager {
  async getUser() {
    return await UserModel.find().populate("users.user");
  }

  async createUser() {
    const newUser = await UserModel.create({ users: [] });
    return newUser;
  }

  async updateUser(id, updatedFields) {
    try {
      delete updatedFields.id;

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updatedFieldss,
        { new: true }
      ).lean();

      if (!updatedUser) {
        return { error: `Usuario con id ${id} no encontrado` };
      }

      return updatedUser;
    } catch (error) {
      throw new Error("Error al actualizar usuario: " + error.message);
    }
  }

  async deleteUser(id) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id).lean();

      if (!deletedUser) {
        return { error: `Ususario con id ${id} no encontrado` };
      }

      return deletedUser;
    } catch (error) {
      throw new Error("Error al eliminar usuario: " + error.message);
    }
  }
}
