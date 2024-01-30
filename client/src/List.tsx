import { HTMLProps, useState } from "react";
import "./List.scss";

export default function List({
  name,
  defaultOpen,
  level,
  children,
  ...props
}: HTMLProps<HTMLUListElement> & {
  name: string;
  defaultOpen: boolean;
  level: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <ul {...props} className={"list" + (open ? " active" : "")}>
        <button
          className="list-opener"
          style={{ top: level * 25 }}
          onClick={() => setOpen(!open)}
        >
          {open ? "X" : name}
        </button>
        {open && children}
      </ul>
    </>
  );
}
