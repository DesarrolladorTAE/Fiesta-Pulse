import React, { createContext, useCallback, useContext, useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FP } from "../../theme/palette";

const ToastCtx = createContext(null);
const ConfirmCtx = createContext(null);

const TYPE_STYLE = {
  success: { bg: FP.cyan,   fg: "#0b0b0b", ring: FP.yellow },
  error:   { bg: FP.red,    fg: "#fff",    ring: FP.black },
  info:    { bg: FP.orange, fg: "#0b0b0b", ring: FP.yellow },
};

function ToastItem({ t, onClose }) {
  const style = TYPE_STYLE[t.type] || TYPE_STYLE.info;
  useEffect(() => {
    if (t.duration === 0) return;
    const id = setTimeout(onClose, t.duration ?? 3500);
    return () => clearTimeout(id);
  }, [t.duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={onClose}
      style={{
        background: style.bg,
        color: style.fg,
        borderRadius: 14,
        padding: "12px 14px",
        boxShadow: "0 12px 36px rgba(0,0,0,.25)",
        border: `2px solid ${style.ring}`,
        cursor: "pointer",
        minWidth: 260,
        maxWidth: 420,
      }}
    >
      {t.title && <div style={{ fontWeight: 800, marginBottom: 4 }}>{t.title}</div>}
      {t.message && <div style={{ opacity: .95 }}>{t.message}</div>}
    </div>
  );
}

function ToastViewport({ toasts, remove }) {
  if (typeof window === "undefined") return null;
  return createPortal(
    <div style={{
      position: "fixed", inset: "12px 12px auto auto",
      display: "flex", flexDirection: "column", gap: 10, zIndex: 9999
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} t={t} onClose={() => remove(t.id)} />
      ))}
    </div>,
    document.body
  );
}

function ConfirmModal({ open, options, onResolve }) {
  if (typeof window === "undefined") return null;
  const style = TYPE_STYLE.info;
  return createPortal(
    open ? (
      <div aria-modal="true" role="dialog" style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
        display: "grid", placeItems: "center", zIndex: 10000
      }}>
        <div style={{
          background: "#fff", color: FP.black, borderRadius: 18, maxWidth: 520, width: "92%",
          boxShadow: "0 18px 60px rgba(0,0,0,.35)", border: `3px solid ${FP.yellow}`, padding: 18
        }}>
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>
            {options.title ?? "¿Confirmar?"}
          </div>
          {options.text && (
            <div style={{ marginBottom: 14, lineHeight: 1.35 }}>{options.text}</div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={() => onResolve(false)}
              style={{
                background: FP.red, color: "#fff", border: 0, padding: "10px 14px",
                borderRadius: 999, fontWeight: 800, boxShadow: "0 8px 24px rgba(239,68,35,.35)"
              }}
            >
              {options.cancelText ?? "Cancelar"}
            </button>
            <button
              autoFocus
              onClick={() => onResolve(true)}
              style={{
                background: style.bg, color: style.fg, border: 0, padding: "10px 14px",
                borderRadius: 999, fontWeight: 800, boxShadow: "0 8px 24px rgba(17,203,215,.35)"
              }}
            >
              {options.confirmText ?? "Sí, continuar"}
            </button>
          </div>
        </div>
      </div>
    ) : null,
    document.body
  );
}

let idSeq = 0;

export function AlertProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ open: false, options: {}, resolver: null });

  const push = useCallback((t) => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, duration: 3500, ...t }]);
    return id;
  }, []);
  const remove = useCallback((id) => setToasts((prev) => prev.filter(t => t.id !== id)), []);

  const toast = useMemo(() => ({
    success: (message, opts={}) => push({ type:"success", title: opts.title ?? "¡Listo!", message, ...opts }),
    error:   (message, opts={}) => push({ type:"error",   title: opts.title ?? "Error",  message, ...opts }),
    info:    (message, opts={}) => push({ type:"info",    title: opts.title ?? "Aviso",  message, ...opts }),
  }), [push]);

  const confirm = useCallback((options = {}) => new Promise((resolve) => {
    setConfirmState({ open: true, options, resolver: resolve });
  }), []);

  const handleResolve = (result) => {
    confirmState.resolver?.(result);
    setConfirmState({ open: false, options: {}, resolver: null });
  };

  return (
    <ToastCtx.Provider value={toast}>
      <ConfirmCtx.Provider value={confirm}>
        {children}
        <ToastViewport toasts={toasts} remove={remove} />
        <ConfirmModal open={confirmState.open} options={confirmState.options} onResolve={handleResolve} />
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
export const useConfirm = () => useContext(ConfirmCtx);
