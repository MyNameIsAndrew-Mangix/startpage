import  { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    //looking for the mongo error for duplicate keys this way since asynchronous shenanigens make the error a generic JS object instead of a MongoError object and I don't want to cast it.
    if (error instanceof Object && "code" in error && error["code"] === 11000) {
        throw createHttpError(400, "Category name must be unique.");
    }
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
}