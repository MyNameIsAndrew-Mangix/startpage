import { Category, Workspace, Site } from "../models/category";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok)
        return response;
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
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

export async function signUp(credentials: SignUpCredentials):Promise<User> {
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

export async function login(credentials: LoginCredentials):Promise<User> {
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
    await fetchData("/api/users/logout", {method: "POST" })
}

export async function fetchCategories(): Promise<Category[]> {
    const response = await fetchData("/api/category", { method: "GET" });
    return (await response.json()).data;
}

export interface SiteInput{
    title: string,
    url: string,
}

export interface WorkspaceInput{
    title: string,
    sites: SiteInput[],
}

export interface CategoryInput{
    title: string,
    workspaces: WorkspaceInput[],
}

export async function createCategory(category: CategoryInput): Promise<Category> {
    const response = await fetchData("/api/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(category),
    });
    return response.json();
}

export async function updateCategory(categoryId:string, category: CategoryInput): Promise<Category> {
    const response = await fetchData("/api/category/" + categoryId,
    {
        method:"PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
    });
    return response.json();
}

export async function deleteCategory(categoryId: string) {
    await fetchData("/api/category/" + categoryId, {method: "DELETE"});
}