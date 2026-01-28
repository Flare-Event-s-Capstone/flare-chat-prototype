import "./MatchesTab.css";
import { useEffect, useRef, useState } from "react";
import Popover from "./Popover";

export default function MatchesTab({ open, onClose, onMessageClick }) {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    function handleClick(e) {
      if (e.target === overlayRef.current) onClose();
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open, onClose]);

  useEffect(() => {
    if (open && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [open]);

  const openMenu = (match, el) => {
    setSelected(match);
    setAnchorEl(el);
  };

  const closeMenu = () => {
    setSelected(null);
    setAnchorEl(null);
  };

  return (
    <div
      ref={overlayRef}
      className={`matches-overlay ${open ? "show" : ""}`}
      aria-hidden={!open}
    >
      <aside
        id="matches-drawer"
        className={`matches-drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Matches"
      >
        <div className="drawer-header">
          <h2>Matches</h2>
        </div>

        <div className="drawer-body">
          <div
            className="match-card"
            onClick={(e) => openMenu({ id: 1, name: "Example Match 1" }, e.currentTarget)}
          >
            Example Match 1
          </div>
          <div
            className="match-card"
            onClick={(e) => openMenu({ id: 2, name: "Example Match 2" }, e.currentTarget)}
          >
            Example Match 2
          </div>
          <div
            className="match-card"
            onClick={(e) => openMenu({ id: 3, name: "Example Match 3" }, e.currentTarget)}
          >
            Example Match 3
          </div>
        </div>
      </aside>

      {anchorEl && selected && (
        <Popover anchorEl={anchorEl} onClose={closeMenu} align="right">
          <div className="popover-menu">
            <button className="popover-item">View profile</button>
            <button className="popover-item" onClick={() => { onMessageClick(); closeMenu(); onClose(); }}>Message</button>
            <button className="popover-item">Report</button>
            <button className="popover-item">Remove</button>
          </div>
        </Popover>
      )}
    </div>
  );
}