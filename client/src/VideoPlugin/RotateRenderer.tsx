import { RendererProps } from "../Details/types";
import { useGlobal } from "../GlobalContext";

const rotateCommand = (degree: number) =>
  `ffmpeg -display_rotation ${degree} -i "{input}" -codec copy "{output}"`;

export default function RotateRenderer({ selecteds }: RendererProps<any>) {
  const { commandFiles } = useGlobal();
  return (
    <div>
      <button onClick={() => commandFiles(selecteds, rotateCommand(-90))}>
        -90
      </button>
      <button onClick={() => commandFiles(selecteds, rotateCommand(90))}>
        90
      </button>
    </div>
  );
}
