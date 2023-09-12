import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface PopupModalProps {
  onClose: () => void;
  onEnablePopups: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({ onClose, onEnablePopups }) => {
  const [hidePopup, setHidePopup] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem("hidePopup");
    if (storedPreference !== null) setHidePopup(storedPreference === "true");
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPreference = event.target.checked;
    localStorage.setItem("hidePopup", String(newPreference));
  };
  return (
    <Modal show={!hidePopup} backdrop="static" keyboard={false}>
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
            checked={hidePopup}
            onChange={handleCheckboxChange}
          />
          Don't show this message again
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
  );
};

export default PopupModal;
