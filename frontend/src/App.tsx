import { useEffect, useState } from "react";
import PopupModal from "./components/PopupModal";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import { User } from "./models/user";
import * as CategoryApi from "./network/category_api";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import NotFoundPage from "./pages/NotFoundPage";
import stylesUtil from "./styles/utils.module.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await CategoryApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <PopupModal />
        <div>
          <NavBar
            loggedInUser={loggedInUser}
            onLoginClicked={() => setShowLoginModal(true)}
            onSignedUpClicked={() => setShowSignUpModal(true)}
            onLogoutSuccessful={() => setLoggedInUser(null)}
          ></NavBar>
        </div>
        <main>
          <div className={stylesUtil.width100}>
            <Routes>
              <Route
                path="/"
                element={<CategoriesPage loggedInUser={loggedInUser} />}
              />
              <Route path="/*" element={<NotFoundPage />} />
            </Routes>
          </div>
          {showSignUpModal && (
            <SignUpModal
              onDismiss={() => setShowSignUpModal(false)}
              onSignUpSuccessful={(user) => {
                setLoggedInUser(user);
                setShowSignUpModal(false);
              }}
            />
          )}
          {showLoginModal && (
            <LoginModal
              onDismiss={() => setShowLoginModal(false)}
              onLoginSuccessful={(user) => {
                setLoggedInUser(user);
                setShowLoginModal(false);
              }}
            />
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
