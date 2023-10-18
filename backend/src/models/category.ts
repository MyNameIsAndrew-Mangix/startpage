import { model, Schema, Document, Types } from "mongoose";

interface ISite {
    title?: string;
    url: string;
}

interface IWorkspace {
    title: string;
    sites?: ISite[];
    parentCategoryId: string;
}

interface ICategory {
    title: string;
    order?: number;
    workspaces?: IWorkspace[];
    userId: Types.ObjectId;
}

const siteSchema = new Schema<ISite>({
    title: { type: String },
    url: { type: String, required: true }
})

const workspaceSchema = new Schema<IWorkspace>({
    title: { type: String, required: true },
    sites: [siteSchema],
    parentCategoryId: { type: String, required: true }
})

const categorySchema = new Schema<ICategory>({
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true, unique: true },
    order: { type: Number },
    workspaces: [workspaceSchema],
})

export interface ISiteModel extends ISite, Document { }
export interface IWorkspaceModel extends IWorkspace, Document {
    sites: Types.DocumentArray<ISiteModel>;
}
export interface ICategoryModel extends ICategory, Document {
    workspaces: Types.DocumentArray<IWorkspaceModel>;
}

const SiteModel = model<ISiteModel>("Site", siteSchema)
const WorkspaceModel = model<IWorkspaceModel>("Workspace", workspaceSchema);
const CategoryModel = model<ICategoryModel>("Category", categorySchema);

export { SiteModel, WorkspaceModel, CategoryModel };