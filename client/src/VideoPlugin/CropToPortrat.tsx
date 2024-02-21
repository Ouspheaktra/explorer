import { RendererProps } from "../Details/types";
import { useGlobal } from "../GlobalContext";

const command = 'ffmpeg -i "{input}" -vf "crop=ih*9/16:ih" "{output}"';

export default function CropToPortraitRenderer({
  selecteds,
}: RendererProps<any>) {
  const { commandFiles } = useGlobal();
  return (
    <button onClick={() => commandFiles(selecteds, command)}>
      Crop to Portrait
    </button>
  );
}
