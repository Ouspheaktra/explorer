import List from "../List";
import { useGlobal } from "../contexts/GlobalContext";

export default function ImageAlbum() {
  const { file, setViewerMode } = useGlobal();
  return (
    <List
      listTop={<>{file && <li onClick={() => setViewerMode(false)}>===</li>}</>}
    ></List>
  );
}
