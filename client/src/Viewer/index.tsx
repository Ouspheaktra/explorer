import { ReactNode } from "react";

export default function Viewer({
  type,
  children,
}: {
  type: string;
  children: ReactNode;
}) {
  return (
    <div id="viewer" className={type}>
      {children}
    </div>
  );
}
