import { useEffect, useMemo, useState } from "react";
import {
  Category as CategoryModel,
  Workspace as WorkspaceModel,
  Site as SiteModel,
} from "../models/category";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Workspace from "./Workspace";
import styles from "../styles/CategoryPage.module.css";
import Category from "./Category";
import * as CategoryApi from "../network/category_api";
import { Spinner } from "react-bootstrap";
import { User } from "../models/user";

interface CategoryPageLoggedInViewProps {
  loggedInUser: User;
}

function CategoryPageLoggedInView({
  loggedInUser,
}: CategoryPageLoggedInViewProps) {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const categoriesId = useMemo(
    () => categories.map((cat) => cat._id),
    [categories]
  );

  const [workspaces, setWorkspaces] = useState<WorkspaceModel[]>([]);

  const [activeCategory, setActiveCategory] = useState<CategoryModel | null>(
    null
  );

  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceModel | null>(
    null
  );

  const [showCategoriesLoadingError, setShowCatgoriesLoadingError] =
    useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [originalParentCategoryId, setOriginalParentCategoryId] = useState<
    string | null
  >(null);

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  async function loadCategories() {
    try {
      setShowCatgoriesLoadingError(false);
      setCategoriesLoading(true);
      const categoriesData = await CategoryApi.fetchCategories();
      setCategories(categoriesData);
      const allWorkspaces = categoriesData.reduce(
        (acc: WorkspaceModel[], category: CategoryModel) => [
          ...acc,
          ...category.workspaces,
        ],
        []
      );
      setWorkspaces(allWorkspaces);
    } catch (error) {
      console.error(error);
      setShowCatgoriesLoadingError(true);
    } finally {
      setCategoriesLoading(false);
      setInitialDataLoaded(true);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    console.log(initialDataLoaded);
    if (initialDataLoaded) {
      console.log(`State has changed for ${workspaces}`);
    }
  }, [workspaces, initialDataLoaded]);

  async function createWorkspace(categoryId: string) {
    try {
      const workspaceToAdd: WorkspaceModel = {
        _id: "",
        title: `Workspace ${
          (categories.find((category) => category._id === categoryId)
            ?.workspaces?.length || 0) + 1
        }`,
        parentCategoryId: categoryId,
      };
      const workspacePromise = await CategoryApi.createWorkspace(
        CategoryApi.workspaceToWorkspaceInput(workspaceToAdd),
        categoryId
      );
      const newWorkspace: WorkspaceModel = await workspacePromise;
      setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
      const catIndex = categories.findIndex((cat) => cat._id === categoryId);
      if (catIndex !== -1) {
        const updatedCategory = { ...categories[catIndex] };
        updatedCategory.workspaces = [
          ...updatedCategory.workspaces,
          newWorkspace,
        ];
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories];
          updatedCategories[catIndex] = updatedCategory;
          return updatedCategories;
        });
      }
    } catch (error) {
      alert(error);
    }
  }

  function updateWorkspace(workspace: WorkspaceModel, content: SiteModel[]) {
    const updatedWorkspaces = workspaces.map((work) => {
      if (work._id !== workspace._id) return work;

      return { ...work, content };
    });
    setWorkspaces(updatedWorkspaces);
    alert("to be implemented");
  }
  async function deleteWorkspace(
    workspace: WorkspaceModel,
    parentCategoryId: string
  ) {
    try {
      console.log(workspace);
      if (!workspace.parentCategoryId) {
        workspace.parentCategoryId = parentCategoryId;
      }
      if (workspace.parentCategoryId) {
        await CategoryApi.deleteWorkspace(
          workspace.parentCategoryId,
          workspace._id
        );
        setWorkspaces((prevWorkspaces) =>
          prevWorkspaces.filter(
            (existingWorkspace) => existingWorkspace._id !== workspace._id
          )
        );
        const catIndex = categories.findIndex((cat) =>
          cat.workspaces.some((work) => work._id === workspace._id)
        );
        if (catIndex !== -1) {
          const updatedCategory = { ...categories[catIndex] };
          updatedCategory.workspaces = updatedCategory.workspaces.filter(
            (work) => work._id !== workspace._id
          );
          setCategories((prevCategories) => {
            const updatedCategories = [...prevCategories];
            updatedCategories[catIndex] = updatedCategory;
            return updatedCategories;
          });
        }
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async function createCategory() {
    const categoryToAdd: CategoryModel = {
      _id: "",
      workspaces: [],
      title: `Category ${categories.length + 1}`,
      userId: loggedInUser._id,
    };
    try {
      const categoryPromise = await CategoryApi.createCategory(
        CategoryApi.categoryToCategoryInput(categoryToAdd)
      );
      setCategories([...categories, await categoryPromise]);
    } catch (error) {
      alert(error);
    }
  }

  async function deleteCategory(category: CategoryModel) {
    try {
      await CategoryApi.deleteCategory(category._id);
      setCategories(
        categories.filter(
          (existingCategory) => existingCategory._id !== category._id
        )
      );
      setWorkspaces(
        workspaces.filter(
          (workspace) => workspace.parentCategoryId !== category._id
        )
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async function updateCategory(category: CategoryModel, title?: string) {
    if (title) {
      setCategories((prevCategories) =>
        prevCategories.map((cat) => {
          if (cat._id !== category._id) return cat;
          return { ...cat, title };
        })
      );
    }

    try {
      await CategoryApi.updateCategory(
        category._id,
        CategoryApi.categoryToCategoryInput(category)
      );
    } catch (error) {
      alert(error);
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Category") {
      setActiveCategory(event.active.data.current.category);
      return;
    }

    if (event.active.data.current?.type === "Workspace") {
      setActiveWorkspace(event.active.data.current.workspace);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveCategory(null);
    setActiveWorkspace(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      return;
    }

    const isActiveACategory = active.data.current?.type === "Category";
    if (isActiveACategory) {
      setCategories((categories) => {
        const activeCategoryIndex = categories.findIndex(
          (cat) => cat._id === activeId
        );

        const overCategoryIndex = categories.findIndex(
          (cat) => cat._id === overId
        );
        return arrayMove(categories, activeCategoryIndex, overCategoryIndex);
      });
    } else return;
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAWorkspace = active.data.current?.type === "Workspace";
    const isOverAWorkspace = over.data.current?.type === "Workspace";

    if (!isActiveAWorkspace) return;

    if (isActiveAWorkspace && isOverAWorkspace) {
      setWorkspaces((workspaces) => {
        const activeIndex = workspaces.findIndex(
          (work) => work._id === activeId
        );
        const overIndex = workspaces.findIndex((work) => work._id === overId);
        if (
          workspaces[activeIndex].parentCategoryId !==
          workspaces[overIndex].parentCategoryId
        ) {
          workspaces[activeIndex].parentCategoryId =
            workspaces[overIndex].parentCategoryId;

          return arrayMove(workspaces, activeIndex, overIndex - 1);
        }

        return arrayMove(workspaces, activeIndex, overIndex);
      });
    }

    const isOverACategory = over.data.current?.type === "Category";

    if (isActiveAWorkspace && isOverACategory) {
      setWorkspaces((workspaces) => {
        const activeIndex = workspaces.findIndex(
          (work) => work._id === activeId
        );
        workspaces[activeIndex].parentCategoryId = String(overId);
        return arrayMove(workspaces, activeIndex, activeIndex);
      });
    }
  }

  const categoryGrid = (
    <div className={styles.categoryGrid} style={{ margin: "auto" }}>
      <div className={styles.categoryGrid}>
        <SortableContext items={categoriesId}>
          {categories.map((cat) => (
            <Category
              key={cat._id}
              category={cat}
              deleteCategory={deleteCategory}
              updateCategory={updateCategory}
              createWorkspace={createWorkspace}
              deleteWorkspace={deleteWorkspace}
              updateWorkspace={updateWorkspace}
              workspaces={workspaces.filter(
                (workspace) => workspace.parentCategoryId === cat._id
              )}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => {
          createCategory();
        }}
        className="catButton"
      >
        Add Category
      </button>
    </div>
  );

  return (
    <div className={styles.categoryPage}>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        {categoriesLoading && <Spinner animation="border" variant="primary" />}
        {showCategoriesLoadingError && (
          <p>Something went wrong, please refresh the page.</p>
        )}
        {!categoriesLoading && !showCategoriesLoadingError && (
          <>
            {categories.length > 0 ? (
              categoryGrid
            ) : (
              <p>You don't have any workspaces setup yet!</p>
            )}
          </>
        )}

        {createPortal(
          <DragOverlay>
            {activeCategory && (
              <Category
                category={activeCategory}
                deleteCategory={deleteCategory}
                updateCategory={updateCategory}
                createWorkspace={createWorkspace}
                deleteWorkspace={deleteWorkspace}
                updateWorkspace={updateWorkspace}
                workspaces={workspaces.filter(
                  (workspace) =>
                    workspace.parentCategoryId === activeCategory._id
                )}
              />
            )}
            {activeWorkspace && (
              <Workspace
                workspace={activeWorkspace}
                deleteWorkspace={deleteWorkspace}
                updateWorkspace={updateWorkspace}
                parentCategoryId={
                  workspaces.find(
                    (workspace) => workspace._id === activeWorkspace._id
                  )?.parentCategoryId || ""
                }
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
export default CategoryPageLoggedInView;
