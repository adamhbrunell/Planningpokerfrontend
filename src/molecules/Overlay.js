import { Fragment } from "react";
import "./Overlay.css";

export function Overlay({ isOpen, onClose, children }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay_background" onClick={onClose} />
          <div className="overlay_container">
            <button className="overlay_close" type="button" onClick={onClose} />
            <div className="overlay_content">{children}</div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Overlay;
