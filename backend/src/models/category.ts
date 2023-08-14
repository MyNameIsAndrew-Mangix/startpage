import { model, Schema, Document, Types} from "mongoose";

interface ISite {
    name?: string;
    url: string;
}

interface IWorkspace {
    title: string;
    sites?: ISite[];
}

interface ICategory {
    title: string;
    workspaces?: IWorkspace[];
}

const siteSchema = new Schema<ISite>({
    name: { type: String},
    url: { type: String, required: true}
})

const workspaceSchema = new Schema<IWorkspace>({
    title: { type: String, required: true},
    sites: [{ type: siteSchema }],
}) 

const categorySchema = new Schema<ICategory>({
    title: { type: String, required: true, unique: true},
    workspaces:[ { type: [workspaceSchema]  }],
})

const SiteModel = model<ISiteModel>("Site", siteSchema)
const WorkspaceModel = model<IWorkspaceModel>("Workspace", workspaceSchema);
const CategoryModel = model<ICategoryModel>("Category", categorySchema);

categorySchema.statics.createUncategorizedWorkspace = async function(workspace:IWorkspaceModel) {
  const uncategorizedCategory = await this.findOne({ title: "Uncategorized"});
  if (uncategorizedCategory) {
    uncategorizedCategory.workspaces.push(workspace);
    await uncategorizedCategory.save();

    return uncategorizedCategory;
  }
  const newCategory = new CategoryModel({ title: "Uncategorized" });
  await newCategory.save();

  newCategory.workspaces.push(workspace);
  newCategory.save();
  
  return newCategory;
} 

export interface ISiteModel extends ISite, Document {}
export interface IWorkspaceModel extends IWorkspace, Document {
    sites: Types.DocumentArray<ISiteModel>;
}
export interface ICategoryModel extends ICategory, Document {
    workspaces: Types.DocumentArray<IWorkspaceModel>;
}

export { SiteModel, WorkspaceModel, CategoryModel };