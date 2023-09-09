import {model, Schema, Document} from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, select: false, unique: true},
    password: { type: String, required: true, select: false},
});

export interface IUserModel extends IUser, Document {}

const UserModel = model<IUserModel>("User", userSchema);

export { UserModel };