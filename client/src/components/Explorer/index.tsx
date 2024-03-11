import List from "../List";
import { useGlobal } from "../../GlobalContext";
import { FileComponentProps, ListProps } from "../List/types";


export default function Explorer({
  topButtons,
}: Pick<ListProps, "topButtons">) {
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
      FileComponent={FileComponent}
      EditorComponents={[]}
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

function FileComponent({ file }: FileComponentProps) {
  return file.fullname;
}
