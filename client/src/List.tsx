import { HTMLProps, useState } from "react";
import "./List.scss";

export default function List({
  children,
  ...props
}: HTMLProps<HTMLUListElement>) {
  const [open, setOpen] = useState(true);
  return (
    <ul {...props} className={"list" + (open ? " active" : "")}>
      <button className="list-opener" onClick={() => setOpen(!open)}>
        {open ? "X" : "O"}
      </button>
      {open && children}
    </ul>
  );
}
