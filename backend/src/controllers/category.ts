import { RequestHandler } from "express";
import * as models from "../models/category";
import { sendSuccessResponse } from "../util/responseUtils";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertDefined";

export const getSite: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const siteId = req.params.siteId;

    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId) || !mongoose.isValidObjectId(siteId))
            throw createHttpError(400, "Invalid ID format");
        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId, authenticatedUserId);
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
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId))
            throw createHttpError(400, "Invalid ID format");
        if (!newSiteData.url)
            throw createHttpError(400, "Site must have URL");

        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId, authenticatedUserId);

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
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId) || !mongoose.isValidObjectId(siteId))
            throw createHttpError(400, "Invalid ID format");
        if (!newSiteData.url)
            throw createHttpError(400, "Site must have URL");
        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId, authenticatedUserId);
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
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId) || !mongoose.isValidObjectId(siteId))
            throw createHttpError(400, "Invalid ID format");
        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId, authenticatedUserId);
        const site = workspace.sites.id(siteId);
        if (!site)
            throw createHttpError(404, "Site not found");
        workspace.sites.pull({ _id: siteId });
        await category?.save();
        return sendSuccessResponse(res, 204, "Site successfully deleted");

    } catch (error) {
        next(error);
    }
}
export const createWorkspace: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const title: string = req.body.title;
    const sites: models.ISiteModel[] = req.body.sites;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        const newWorkspace = await models.WorkspaceModel.create({
            title: title,
            sites: sites,
            parentCategoryId: categoryId,
        });
        const categoryToUpdate = await models.CategoryModel.findOne({ _id: categoryId, userId: authenticatedUserId });
        if (categoryToUpdate) {
            categoryToUpdate.workspaces.push(newWorkspace);
            categoryToUpdate.save();
            return sendSuccessResponse(res, 201, "Workspace successfully created!", newWorkspace);
        }
        //categoryToUpdate was never found
        const uncategorizedCategory = createUncategorizedWorkspace(newWorkspace, authenticatedUserId);
        return sendSuccessResponse(res, 201, "Workspace successfully created and added to uncategorized category!", uncategorizedCategory);


    } catch (error) {
        next(error);
    }
}

export const getWorkspaces: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId))
            throw createHttpError(400, "Invalid ID format");
        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        const workspaces = category.workspaces;
        return sendSuccessResponse(res, 200, "Found workspaces", workspaces);
    } catch (error) {
        next(error);
    }
}

export const getWorkspace: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId))
            throw createHttpError(400, "Invalid ID format");
        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId, authenticatedUserId);

        return sendSuccessResponse(res, 200, "Found workspace", workspace);
    } catch (error) {
        next(error);
    }
}

export const updateWorkspace: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const updatedData: models.IWorkspaceModel = req.body;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId))
            throw createHttpError(400, "Invalid ID format");
        if (!updatedData.title)
            throw createHttpError(400, "Workspace must have title");

        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        const workspace = await findWorkspaceByIdInCategoryOrFail(category, workspaceId, authenticatedUserId);

        workspace.set(updatedData);
        await category.save();
        return sendSuccessResponse(res, 200, "Workspace updated successfully", workspace);

    } catch (error) {
        next();
    }
}
export const deleteWorkspace: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const workspaceId: string | null = req.params.workspaceId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(workspaceId))
            throw createHttpError(400, "Invalid ID format");
        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        category.workspaces.pull({ _id: workspaceId });
        await category?.save();
        return sendSuccessResponse(res, 204, "Workspace deleted successfully");
    } catch (error) {
        next(error);
    }
}
export const createCategory: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const title: string = req.body.title;
    const workspaces: models.IWorkspaceModel[] = req.body.workspaces;
    try {
        assertIsDefined(authenticatedUserId)
        assertIsDefined(authenticatedUserId)
        const newCategory = await models.CategoryModel.create({
            userId: authenticatedUserId,
            title: title,
            workspaces: workspaces,
        });
        return sendSuccessResponse(res, 201, "New category successfully created!", newCategory);
    } catch (error) {
        next(error);
    }
}

