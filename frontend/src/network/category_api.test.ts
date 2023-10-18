// category_api.test.ts
import * as CategoryApi from "./category_api";

describe('updateCategories', () => {
    it('should update categories and return the updated data', async () => {
        // Define a sample category input for the update

        const categoryInput = {
            _id: "64f5d22c4b4b66d33b8d03e3",
            title: "this is a test",
            order: 0,
            workspaces: [{
                title: "Unity",
                sites: [{
                    title: "What Should I Make? Beginner Programming Project Ideas - Programming for Beginners",
                    url: "https://www.programmingforbeginnersbook.com/blog/what_should_i_make_beginner_programming_project_ideas/",
                },
                {
                    title: "Unity - Scripting API:",
                    url: "https://docs.unity3d.com/ScriptReference/index.html",
                },
                {
                    title: "C# Programming Guide | Microsoft Docs",
                    url: "https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/",
                },
                {
                    title: "Documentation for Visual Studio Code",
                    url: "https://code.visualstudio.com/docs",
                },
                {
                    title: "Grids and Graphs",
                    url: "https://www.redblobgames.com/pathfinding/grids/graphs.html",
                },
                {
                    title: "Component-Save-System-Manual-v1.1.pdf",
                    url: "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://low-scope.com/wp-content/uploads/2020/10/Component-Save-System-Manual-v1.1.pdf",
                }],
                "parentCategoryId": "64f5d22c4b4b66d33b8d03e3",
            },
            {
                title: "Workspace 2",
                sites: [],
                "parentCategoryId": "64f5d22c4b4b66d33b8d03e3",
            }],
        };

        // Mock the global fetch function
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            ok: true, // Simulate a successful response
            json: async () => ({ data: categoryInput }), // Simulate response.json()
        });

        // Call the updateCategories function
        const updatedCategories = await CategoryApi.updateCategories([categoryInput]);

        // Assert that fetch was called with the expected parameters
        expect(global.fetch).toHaveBeenCalledWith(
            "http://localhost:5000/api/category/",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([categoryInput]),
            }
        );

        // Assert that the function returns the expected data
        expect(updatedCategories).toEqual({ data: categoryInput });

        // Restore the original global.fetch
        global.fetch = originalFetch;
    });

    // Add more test cases as needed
});