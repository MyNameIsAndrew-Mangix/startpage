import React from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Category from "./Category";
import {
  Category as CategoryModel,
  Workspace as WorkspaceModel,
} from "../models/category";

interface CategoryContainerProps {
  categories: CategoryModel[];
  onUpdateWorkspaceOrder: (newWorkspaceOrder: string[]) => void;
  onChangeCategory: (
    draggedWorkspace: WorkspaceModel,
    sourceCategory: CategoryModel,
    targetCategory: CategoryModel
  ) => void;
}

const CategoryContainer: React.FC<CategoryContainerProps> = ({
  categories,
  onUpdateWorkspaceOrder,
  onChangeCategory: onMoveWorkspace,
}) => {
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

    if (active.id !== over?.id) {
      const draggedWorkspace = category.workspaces.find(
        (workspace) => workspace._id === active.id
      );
      console.log(active.id);
      console.log("OVER ID:" + over?.id);
      const sourceCategory = category;
      const targetCategory = over
        ? categories.find((cat) => cat._id === String(over.id))
        : null;
      if (draggedWorkspace) console.log("HELLLOOOOO");
      console.log(targetCategory);
      if (
        draggedWorkspace &&
        targetCategory &&
        targetCategory !== sourceCategory
      ) {
        onMoveWorkspace(draggedWorkspace, sourceCategory, targetCategory);
      } else {
        const fromIndex = workspaceIds.indexOf(String(active.id));
        const toIndex = workspaceIds.indexOf(String(over?.id));
        if (fromIndex !== -1 && toIndex !== -1) {
          const newWorkspaceOrder = arrayMove(workspaceIds, fromIndex, toIndex);
          onUpdateWorkspaceOrder(newWorkspaceOrder);
        }
      }
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={allWorkspaces.map((workspace) => workspace._id)}
        strategy={verticalListSortingStrategy}
      ></SortableContext>
    </DndContext>
  );
};

export default CategoryContainer;
