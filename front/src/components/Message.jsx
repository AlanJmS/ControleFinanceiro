import { useState, useEffect, useRef } from "react";
import styles from "./Message.module.css";

export default function Message({ text, type }) {
    const [visible, setVisible] = useState(false);
    const renderCountRef = useRef(0);

    useEffect(() => {
        renderCountRef.current += 1;
        if (!text) {
            setVisible(false);
            return;
        };
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [text, renderCountRef.current]);

    return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>{text}</div>
            )}
        </>
    );
};