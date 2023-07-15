import { RequestHandler } from "express";
import CategoryModel from "../models/category";


export const createWorkspace: RequestHandler =  async (req, res, next) => {
    
}
export const getWorkspace: RequestHandler =  async (req, res, next) => {
    
}
export const updateWorkspace: RequestHandler =  async (req, res, next) => {
    
}
export const deleteWorkspace: RequestHandler =  async (req, res, next) => {
    
}
export const createCategory: RequestHandler =  async (req, res, next) => {
    
}
export const getCategory: RequestHandler =  async (req, res, next) => {
    
}
export const updateCategory: RequestHandler =  async (req, res, next) => {
    
}
export const deleteCategory: RequestHandler =  async (req, res, next) => {
    
}



export const getCategories: RequestHandler =  async (req, res, next) => {
    try {
        const categories = await CategoryModel.find().exec();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const createCategories: RequestHandler = async (req, res, next) => {
    const title = req.body.title;
    const workspaces = req.body.workspaces;
    try {
        const newCategory = await CategoryModel.create({
            title: title,
            workspaces: workspaces,
        });
        res.status(201).json(newCategory);
 } catch (error) {
    next(error);
 }   
}