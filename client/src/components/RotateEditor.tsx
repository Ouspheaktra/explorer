import { useGlobal } from "../GlobalContext";
import { EditorComponentProps } from "./Editor/types";

const rotate = (degree: number) =>
  `ffmpeg -display_rotation ${degree} -i {input} -c copy {output}`;

export default function RotateRenderer({ selecteds }: EditorComponentProps) {
  const { commandFiles } = useGlobal();
  return (
    <div>
      <label className="label">rotate</label>
      <button onClick={() => commandFiles(selecteds, rotate(0), ".mp4")}>0</button>
      <button onClick={() => commandFiles(selecteds, rotate(-90), ".mp4")}>90</button>
      <button onClick={() => commandFiles(selecteds, rotate(180), ".mp4")}>180</button>
      <button onClick={() => commandFiles(selecteds, rotate(90), ".mp4")}>-90</button>
    </div>
  );
}
