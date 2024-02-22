import { RendererProps } from "../Details/types";
import { useGlobal } from "../GlobalContext";

export default function ReThumbnail({ selecteds }: RendererProps<any>) {
  const { commandFiles } = useGlobal();
  return (
    <button onClick={() => commandFiles(selecteds, 'cp "{input}" "{output}"')}>
      Re-Thumbnail
    </button>
  );
}
