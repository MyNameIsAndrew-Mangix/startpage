import { useState } from "react";
import { Site, Workspace } from "../models/category";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BiTrash } from "react-icons/bi";
import styles from "../styles/CategoryPage.module.css";

interface WorkspaceProps {
  workspace: Workspace;
  deleteWorkspace: (worksace: Workspace, parentCategoryId: string) => void;
  updateWorkspace: (workspace: Workspace, content: Site[]) => void;
  parentCategoryId: string;
}

function WorkspaceCard({
  workspace,
  deleteWorkspace,
  updateWorkspace,
  parentCategoryId,
}: WorkspaceProps) {
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

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

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

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className={styles.workspaceGhost} />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={styles.workspace}
      >
        <button
          className=""
          autoFocus
          placeholder="Workspace content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
        >
          {workspace.title}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className={styles.workspace}
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <button onClick={openSites}>{workspace.title}</button>

      {mouseIsOver && (
        <button
          onClick={() => {
            deleteWorkspace(workspace, workspace.parentCategoryId);
          }}
          className={styles.workspaceDelete}
        >
          <BiTrash />
        </button>
      )}
    </div>
  );
}

export default WorkspaceCard;
