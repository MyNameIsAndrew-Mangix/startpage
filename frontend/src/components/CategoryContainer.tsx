import React, { useEffect, useState } from "react";
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
import Category from "./Category";
import * as CategoryApi from "../network/category_api";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import AddEditCategoryDialogue from "./AddEditWorkspaceDialogue";
import { CSS } from "@dnd-kit/utilities";
import styles from "../styles/CategoryPage.module.css";

import {
  Category as CategoryModel,
  Workspace as WorkspaceModel,
} from "../models/category";

function CategoryContainer() {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCategoriesLoadingError, setShowCatgoriesLoadingError] =
    useState(false);

  const [showAddCategoryDialogue, setShowAddCategoryDialogue] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryModel | null>(
    null
  );
  async function loadCategories() {
    try {
      setShowCatgoriesLoadingError(false);
      setCategoriesLoading(true);
      const categoriesData = await CategoryApi.fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
      setShowCatgoriesLoadingError(true);
    } finally {
      setCategoriesLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const onUpdateWorkspaceOrder = (
    categoryId: string,
    newWorkspaceOrder: string[]
  ) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category) => {
        if (category._id === categoryId) {
          const updatedWorkspaces = newWorkspaceOrder
            .map((workspaceId) =>
              category.workspaces.find(
                (workspace) => workspace._id === workspaceId
              )
            )
            .filter((workspace) => workspace !== undefined) as WorkspaceModel[];

          return {
            ...category,
            workspaces: updatedWorkspaces,
          } as CategoryModel;
        }
        return category;
      });
      return updatedCategories;
    });
  };

  const onMoveWorkspace = (
    draggedWorkspaceId: string,
    sourceCategoryId: string,
    targetCategoryId: string
  ) => {
    setCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category._id === sourceCategoryId) {
          const draggedWorkspaceIndex = category.workspaces.findIndex(
            (workspace) => workspace._id === draggedWorkspaceId
          );

          if (draggedWorkspaceIndex !== -1) {
            const draggedWorkspace = category.workspaces[draggedWorkspaceIndex];
            category.workspaces.splice(draggedWorkspaceIndex, 1);

            const targetCategory = prevCategories.find(
              (cat) => cat._id === targetCategoryId
            );

            if (targetCategory) {
              targetCategory.workspaces.push(draggedWorkspace);
            }
          }
        }
        return category;
      });
    });
  };

  const allWorkspaces = categories.reduce(
    (acc: WorkspaceModel[], category: CategoryModel) => [
      ...acc,
      ...category.workspaces,
    ],
    []
  );

  const workspaceIds = allWorkspaces.map((workspace) => workspace._id);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over?.id) {
      const draggedWorkspaceId = active.id;
      const sourceCategoryId = active.data.current?.categoryId;
      const targetCategoryId = over ? over.id : null;

      const sourceCategory = categories.find(
        (category) => category._id === sourceCategoryId
      );
      const targetCategory = categories.find(
        (category) => category._id === targetCategoryId
      );

      if (draggedWorkspaceId && sourceCategoryId !== targetCategoryId) {
        //backend updates as needed
        if (sourceCategoryId && targetCategoryId) {
          onMoveWorkspace(
            String(draggedWorkspaceId),
            sourceCategoryId,
            String(targetCategoryId)
          );
        }
      } else {
        const fromIndex = workspaceIds.indexOf(String(active.id));
        const toIndex = workspaceIds.indexOf(String(over?.id));
        if (fromIndex !== -1 && toIndex !== -1) {
          if (sourceCategoryId) {
            const newWorkspaceOrder = arrayMove(
              workspaceIds,
              fromIndex,
              toIndex
            );
            onUpdateWorkspaceOrder(sourceCategoryId, newWorkspaceOrder);
          }
        }
      }
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
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  const categoryGrid = (
    <DndContext collisionDetection={} onDragEnd={handleDragEnd}>
      <SortableContext
        items={allWorkspaces.map((workspace) => workspace._id)}
        strategy={verticalListSortingStrategy}
      >
        <Row xs={1} md={3} xl={5} className={`g-4 ${styles.categoryGrid}`}>
          {categories.map((category) => (
            <Col key={category._id}>
              <Category
                onCategoryClicked={setCategoryToEdit}
                category={category}
                className={styles.category}
                onDeleteCategoryClicked={deleteCategory}
              />
            </Col>
          ))}
        </Row>
      </SortableContext>
    </DndContext>
  );

  return (
    <Container className={styles.categoryPage}>
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
      {showAddCategoryDialogue && (
        <AddEditCategoryDialogue
          onDismiss={() => setShowAddCategoryDialogue(false)}
          onCategorySaved={(newCategory) => {
            setCategories([...categories, newCategory]);
            setShowAddCategoryDialogue(false);
          }}
        />
      )}
      {categoryToEdit && (
        <AddEditCategoryDialogue
          categoryToEdit={categoryToEdit}
          onDismiss={() => setCategoryToEdit(null)}
          onCategorySaved={(updatedCategory) => {
            setCategories(
              categories.map((existingCategory) =>
                existingCategory._id === updatedCategory._id
                  ? updatedCategory
                  : existingCategory
              )
            );
            setCategoryToEdit(null);
          }}
        />
      )}
    </Container>
  );
}

export default CategoryContainer;
