import { RequestHandler } from "express";
import * as models from "../models/category";
import { sendSuccessResponse } from "../util/responseUtils";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getSite: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const siteId = req.params.siteId;
    
    try {
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId) || !mongoose.isValidObjectId(siteId)) 
            throw createHttpError(400, "Invalid ID format");
        const category = await findCategoryByIdOrFail(categoryId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId);
        const site = workspace.sites.id(siteId);
        if (!site)
            throw createHttpError(404, "Site not found");
        
        return sendSuccessResponse(res, 200, "Site retrieved successfully", site);
        
    } catch (error) {
        next(error);
    }
}
export const createSite: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const newSiteData: models.ISiteModel = req.body;

    try {
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId)) 
            throw createHttpError(400, "Invalid ID format");
        if (!newSiteData.url)
            throw createHttpError(400, "Site must have URL");

        const category = await findCategoryByIdOrFail(categoryId);
const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId);

        workspace.sites.push(newSiteData);
        await category.save();
        return sendSuccessResponse(res, 201, "Site created successfully", newSiteData);
    } catch (error) {
        next(error);
    }
}
export const updateSite: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const siteId = req.params.siteId;
    const newSiteData: models.ISiteModel = req.body;

    try {
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId) || !mongoose.isValidObjectId(siteId)) 
            throw createHttpError(400, "Invalid ID format");
        if (!newSiteData.url)
            throw createHttpError(400, "Site must have URL");
        const category = await findCategoryByIdOrFail(categoryId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId);
        const site = workspace.sites.id(siteId);
        if (!site)
            throw createHttpError(404, "Site not found");
        site.set(newSiteData);
        await category.save();
        return sendSuccessResponse(res, 200, "Site successfully added", newSiteData);
    } catch (error) {
        next(error);
    }
}
export const deleteSite: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const siteId = req.params.siteId;

    try {
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId) || !mongoose.isValidObjectId(siteId)) 
            throw createHttpError(400, "Invalid ID format");
            const category = await findCategoryByIdOrFail(categoryId);
            const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId);
        const site = workspace.sites.id(siteId);
        if (!site)
            throw createHttpError(404, "Site not found");
        workspace.sites.pull({ _id: siteId});
        await category?.save();
        return sendSuccessResponse(res, 204, "Site successfully deleted");

    } catch (error) {
        next(error);
    }
}

export const createWorkspace: RequestHandler =  async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const title: string = req.body.title;
    const sites: models.ISiteModel[] = req.body.sites;
    try {
        const newWorkspace = await models.WorkspaceModel.create({
            title: title,
            sites: sites,
        });
        const categoryToUpdate = await models.CategoryModel.findById(categoryId);
        if (categoryToUpdate) {
            categoryToUpdate.workspaces.push(newWorkspace);
            categoryToUpdate.save();
            return sendSuccessResponse(res, 201, "Workspace successfully created!", newWorkspace);
        }
        //categoryToUpdate was never found
        const uncategorizedCategory = createUncategorizedWorkspace(newWorkspace);
        return sendSuccessResponse(res, 201, "Workspace successfully created and added to uncategorized category!", uncategorizedCategory);
        

    } catch (error) {
        next(error);
    }
}

export const getWorkspaces: RequestHandler =  async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    
    try {
        if (!mongoose.isValidObjectId(categoryId)) 
            throw createHttpError(400, "Invalid ID format");
        const category = await findCategoryByIdOrFail(categoryId);
        const workspaces = category.workspaces;
        return sendSuccessResponse(res, 200, "Found workspaces", workspaces);
    } catch (error) {
        next(error);
    }
}

export const getWorkspace: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;

    try {
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId)) 
            throw createHttpError(400, "Invalid ID format");
        const category = await findCategoryByIdOrFail(categoryId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId);

        return sendSuccessResponse(res, 200, "Found workspace", workspace);
    } catch (error) {
        next(error);
    }
}

export const updateWorkspace: RequestHandler =  async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const updatedData: models.IWorkspaceModel = req.body;

    try {
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId)) 
            throw createHttpError(400, "Invalid ID format");
        if (!updatedData.title)
            throw createHttpError(400, "Workspace must have title");
        
        const category = await findCategoryByIdOrFail(categoryId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId);

        workspace.set(updatedData);
        await category.save();
        return sendSuccessResponse(res, 200, "Workspace updated successfully", workspace);

    } catch (error) {
        next();
    }
}
export const deleteWorkspace: RequestHandler =  async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    
    try {
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId)) 
            throw createHttpError(400, "Invalid ID format");
        const category = await findCategoryByIdOrFail(categoryId);
        findWorkspaceByIdInCategoryOrFail(category, workspaceId);
        category.workspaces.pull({ _id: workspaceId});
        await category?.save();
        return sendSuccessResponse(res, 204, "Workspace deleted successfully");
        } catch (error) {
        next(error);
    }
}
export const createCategory: RequestHandler =  async (req, res, next) => {
    const title: string = req.body.title;
    const workspaces: models.IWorkspaceModel[] = req.body.workspaces;
    try {
        const newCategory = await models.CategoryModel.create({
            title: title,
            workspaces: workspaces,
        });
        return sendSuccessResponse(res, 201, "New category successfully created!", newCategory);
 } catch (error) {
    next(error);
 }   
}

export const getCategories: RequestHandler =  async (req, res, next) => {
    try {
        const categories: (models.ICategoryModel | null)[] = await models.CategoryModel.find().exec();
        if (categories === null)
            throw createHttpError(500, "An error occured while fetching categories");
        if (categories.length === 0)
            return sendSuccessResponse(res, 204, "No categories found");

        return sendSuccessResponse(res, 200, "Categories successfully retrieved!", categories);
    } catch (error) {
        next(error);
    }
}

export const getCategory: RequestHandler =  async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    try {
        if (!mongoose.isValidObjectId(categoryId)) 
            throw createHttpError(400, "Invalid ID format");
                const category = await findCategoryByIdOrFail(categoryId);
        return sendSuccessResponse(res, 200, "Category found", category);
        
    } catch (error) {
        next(error)
    }
}
export const updateCategory: RequestHandler =  async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const updatedData: models.ICategoryModel = req.body;
    try {
        if (!mongoose.isValidObjectId(categoryId)) 
            throw createHttpError(400, "Invalid ID format");
        if (!updatedData.title)
            throw createHttpError(400, "Category must have title");

        const updatedCategory: models.ICategoryModel | null = await models.CategoryModel.findByIdAndUpdate(categoryId, updatedData, { new: true});
        if (updatedCategory) {
            return sendSuccessResponse(res, 200, "Category successfully updated", updatedCategory);
        }
        throw createHttpError(404, "Category not found.");
    }
    catch (error) {
        next(error);
    }
}
export const deleteCategory: RequestHandler =  async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    try {
        if (!mongoose.isValidObjectId(categoryId)) 
            throw createHttpError(400, "Invalid ID format");
        const deletedCategory: models.ICategoryModel | null = await models.CategoryModel.findByIdAndDelete({ categoryId });

        if (deletedCategory) {
            return sendSuccessResponse(res, 204, "Category successfully deleted!");
        }
        throw createHttpError(404, "Category not found.");
    } catch (error) {
        next(error);
    }
}

//HELPER METHODS
const createUncategorizedWorkspace = async (newWorkspace: models.IWorkspaceModel) => {
    const uncategorizedCategory = await findOrCreateUncategorizedCategory();
    
    uncategorizedCategory.workspaces.push(newWorkspace);
    await uncategorizedCategory.save();
    return uncategorizedCategory;
};

const findOrCreateUncategorizedCategory = async () => {
    const existingCategory = await models.CategoryModel.findOne({ title: "Uncategorized" });

    if (existingCategory)
        return existingCategory;

    const newCategory = new models.CategoryModel({ title: "Uncategorized" });
    await newCategory.save();
    
    return newCategory;
}

function findWorkspaceByIdInCategoryOrFail(category: models.ICategoryModel, workspaceId: string | undefined) {
    const workspace = category.workspaces.id(workspaceId);
    if (!workspace)
        throw createHttpError(404, "Workspace not found");
    return workspace;
}

async function findCategoryByIdOrFail(categoryId: string | undefined) {
    const category: models.ICategoryModel | null = await models.CategoryModel.findById(categoryId);
    if (!category)
        throw createHttpError(404, "Category or parent category not found");
    return category;
}
