import { InferSchemaType, model, Schema, Document } from "mongoose";

interface Site {
    title: string;
    url: string;
}

const siteSchema = new Schema<Site>({
    title: { type: String},
    url: { type: String, required: true}
})

interface Workspace extends Document {
    title: string;
    sites: Site[];
}

const workspaceSchema = new Schema<Workspace>({
    title: { type: String, required: true},
    sites: { type: [siteSchema], },
}) 

interface Category extends Document {
    title: string;
    workspaces: Workspace[];
}


const categorySchema = new Schema<Category>({
    title: { type: String, required: true},
    workspaces:[ { type: [workspaceSchema]  }],
})

type CategoryModel = InferSchemaType<typeof categorySchema>;

export default model<CategoryModel>("Category", categorySchema);