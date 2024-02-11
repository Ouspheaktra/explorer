import { DetailProps } from "../Details/types";

export default function EditedsRenderer<iDetails extends object>({
  selecteds,
  updateFiles,
}: DetailProps<iDetails>) {
  if (selecteds.length > 1) {
    const [file, ...editeds] = selecteds;
    return (
      <button
        onClick={() => {
          updateFiles([
            [
              file,
              {
                ...file.details,
                editeds: [
                  ...new Set([
                    ...(file.details.edited || []),
                    editeds.map((f) => f.fullname),
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
  return null;
}
