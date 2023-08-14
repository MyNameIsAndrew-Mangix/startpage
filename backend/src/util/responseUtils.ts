import { Response } from "express";

export const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
    return res.status(statusCode).json({message});
};

export const sendSuccessResponse = (res: Response, statusCode: number, message: string, data: any) => {
    return res.status(statusCode).json({ message, data });
}