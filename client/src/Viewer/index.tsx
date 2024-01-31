import { ReactNode, useEffect } from "react";
import { useGlobal } from "../contexts/GlobalContext";

export default function Viewer({
  type,
  children,
  onNewFile,
}: {
  type: string,
  children: ReactNode
  onNewFile: () => void;
}) {
  let {
    dir: { files },
    file: {_id, name},
    setFile,
  } = useGlobal();
  useEffect(() => onNewFile(), [_id]);
  files = files.filter((o) => o.type === type);
  const currentId = files.findIndex((f) => f.name === name),
    prevFile = files[currentId - 1],
    nextFile = files[currentId + 1];
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
