import { Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function sendSuccessResponse<T>(res: Response, statusCode: number, message: string): void;
export function sendSuccessResponse<T>(res: Response, statusCode: number, message: string, data: T): void;

export function sendSuccessResponse<T>(res: Response, statusCode: number, message: string, data?: T): void {
    res.status(statusCode).json({ message, data });
}

export const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
    return res.status(statusCode).json({message});
};