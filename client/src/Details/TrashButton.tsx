import { useGlobal } from "../GlobalContext";
import { RendererProps } from "./types";

export default function TrashButton({ selecteds }: RendererProps<any>) {
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
