import { RequestHandler } from "express";
import * as models from "../models/category";
import { sendErrorResponse, sendSuccessResponse } from "../util/responseUtils";

export const createWorkspace: RequestHandler =  async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const title = req.body.title;
    const sites = req.body.sites
    try {
        const categoryToUpdate = await models.CategoryModel.findById(categoryId);
        const newWorkspace = await models.WorkspaceModel.create({
            title: title,
            sites: sites,
        });
        if (categoryToUpdate) {
            categoryToUpdate.workspaces.push(newWorkspace)

        }
    } catch (error) {
        next(error);
    }
}
// export const getWorkspace: RequestHandler =  async (req, res, next) => {
//     //to be implemented
// }
// export const updateWorkspace: RequestHandler =  async (req, res, next) => {
//     //to be implemented
// }
export const deleteWorkspace: RequestHandler =  async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const workspaceId = req.body.workspaceId;
    
    try {
        const category = await models.CategoryModel.findById(categoryId);
        if (!category)
            return sendErrorResponse(res, 404, "Parent category not found");

        const workspaceIndex = category?.workspaces.findIndex( workspace => workspace._id.toString() === workspaceId)
        if (workspaceIndex === -1)
            return sendErrorResponse(res, 404, "Workspace not found");

            category?.workspaces.remove(category.workspaces[workspaceIndex]);
            await category?.save();
            return sendSuccessResponse(res, 200, "Workspace deleted successfully", null);
        } catch (error) {
        next(error);
    }
}
export const createCategory: RequestHandler =  async (req, res, next) => {
    const title = req.body.title;
    const workspaces = req.body.workspaces;
    try {
        const newCategory = await models.CategoryModel.create({
            title: title,
            workspaces: workspaces,
        });
        res.status(201).json(newCategory);
        return sendSuccessResponse(res, 201, "New category successfully created!", newCategory);
 } catch (error) {
    next(error);
 }   
}
export const getCategory: RequestHandler =  async (req, res, next) => {
    const categoryId = req.params.id;
    try {
        const category = await models.CategoryModel.findById(categoryId);
        if (category) {
            return sendSuccessResponse(res, 200, "Category found!", category);
        }
        
        return sendErrorResponse(res, 404, "Category not found."); 
    } catch (error) {
        next(error)
    }
}
export const updateCategory: RequestHandler =  async (req, res, next) => {
    const categoryId = req.params.id;
    const updatedData = req.body;
    try {
        const updatedCategory: models.ICategoryModel | null = await models.CategoryModel.findByIdAndUpdate(categoryId, updatedData, { new: true});

        if (updatedCategory) {
            return sendSuccessResponse(res, 200, "Category successfully updated", updatedCategory);
        }
        return sendErrorResponse(res, 404, "Category not found.");
    }
    catch (error) {
        next(error)
    }
}
export const deleteCategory: RequestHandler =  async (req, res, next) => {
    const categoryId = req.params.id;
    try {
        const deletedCategory: models.ICategoryModel | null = await models.CategoryModel.findByIdAndDelete({ categoryId });

        if (deletedCategory) {
            return sendSuccessResponse(res, 200, "Category successfully deleted!", deletedCategory)
        }
        return sendErrorResponse(res, 404, "Category not found.");
    } catch (error) {
        next(error);
    }
}

export const getCategories: RequestHandler =  async (req, res, next) => {
    try {
        const categories = await models.CategoryModel.find().exec();
        return sendSuccessResponse(res, 200, "Categories successfully retrieved!", categories);
    } catch (error) {
        next(error);
    }
};