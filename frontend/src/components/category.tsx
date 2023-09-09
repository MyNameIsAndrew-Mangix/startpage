import React from "react";
import { Card } from "react-bootstrap";
import { Category as CategoryModel } from "../models/category";
import Workspace from "./workspace";
import { MdDelete } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import styleUtils from "../styles/utils.module.css";

interface CategoryProps {
    category: CategoryModel,
    onCategoryClicked: (category: CategoryModel) => void,
    onDeleteCategoryClicked: (category: CategoryModel) => void,
    className?: string,
}

const Category: React.FC<CategoryProps> = ({ category, onCategoryClicked, onDeleteCategoryClicked, className }) => {
    category.workspaces.forEach(workspace => {
    })
    return (
        <Card className={`${className}`}>
            <Card.Title className={styleUtils.flexCenter}>
                { category.title }
                <BiPencil
                className="text-muted"
                onClick={(e) => {
                    onCategoryClicked(category);
                    e.stopPropagation();
                }}/>
                <MdDelete
                className="text-muted ms-auto"
                onClick={(e) => {
                    onDeleteCategoryClicked(category);
                    e.stopPropagation();
                }}/>
            </Card.Title>
            <Card.Body>
                { category.workspaces.map(workspace => (
                    <Workspace workspace={workspace} key={workspace._id} />
                ))}
                { category.workspaces.length === 0 && (
                    <div>
                        This category is empty.
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default Category;