import { useEffect, useMemo } from "react";
import "./Popover.css";

export default function Popover({ anchorEl, onClose, children, offset = 8, align = "left" }) {
  const rect = anchorEl?.getBoundingClientRect?.();
  const style = useMemo(() => {
    if (!rect) return { display: "none" };
    const top = rect.bottom + offset;
    let left = rect.left;
    if (align === "right") left = rect.right;
    return { top: `${top}px`, left: `${left}px` };
  }, [rect, offset, align]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!rect) return null;

  return (
    <>
      <div className="popover-overlay" onClick={onClose} />
      <div className={`popover-panel ${align === "right" ? "align-right" : ""}`} style={style}>
        {children}
      </div>
    </>
  );
}