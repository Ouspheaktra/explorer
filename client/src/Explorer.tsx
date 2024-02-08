import List from "./List";
import { useGlobal } from "./GlobalContext";

export default function Explorer() {
  const {
    dir: { prevDir },
    setDir: goto,
    file,
    setFile,
  } = useGlobal();
  return (
    <List
      id="explorer"
      listTop={
        <>
          {prevDir && <li onClick={() => goto(prevDir)}>&lt;&minus; Back</li>}
          {file && <li onClick={() => setFile(null)}>===</li>}
        </>
      }
    ></List>
  );
}
