import { useGlobal } from "../GlobalContext";
import { EditorComponentProps } from "./types";

export default function TrashButton({ selecteds }: EditorComponentProps) {
  const { deleteFiles } = useGlobal();
  return (
    <button
      style={{ width: 100, backgroundColor: "gray", color: "white", border: "1px solid white" }}
      onClick={() => {
        const yes = confirm("Delete " + selecteds.length + " files ?");
        if (yes) deleteFiles(selecteds);
      }}
    >
      Trash
    </button>
  );
}
