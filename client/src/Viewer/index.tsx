import { ReactNode } from "react";
import { useGlobal } from "../contexts/GlobalContext";

export default function Viewer({
  type,
  children,
}: {
  type: string,
  children: ReactNode
}) {
  let {
    dir: { files },
    file: { name },
    setFile,
  } = useGlobal();
  files = files.filter((o) => o.type === type);
  const currentId = files.findIndex((f) => f.name === name),
    prevFile = files[currentId + 1],
    nextFile = files[Math.floor(Math.random()*files.length)];
  return (
    <>
      <div id="viewer" className={type}>
        {children}
        {prevFile && (
          <button className="prev" onClick={() => setFile(prevFile)}>
            &lt;
          </button>
        )}
        {nextFile && (
          <button className="next" onClick={() => setFile(nextFile)}>
            &gt;
          </button>
        )}
      </div>
    </>
  );
}
