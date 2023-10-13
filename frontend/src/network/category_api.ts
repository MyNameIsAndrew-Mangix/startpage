import { ConflictError, UnAuthorizedError } from "../errors/http_errors";
import { Category, Workspace, Site } from "../models/category";
import { User } from "../models/user";


async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok)
        return response;
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    if (response.status === 401)
        throw new UnAuthorizedError(errorMessage);
    else if (response.status === 409)
        throw new ConflictError(errorMessage);
    else
        throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials)
        });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials)
        })
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" })
}

export async function fetchCategories(): Promise<Category[]> {
    const response = await fetchData("/api/category", { method: "GET" });
    return (await response.json()).data;
}

export interface SiteInput {
    title: string,
    url: string,
}

export interface WorkspaceInput {
    title: string,
    sites: SiteInput[],
    parentCategoryId: string,
}

export interface CategoryInput {
    title: string,
    id: string,
    workspaces: WorkspaceInput[],
}

export async function updateCategories(categories: CategoryInput[]): Promise<Category[]> {
    const response = await fetchData("/api/category/", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categories)
    });
    return response.json();
}

export async function createCategory(category: CategoryInput): Promise<Category> {
    const response = await fetchData("/api/category/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
    });
    const responseData = await response.json();
    return responseData.data;
}

export async function updateCategory(categoryId: string, category: CategoryInput): Promise<Category> {
    const response = await fetchData("/api/category/" + categoryId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
        });
    return response.json();
}

export async function deleteCategory(categoryId: string) {
    await fetchData("/api/category/" + categoryId, { method: "DELETE" });
}

export async function createWorkspace(workspace: WorkspaceInput, categoryId?: string) {
    const response = await fetchData("/api/category/" + categoryId + "/workspace", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workspace)
    })
    const responseData = await response.json();
    return responseData.data;
}

export async function deleteWorkspace(categoryId: string, workspaceId: string) {
    await fetchData("/api/category/" + categoryId + "/workspace/" + workspaceId, { method: "DELETE" });
}

//HELPER FUNCTIONS
export function categoryToCategoryInput(category: Category): CategoryInput {
    return {
        title: category.title,
        id: category._id,
        workspaces: category.workspaces.map((workspace) =>
            workspaceToWorkspaceInput(workspace)
        ),
    };
}

export function workspaceToWorkspaceInput(workspace: Workspace): WorkspaceInput {
    return {
        title: workspace.title,
        sites: (workspace.sites || []).map((site) => siteToSiteInput(site)),
        parentCategoryId: workspace.parentCategoryId,
    };
}

export function siteToSiteInput(site: Site): SiteInput {
    return {
        title: site.title || "",
        url: site.url,
    };
}