import { useGlobal } from "../GlobalContext";
import { EditorComponentProps } from "./Editor/types";

export default function TrashEditor({ selecteds }: EditorComponentProps) {
  const { deleteFiles } = useGlobal();
  return (
    <button
      style={{
        width: 100,
        backgroundColor: "gray",
        color: "white",
        border: "1px solid white",
      }}
      onClick={() => {
        const yes = confirm("Delete " + selecteds.length + " files ?");
        if (yes)
          deleteFiles(selecteds);
      }}
    >
      Trash
    </button>
  );
}
