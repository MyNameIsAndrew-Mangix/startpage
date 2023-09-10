import {
  Category as CategoryModel,
  Workspace as WorkspaceModel,
} from "../models/category";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { BiMove } from "react-icons/bi";
interface WorkspaceProps {
  workspace: WorkspaceModel;
  id: string;
  categoryId: string;
  category: CategoryModel;
}

const Workspace: React.FC<WorkspaceProps> = ({
  workspace,
  id,
  categoryId,
  category,
}) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: workspace._id,
    data: {
      type: "Workspace",
      workspace,
    },
    disabled: editMode,
  });

  const isValidUrl = (url: string | URL) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const openSites = () => {
    if (Array.isArray(workspace.sites) && workspace.sites.length > 0) {
      const validSiteUrls = workspace.sites
        ?.map((site) => {
          const absoluteUrl =
            site.url.startsWith("http://") || site.url.startsWith("https://")
              ? site.url
              : "https://" + site.url;
          return isValidUrl(absoluteUrl) ? absoluteUrl : null;
        })
        .filter((url) => url !== null) as string[];
      validSiteUrls.reverse();
      for (let i = 0; i < validSiteUrls.length; i++) {
        window.open(validSiteUrls[i], "_blank");
        console.log(validSiteUrls[i]);
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style}>
        <button onClick={openSites}>{workspace.title}</button>
        <BiMove {...attributes} {...listeners} />
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style}>
      <button onClick={openSites}>{workspace.title}</button>
      <BiMove {...attributes} {...listeners} />
    </div>
  );
};

export default Workspace;
