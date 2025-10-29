import { useEffect, useRef } from 'react';

/**
 * Hook para adicionar/remover listener de eventos no window
 * @param {string} eventName - nome do evento
 * @param {function} handler - callback do evento
 */
export default function useEventListener(eventName, handler) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => savedHandler.current(event);
    window.addEventListener(eventName, eventListener);
    return () => window.removeEventListener(eventName, eventListener);
  }, [eventName]);
}
