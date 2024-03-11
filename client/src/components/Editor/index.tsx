import { EditorProps } from "./types";
import { useState } from "react";
import "./style.scss";

export default function Editor({ Components, ...rendererProps }: EditorProps) {
  const [open, setOpen] = useState(
    localStorage.getItem("open-details") === "1"
  );
  return (
    <div id="editor" className={open ? "open" : ""}>
      <button
        className="x fly-right"
        data-sign={open ? "x" : "o"}
        onClick={() => {
          setOpen(!open);
          localStorage.setItem("open-details", open ? "" : "1");
        }}
      ></button>
      {Components.map((Component) => (
        <Component
          key={Component.displayName || Component.name}
          {...rendererProps}
        />
      ))}
    </div>
  );
}
