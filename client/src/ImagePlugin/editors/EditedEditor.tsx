import { EditorComponentProps } from "../../Editor/types";
import { useGlobal } from "../../GlobalContext";

export default function EditedEditor({
  selecteds,
}: EditorComponentProps) {
  const { updateFiles } = useGlobal();
  if (selecteds.length > 1) {
    const [file, ...editeds] = selecteds;
    return (
      <button
        style={{ float: "right" }}
        onClick={() => {
          updateFiles([
            [
              file,
              {
                ...file.details,
                editeds: [
                  ...new Set([
                    ...(file.details.editeds || []),
                    ...editeds.map((f) => f.fullname),
                  ]),
                ],
              },
              null,
            ],
          ]);
        }}
      >
        Pair
      </button>
    );
  }
  return <div></div>;
}
