import List from "./List";
import { useGlobal } from "./GlobalContext";
import { ListProps } from "./List/types";

export default function Explorer({
  topButtons,
}: Pick<ListProps<any>, "topButtons">) {
  const {
    dir: { dir, prevDir, files },
    setDir,
    file,
    setFile,
  } = useGlobal();
  return (
    <List
      id="explorer"
      filteredFiles={files}
      topButtons={topButtons}
      listTop={
        <>
          {dir && (
            <li className="a" onClick={() => setDir(prevDir || "")}>
              &lt;&minus; Back
            </li>
          )}
          {file && (
            <li className="a" onClick={() => setFile(null)}>
              ===
            </li>
          )}
        </>
      }
    />
  );
}
