export interface Site {
    _id: string,
    title?: string,
    url: string,
}

export interface Workspace {
    _id: string,
    title: string,
    sites?: Site[]
}

export interface Category {
    _id: string,
    title: string,
    workspaces: Workspace[]
}