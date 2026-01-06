import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

function makeId() {
  return `t_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Provides non-blocking toast notifications with accessible announcements. */
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) window.clearTimeout(timer);
    timersRef.current.delete(id);
  }, []);

  const pushToast = useCallback(
    ({ title, message, variant = "info", timeoutMs = 4000 }) => {
      const id = makeId();
      const toast = { id, title, message, variant };
      setToasts((prev) => [...prev, toast]);

      const timer = window.setTimeout(() => removeToast(id), timeoutMs);
      timersRef.current.set(id, timer);

      return id;
    },
    [removeToast]
  );

  const value = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toastRegion" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.variant}`} role="status">
            <div className="toast__body">
              <div className="toast__title">{t.title}</div>
              {t.message ? <div className="toast__msg">{t.message}</div> : null}
            </div>
            <button
              type="button"
              className="iconButton"
              aria-label="Dismiss notification"
              onClick={() => removeToast(t.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useToasts() {
  /** Hook to push/remove toast notifications. */
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToasts must be used within a ToastProvider");
  return ctx;
}
