import { FC } from "react";
import { iFile } from "../types";

export interface EditorProps {
  selecteds: iFile[];
  Components: FC<EditorComponentProps>[];
}

export type EditorComponentProps =  Pick<EditorProps, "selecteds">;
