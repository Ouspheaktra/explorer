import { RendererProps } from "../Details/types";
import { useGlobal } from "../GlobalContext";

export default function CropRenderer({
  selecteds,
}: RendererProps<any>) {
  const { commandFiles } = useGlobal();
  return (
    <div>
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
