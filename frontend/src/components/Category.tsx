import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  Category as CategoryModel,
  Site as SiteModel,
  Workspace as WorkspaceModel,
} from "../models/category";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import Workspace from "./Workspace";
import { BiTrash } from "react-icons/bi";
import styles from "../styles/CategoryPage.module.css";

interface CategoryProps {
  category: CategoryModel;
  deleteCategory: (category: CategoryModel) => void;
  updateCategory: (category: CategoryModel, title: string) => void;

  createWorkspace: (categoryId: string) => void;
  updateWorkspace: (workspace: WorkspaceModel, content: SiteModel[]) => void;
  deleteWorkspace: (
    workspace: WorkspaceModel,
    parentCategoryId: string
  ) => void;
  workspaces: WorkspaceModel[];
}

function Category({
  category,
  deleteCategory,
  updateCategory,
  createWorkspace,
  workspaces,
  deleteWorkspace,
  updateWorkspace,
}: CategoryProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(category.title);

  const workspacesIds = useMemo(() => {
    return workspaces.map((workspace) => workspace._id);
  }, [workspaces]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category._id,
    data: {
      type: "Category",
      category,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={styles.categoryGhost}
      ></div>
    );
  }
  const handleOnBlurAndEnter = () => {
    if (editMode) {
      updateCategory(category, editedTitle);
      setEditMode(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.category}>
      {/* Category title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className={styles.categoryTitle}
      >
        <div className={styles.categoryGrid}>
          {!editMode && category.title}
          {editMode && (
            <input
              className={styles.changeName}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
              onBlur={() => {
                handleOnBlurAndEnter();
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                handleOnBlurAndEnter();
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteCategory(category);
          }}
          className=""
        >
          <BiTrash />
        </button>
      </div>

      {/* Category workspace container */}
      <div className={styles.categoryBody}>
        <SortableContext items={workspacesIds}>
          {workspaces.map((workspace) => (
            <Workspace
              key={workspace._id}
              workspace={workspace}
              deleteWorkspace={deleteWorkspace}
              updateWorkspace={updateWorkspace}
              parentCategoryId={category._id}
            />
          ))}
        </SortableContext>
      </div>
      {/* Category footer */}
      <button
        className={styles.addWorkspace}
        onClick={() => {
          createWorkspace(category._id);
        }}
      >
        Add workspace
      </button>
    </div>
  );
}

export default Category;
