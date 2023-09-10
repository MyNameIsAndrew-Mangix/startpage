import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Category as CategoryModel } from "../models/category";
import Workspace from "./Workspace";
import { MdDelete } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import styleUtils from "../styles/utils.module.css";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CategoryProps {
  category: CategoryModel;
  onCategoryClicked: (category: CategoryModel) => void;
  onDeleteCategoryClicked: (category: CategoryModel) => void;
  className?: string;
}

const Category: React.FC<CategoryProps> = ({
  category,
  onCategoryClicked,
  onDeleteCategoryClicked,
  className,
}) => {
  const [editMode, setEditMode] = useState(false);
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

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return <div ref={setNodeRef} style={style}></div>;
  }

  return (
    <Card className={`${className}`} ref={setNodeRef} style={style}>
      <Card.Title
        className={styleUtils.flexCenter}
        {...attributes}
        {...listeners}
      >
        {category.title}
        <BiPencil
          className="text-muted"
          onClick={(e) => {
            onCategoryClicked(category);
            e.stopPropagation();
          }}
        />
        <MdDelete
          className="text-muted ms-auto"
          onClick={(e) => {
            onDeleteCategoryClicked(category);
            e.stopPropagation();
          }}
        />
      </Card.Title>
      <Card.Body>
        <SortableContext
          items={category.workspaces.map((workspace) => workspace._id)}
        >
          {category.workspaces.map((workspace) => (
            <Workspace
              workspace={workspace}
              key={workspace._id}
              id={workspace._id}
              categoryId={category._id}
              category={category}
              // onDragStart={() => onDragStart(workspace._id)}
              // onDragEnd={onDragEnd}
            />
          ))}
        </SortableContext>
        {category.workspaces.length === 0 && <div>This category is empty.</div>}
      </Card.Body>
    </Card>
  );
};
export default Category;
