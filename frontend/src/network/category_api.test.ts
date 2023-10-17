import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import * as CategoryApi from "./category_api";


const MOCK_DATA = [
    {
        _id: "64f5d22c4b4b66d33b8d03e3",
        title: "this is a test",
        workspaces: [{
            title: "Unity",
            sites: [{
                title: "What Should I Make? Beginner Programming Project Ideas - Programming for Beginners",
                url: "https://www.programmingforbeginnersbook.com/blog/what_should_i_make_beginner_programming_project_ideas/",
                _id: "650e1cccd4428ac3fb4f1703"
            },
            {
                title: "Unity - Scripting API:",
                url: "https://docs.unity3d.com/ScriptReference/index.html",
                _id: "650e1cccd4428ac3fb4f1704"
            },
            {
                title: "C# Programming Guide | Microsoft Docs",
                url: "https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/",
                _id: "650e1cccd4428ac3fb4f1705"
            },
            {
                title: "Documentation for Visual Studio Code",
                url: "https://code.visualstudio.com/docs",
                _id: "650e1cccd4428ac3fb4f1706"
            },
            {
                title: "Grids and Graphs",
                url: "https://www.redblobgames.com/pathfinding/grids/graphs.html",
                _id: "650e1cccd4428ac3fb4f1707"
            },
            {
                title: "Component-Save-System-Manual-v1.1.pdf",
                url: "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://low-scope.com/wp-content/uploads/2020/10/Component-Save-System-Manual-v1.1.pdf",
                _id: "650e1cccd4428ac3fb4f1708"
            }],
            "parentCategoryId": "64f5d22c4b4b66d33b8d03e3",
            _id: "650e1cccd4428ac3fb4f1702"
        },
        {
            title: "Workspace 2",
            sites: [],
            "parentCategoryId": "64f5d22c4b4b66d33b8d03e3",
            _id: "6521e4d8e6085e43c0b3fee3",
            "__v": 0
        }],
        "__v": 93,
        "userId": "6500665d739b70a010151bbc"
    }
]



export { }