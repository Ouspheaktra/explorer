import { RendererProps } from "../Details/types";
import { useGlobal } from "../GlobalContext";

const _90 = 1,
  _270 = 2;

// rotate anti-clockwise
const rotateCommand = (transpose: number) =>
  `ffmpeg -i "{input}" -vf "transpose=${transpose}" -c:a copy "{output}"`;

export default function RotateRenderer({ selecteds }: RendererProps<any>) {
  const { commandFiles } = useGlobal();
  return (
    <div>
      <button onClick={() => commandFiles(selecteds, rotateCommand(_90))}>
        90
      </button>
      <button onClick={() => commandFiles(selecteds, rotateCommand(_270))}>
        270
      </button>
    </div>
  );
}
