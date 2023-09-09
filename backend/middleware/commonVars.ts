import { Request, Response, NextFunction, RequestHandler } from "express";

export const setCategoryId: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    req.categoryId = req.params.categoryId;
    next();
}

export const setWorkspaceId: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    req.workspaceId = req.params.categoryId;
    next();
}