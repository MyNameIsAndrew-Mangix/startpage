import express from "express";
import * as models from "../models/category";
import { sendSuccessResponse } from "../util/responseUtils";

const testRouter = express.Router();

testRouter.get("/add-sample", async (req, res, next) => {
    try {
    const newWorkspace = new models.WorkspaceModel({ title: "testWS"});
    const newWorkspace2 = new models.WorkspaceModel({ title: "testWS2"});
    const newCategory = new models.CategoryModel({
        title: "sample", 
});     
    newCategory.workspaces.push(newWorkspace);
    newCategory.workspaces.push(newWorkspace2);
    await newCategory.save();
    return sendSuccessResponse(res, 201, "Sample created", newCategory);
    } catch (error) {
        next(error)
    }
});

testRouter.get("/simulate-mongoose-error", async (req, res, next) => {
    try {
        const newCategory = new models.CategoryModel({ title: "dupe"});
        await newCategory.save();

        const dupeCategory = new models.CategoryModel({ title: "dupe"});
        await dupeCategory.save();
    } catch (error) {
        next(error);
    }
})

export default testRouter;