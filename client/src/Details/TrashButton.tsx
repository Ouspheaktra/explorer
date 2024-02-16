import { useGlobal } from "../GlobalContext";
import { DetailProps } from "./types";

export default function TrashButton({ selecteds }: DetailProps<any>) {
  const { deleteFiles } = useGlobal();
  return (
    <button
      onClick={() => {
        const yes = confirm("Delete: " + selecteds.map(f => f.name).join(", ") + " ?");
        if (yes)
          deleteFiles(selecteds);
      }}
    >
      Trash
    </button>
  );
}
