import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    /**
     * pour mettre des notification return l'id de celle ci
     * @param {string} message le message de la notification
     * @param {string} type le message de la notification "blue", "red", "orange", "green", "gray"
     * @param {number} duration le temps en ms de la notification
     * @param function onClick(params) { quand tu clique sur la notif rien ou null si tu veux que ça fasse rien
        
     }
     * @returns id 
     */
    const addNotification = useCallback((message, type = 'blue', duration = 3000, onClick = null) => {
        const id = Date.now() + Math.random();

        setNotifications(prev => [...prev, { id, message, type, duration, onClick }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);


    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * import { useNotification } from "./NotificationContext"
 *
 * const { addNotification } = useNotification();
 *
 * addNotification("message", "type", TempsEnMs, () => function):
 * @param {string} type (couleur) sont les suivante (visible dans le css):
 *     "blue" (#006BB4)
 *     "red" #DE443B
 *     "orange" #F69401
 *     "green" #3A9775
 *     "gray"
 */
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification doit étre utilisé dans un NotificationProvider');
    }
    return context;
};