export const getCategories: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        const categories: (models.ICategoryModel | null)[] = await models.CategoryModel.find({ userId: authenticatedUserId }).exec();
        if (categories === null)
            throw createHttpError(500, "An error occured while fetching categories");
        if (categories.length === 0)
            return sendSuccessResponse(res, 204, "No categories found");

        return sendSuccessResponse(res, 200, "Categories successfully retrieved!", categories);
    } catch (error) {
        next(error);
    }
}

export const getCategory: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId))
            throw createHttpError(400, "Invalid ID format");
        const category = await findUserOwnedCategoryByIdOrFail(categoryId, authenticatedUserId);
        if (!category)
            throw createHttpError(404, "Category not found");

        if (!category.userId.equals(authenticatedUserId))
            throw createHttpError(401, "You cannot access this category");
        return sendSuccessResponse(res, 200, "Category found", category);

    } catch (error) {
        next(error)
    }
}
export const updateCategory: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const updatedData: models.ICategoryModel = req.body;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId))
            throw createHttpError(400, "Invalid ID format");
        if (!updatedData.title)
            throw createHttpError(400, "Category must have title");

        const updatedCategory: models.ICategoryModel | null = await models.CategoryModel.findByIdAndUpdate({ _id: categoryId, userId: authenticatedUserId }, updatedData, { new: true });

        if (!updatedCategory?.userId.equals(authenticatedUserId))
            throw createHttpError(404, "Category not found");
        if (updatedCategory) {
            return sendSuccessResponse(res, 200, "Category successfully updated", updatedCategory);
        }
        throw createHttpError(404, "Category not found.");
    }
    catch (error) {
        next(error);
    }
}
export const deleteCategory: RequestHandler = async (req, res, next) => {
    const categoryId: string | null = req.params.categoryId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId)
        if (!mongoose.isValidObjectId(categoryId))
            throw createHttpError(400, "Invalid ID format");
        const deletedCategory: models.ICategoryModel | null = await models.CategoryModel.findOneAndDelete({ _id: categoryId, userId: authenticatedUserId });

        if (deletedCategory) {
            return sendSuccessResponse(res, 204, "Category successfully deleted!");
        }
        throw createHttpError(404, "Category not found.");
    } catch (error) {
        next(error);
    }
}

//HELPER METHODS
const createUncategorizedWorkspace = async (newWorkspace: models.IWorkspaceModel, authenticatedUserId: mongoose.Types.ObjectId | null) => {
    assertIsDefined(authenticatedUserId)
    const uncategorizedCategory = await findOrCreateUncategorizedCategory(authenticatedUserId);

    uncategorizedCategory.workspaces.push(newWorkspace);
    await uncategorizedCategory.save();
    return uncategorizedCategory;
};

const findOrCreateUncategorizedCategory = async (authenticatedUserId: mongoose.Types.ObjectId | null) => {
    assertIsDefined(authenticatedUserId)
    const existingCategory = await models.CategoryModel.findOne({ title: "Uncategorized", userId: authenticatedUserId });

    if (existingCategory)
        return existingCategory;

    const newCategory = new models.CategoryModel({ title: "Uncategorized", userId: authenticatedUserId, workspaces: [] });
    await newCategory.save();

    return newCategory;
}

async function findWorkspaceByIdInCategoryOrFail(category: models.ICategoryModel, workspaceId: string | undefined, authenticatedUserId: mongoose.Types.ObjectId | null) {
    //checking if category is owned by user. The category passed should ALWAYS be checked already, but just in case.
    assertIsDefined(authenticatedUserId)
    if (!category.userId.equals(authenticatedUserId)) {
        throw createHttpError(403, "You cannot access this category");
    }
    const cat: models.ICategoryModel | null = await models.CategoryModel.findOne({ _id: category._id, userId: authenticatedUserId });
    const workspace = cat?.workspaces.id(workspaceId);
    if (!workspace)
        throw createHttpError(404, "Workspace not found");
    return workspace;
}

async function findUserOwnedCategoryByIdOrFail(categoryId: string | undefined, authenticatedUserId: mongoose.Types.ObjectId | null) {
    assertIsDefined(authenticatedUserId)
    const category: models.ICategoryModel | null = await models.CategoryModel.findOne({ _id: categoryId, userId: authenticatedUserId });
    if (!category)
        throw createHttpError(404, "Category or parent category not found");
    return category;
}
