export interface Site {
    _id: string,
    title?: string,
    url: string,
}

export interface Workspace {
    _id: string,
    title: string,
    sites?: Site[]
    parentCategoryId: string;
}

export interface Category {
    userId: string,
    _id: string,
    title: string,
    workspaces: Workspace[]
}