import { useState } from "react";
import PopupModal from "./components/PopupModal";
import CategoryContainer from "./components/CategoryContainer";

function App() {
  const initialHidePopup = localStorage.getItem("hidePopup") === "true";
  const [hidePopup, setHidePopup] = useState(initialHidePopup);

  const onClosePopup = () => {
    setHidePopup(true);
  };

  const onEnablePopups = () => {
    setHidePopup(true);
    window.open(
      "https://lmgt.org/?q=how+do+I+allow+popups+for+a+site+on+my+browser",
      "_blank"
    );
  };

  return (
    <div className="App">
      <div>
        {!hidePopup && (
          <PopupModal onClose={onClosePopup} onEnablePopups={onEnablePopups} />
        )}
      </div>
      <main>
        <CategoryContainer />
      </main>
    </div>
  );
}

export default App;
