import { useState, useEffect } from "react";
import styles from "./Message.module.css";

export default function Message({ text, type }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!text) {
            setVisible(false);
            return;
        };
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, [text]);

    return (
        <div className={`${styles.message} ${styles[type]}`}>{text}</div>
    );
};