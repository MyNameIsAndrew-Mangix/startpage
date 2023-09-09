import { Button, Form, Modal, ModalHeader } from "react-bootstrap";
import { Category } from "../models/category";
import { CategoryInput } from "../network/category_api";
import * as categoryAPI from "../network/category_api";
import { useForm } from "react-hook-form";

interface AddEditCategoryDialogueProps {
    categoryToEdit?: Category,
    onDismiss: () => void,
    onCategorySaved: (category: Category) => void,

}

const AddEditCategoryDialogue = ({categoryToEdit, onDismiss, onCategorySaved}: AddEditCategoryDialogueProps) => {
    
    const { register, handleSubmit, formState : { errors, isSubmitting} } = useForm<CategoryInput>({
        defaultValues: {
            title: categoryToEdit?.title || "",
            workspaces: categoryToEdit?.workspaces || [],
        }
    });
    
    async function onSubmit(input: CategoryInput) {
try {
    let categoryResponse: Category;
    if (categoryToEdit) {
        categoryResponse = await categoryAPI.updateCategory(categoryToEdit._id, input)
    }
    else {
        categoryResponse = await categoryAPI.createCategory(input);
    }
    onCategorySaved(categoryResponse);
} catch (error) {
    console.log(error);
    alert(error);
}
    }
    return (
        <Modal show onHide={onDismiss}>
            <ModalHeader closeButton>
                <Modal.Title>
                    {categoryToEdit ? "Edit Category" : "Add Category"}
                </Modal.Title>
            </ModalHeader>
            <Modal.Body>
                <Form id="addEditCategoryForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Title"
                        isInvalid={!!errors.title}
                        {...register("title", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.title?.message}
                        </Form.Control.Feedback>

            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>
                    Workspace
                </Form.Label>
                <Form.Control
                as="textarea"
                rows={5}
                placeholder="Text"
                {...register("workspaces") }/>

            </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                type="submit"
                form="addEditCategoryForm"
                disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddEditCategoryDialogue;