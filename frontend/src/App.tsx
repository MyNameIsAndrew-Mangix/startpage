import React, { useEffect, useState } from "react";
import {
  Category as CategoryModel,
  Workspace as WorkspaceModel,
} from "./models/category";
import Category from "./components/Category";
import PopupModal from "./components/PopupModal";
import AddEditCategoryDialogue from "./components/AddEditWorkspaceDialogue";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import styles from "./styles/CategoryPage.module.css";
import * as CategoryApi from "./network/category_api";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function App() {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCategoriesLoadingError, setShowCatgoriesLoadingError] =
    useState(false);
  const initialHidePopup = localStorage.getItem("hidePopup") === "true";
  const [hidePopup, setHidePopup] = useState(initialHidePopup);
  const [showAddCategoryDialogue, setShowAddCategoryDialogue] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryModel | null>(
    null
  );

  const onClosePopup = () => {
    setHidePopup(true);
  };

  const onEnablePopups = () => {
    setHidePopup(true);
    window.open(
      "https://lmgt.org/?q=how+do+I+allow+popups+for+a+site+on+my+browser",
      "_blank"
    );
  };

  const moveWorkspaceToCategory = (
    draggedWorkspace: WorkspaceModel,
    sourceCategory: CategoryModel,
    targetCategory: CategoryModel
  ) => {
    console.log("I am here");
    const updatedCategories = categories.map((category) => {
      if (category === sourceCategory) {
        return {
          ...category,
          workspaces: category.workspaces.filter(
            (workspace) => workspace._id !== draggedWorkspace._id
          ),
        };
      }
      if (category === targetCategory) {
        return {
          ...category,
          workspaces: [...category.workspaces, draggedWorkspace],
        };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

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

  useEffect(() => {
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
    loadCategories();
  }, []);

  const categoryGrid = (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                onUpdateWorkspaceOrder={(newWorkspaceOrder: string[]) => {
                  onUpdateWorkspaceOrder(category._id, newWorkspaceOrder);
                }}
                onChangeCategory={moveWorkspaceToCategory}
                categories={categories}
              />
            </Col>
          ))}
        </Row>
      </SortableContext>
    </DndContext>
  );

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

  return (
    <div className="App">
      <div>
        {!hidePopup && (
          <PopupModal onClose={onClosePopup} onEnablePopups={onEnablePopups} />
        )}
      </div>
      <main>
        <Container className={styles.categoryPage}>
          {categoriesLoading && (
            <Spinner animation="border" variant="primary" />
          )}
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
      </main>
    </div>
  );
}

export default App;
