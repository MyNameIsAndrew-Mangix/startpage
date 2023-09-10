import { Workspace as WorkspaceModel } from "../models/category";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BiMove } from "react-icons/bi";
interface WorkspaceProps {
  workspace: WorkspaceModel;
  id: string;
}

const Workspace: React.FC<WorkspaceProps> = ({ workspace }) => {
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

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: workspace._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button onClick={openSites}>{workspace.title}</button>
      <BiMove {...attributes} {...listeners} />
      <ul>
        {/* { workspace.sites?.map(( site => (
                    <Site site={site} key={site._id} />
                )))} */}
      </ul>
    </div>
  );
};

export default Workspace;
