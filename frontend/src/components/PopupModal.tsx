import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styleUtils from "../styles/utils.module.css";

const PopupModal: React.FC = () => {
  const [hidePopup, setHidePopup] = useState<boolean>(false);
  const [showAgain, setShowAgain] = useState<boolean>(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem("showAgain");
    if (storedPreference !== null) setHidePopup(storedPreference === "true");
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPreference = event.target.checked;
    localStorage.setItem("showAgain", String(newPreference));
    setShowAgain((prevShowAgain) => !prevShowAgain);
  };

  const onClose = () => {
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
    <>
      {!hidePopup && (
        <Modal show={true} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>🚀 Enable Your Experience! 🚀</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              To make the most of our app, consider enabling pop-ups. Enabling
              pop-ups will allow us to open links and resources in new tabs, the
              entire point of our app!
            </p>

            <h2>👉 Why Enable Pop-ups?</h2>
            <ul>
              <li>
                <p>A seamless experience.</p>
              </li>
              <li>
                <p>✨Full functionality of the app!✨</p>
              </li>
            </ul>
            <label>
              <input
                type="checkbox"
                checked={showAgain}
                onChange={handleCheckboxChange}
              />
              <span className={styleUtils.checkboxText}>
                Don't show this message again
              </span>
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={onEnablePopups}>
              Enable Pop-ups
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Not now
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default PopupModal;
