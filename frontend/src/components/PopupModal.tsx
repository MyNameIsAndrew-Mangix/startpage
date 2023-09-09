import { useEffect, useState } from "react";
import styles from '../styles/PopupModal.module.css'


interface PopupModalProps {
    onClose: () => void;
    onEnablePopups: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({onClose, onEnablePopups}) => {
    const [hidePopup, setHidePopup] = useState(false);
    
    useEffect(() => {
        const storedPreference = localStorage.getItem('hidePopup');
        if (storedPreference !== null)
        setHidePopup(storedPreference === 'true');
    }, []);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPreference = event.target.checked;
        setHidePopup(newPreference);
        localStorage.setItem('hidePopup', String(newPreference));
    };
return (
        <div className={styles.popupModal}>
            <div className={styles.popupContent}>
            <h2>🚀 Enable Your Experience! 🚀</h2>
            <p>To make the most of our app, consider enabling pop-ups. Enabling pop-ups will allow us to 
                open links and resources in new tabs, the entire point of our app! </p>

            <h2>👉 Why Enable Pop-ups?</h2>
           <ul>
            <li><p>A seamless experience.</p></li>
            <li><p>✨Full functionality of the app!✨</p></li>
            </ul>
            <label >
                <input type="checkbox" checked={hidePopup} onChange={handleCheckboxChange} />
                Don't show this message again
            </label>
                <button onClick={onEnablePopups}>Enable Pop-ups</button>
                <button onClick={onClose}>Not now</button>
            </div>
        </div>
    );
};

export default PopupModal;