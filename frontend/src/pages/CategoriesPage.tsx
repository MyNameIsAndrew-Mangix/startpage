import CategoryPageLoggedInView from "../components/CategoryPageLoggedInView";
import CategoryPageLoggedOutView from "../components/CategoryPageLoggedOutView";
import { User } from "../models/user";
interface CategoriesPageProps {
  loggedInUser: User | null;
}
const CategoriesPage = ({ loggedInUser }: CategoriesPageProps) => {
  return (
    <>
      {loggedInUser ? (
        <CategoryPageLoggedInView loggedInUser={loggedInUser} />
      ) : (
        <CategoryPageLoggedOutView />
      )}
    </>
  );
};

export default CategoriesPage;
