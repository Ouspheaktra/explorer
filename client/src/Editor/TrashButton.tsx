import { useGlobal } from "../GlobalContext";
import { EditorComponentProps } from "./types";

export default function TrashButton({ selecteds }: EditorComponentProps<any>) {
  const { deleteFiles } = useGlobal();
  return (
    <button
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
