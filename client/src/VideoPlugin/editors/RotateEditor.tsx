import { EditorComponentProps } from "../../Editor/types";
import { useGlobal } from "../../GlobalContext";

const rotate = (degree: number) =>
  `ffmpeg -display_rotation ${360 - degree} -i {input} -c copy {output}`;

export default function RotateRenderer({ selecteds }: EditorComponentProps) {
  const { commandFiles } = useGlobal();
  return (
    <div>
      <button onClick={() => commandFiles(selecteds, rotate(90), ".mp4")}>90</button>
      <button onClick={() => commandFiles(selecteds, rotate(270), ".mp4")}>-90</button>
    </div>
  );
}
