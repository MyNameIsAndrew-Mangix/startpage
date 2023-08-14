import  { NextFunction, Request, Response } from "express";
import  { sendErrorResponse } from "../src/util/responseUtils"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
    let errorMessage = "An unknown error occured";
    console.log("\n-------- CONGRATS, IT'S BROKEN ----------\n " + error);
    //looking for the mongo error for duplicate keys this way since asynchronous shenanigens make the error a generic JS object instead of a MongoError object and I don't want to cast it.
    if (error instanceof Object && "code" in error && error["code"] === 11000) {
        return sendErrorResponse(res, 400, "Category name must be unique.");
    }
    if (error instanceof Error)
        errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
}