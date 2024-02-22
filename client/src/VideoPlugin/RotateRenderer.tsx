import { RendererProps } from "../Details/types";
import { useGlobal } from "../GlobalContext";

export default function RotateRenderer({ selecteds }: RendererProps<any>) {
  const { commandFiles, updateFiles } = useGlobal();
  const rotate = (degree: number) => async () => {
    await updateFiles(
      selecteds.map((file) => [file, { ...file.details, rotate: degree }, null])
    );
    await commandFiles(selecteds, 'cp "{input}" "{output}"');
  };
  return (
    <div>
      <button onClick={rotate(90)}>90</button>
      <button onClick={rotate(270)}>-90</button>
    </div>
  );
}
