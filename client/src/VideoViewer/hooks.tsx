import { useGlobal } from "../contexts/GlobalContext";
import { iFile } from "../types";

export interface ImageDetails {
  avatars?: string[];
}

export const useImage = () => {
  const global = useGlobal();
  return {
    ...global,
    file: global.file as iFile<ImageDetails>,
    updateImage: (details: iFile<ImageDetails>["details"]) =>
      global.updateFile(
        global.file,
        details,
        (details.avatars || []).join("-")
      ),
  };
};
