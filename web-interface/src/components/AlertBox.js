import React from 'react';
import styles from './AlertBox.module.css';

function AlertBox({ type = 'info', message, onClose }) {
    if (!message) return null;

    return (
        <div className={`${styles.alert} ${styles[type]}`}>
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose} className={styles.closeBtn}>×</button>
            )}
        </div>
    );
}


export default AlertBox;