import { EditorComponentProps } from "../../Editor/types";
import { useGlobal } from "../../GlobalContext";

export default function CropRenderer({
  selecteds,
}: EditorComponentProps) {
  const { commandFiles } = useGlobal();
  return (
    <div>
      <label className="label">crop</label>
      <button
        onClick={() =>
          commandFiles(
            selecteds,
            'ffmpeg -i {input} -vf "crop=iw:iw*16/9" {output}'
          )
        }
      >
        to Landscape
      </button>
      <button
        onClick={() =>
          commandFiles(
            selecteds,
            'ffmpeg -i {input} -vf "crop=ih*9/16:ih" {output}'
          )
        }
      >
        to Portrait
      </button>
    </div>
  );
}
