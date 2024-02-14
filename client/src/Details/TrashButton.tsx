import { useGlobal } from "../GlobalContext";
import { deleteFile } from "../utils/api";
import { DetailProps } from "./types";

export default function TrashButton({ selecteds }: DetailProps<any>) {
  const { setFile } = useGlobal();
  return (
    <button
      onClick={async () => {
        for (let file of selecteds) {
          await deleteFile(file);
          file.deleted = true;
          setFile(null);
        }
      }}
    >
      Trash
    </button>
  );
}
