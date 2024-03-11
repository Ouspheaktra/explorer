import { FC } from "react";
import { iFile } from "../types";

export interface EditorProps {
  selecteds: iFile[];
  Components: FC<EditorComponentProps>[];
}

export type EditorComponentProps = Pick<EditorProps, "selecteds">;

export type formName<iDetailsType extends object> = (details: iDetailsType) => string;

export type createDetailsEditor = <iDetailsType extends object>(
  name: keyof iDetailsType,
  formName?: formName<iDetailsType>
) => FC<EditorComponentProps>;
