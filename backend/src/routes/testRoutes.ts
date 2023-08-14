import express from "express";
import * as models from "../models/category";

const testRouter = express.Router();

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