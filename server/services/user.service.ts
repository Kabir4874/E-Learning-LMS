import userModel from "../models/user.model";

export const getUserById = async (id: string) => {
  return await userModel.findById(id);
};
