import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from './NotificationContext';
import './NotificationContainer.css';

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="notification-container">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        className={`notification notification-${notification.type}`}
                        initial={{ opacity: 0, y: -50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.8 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                        }}
                        onClick={() => {
                            if (notification.onClick) {
                                notification.onClick();
                            }
                            removeNotification(notification.id);
                        }}
                    >
                        <div className="notification-content">
                            {notification.message}
                        </div>
                        <button
                            className="notification-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                            }}
                        >
                            ✕
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationContainer;