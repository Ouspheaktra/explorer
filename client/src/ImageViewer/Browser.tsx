import List from "../List";
import { useDir } from "../contexts/DirContext";
import { useFile } from "../contexts/FileContext";

export default function ImageBrowser({ currentId }: { currentId: number }) {
  const [{ files }] = useDir();
  const [_, setFile] = useFile();
  return (
    <List name="image" defaultOpen={false} level={1}>
      {files.map((f, id) => {
        const { type, path, name } = f;
        const isCurrent = id === currentId;
        return (
          <li
            key={path}
            className={`is-${type} ${isCurrent ? "active" : ""}`}
            onClick={
              type !== "unknown" && !isCurrent ? () => setFile(f) : undefined
            }
          >
            {name}
          </li>
        );
      })}
    </List>
  );
}
