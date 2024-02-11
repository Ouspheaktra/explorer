import List from "./List";
import { useGlobal } from "./GlobalContext";

export default function Explorer() {
  const {
    dir: { prevDir, files },
    setDir: goto,
    file,
    setFile,
  } = useGlobal();
  return (
    <List
      id="explorer"
      filteredFiles={files}
      listTop={
        <>
          {prevDir && <li className="a" onClick={() => goto(prevDir)}>&lt;&minus; Back</li>}
          {file && <li className="a" onClick={() => setFile(null)}>===</li>}
        </>
      }
    />
  );
}
