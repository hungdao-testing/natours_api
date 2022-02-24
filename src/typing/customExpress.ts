import { Request } from "express";
import { IUser } from "../models/userModel";

export interface ICustomRequestExpress extends Request{
    requestTime?: string | undefined,
    user?: IUser
}