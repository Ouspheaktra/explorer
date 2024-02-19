import { FC } from "react";
import { iFile } from "../types";

export interface DetailsProps<iDetails extends object> {
  selecteds: iFile[];
  detailsTypes: DetailsType<iDetails>[];
  formName: (details: iDetails) => string;
}

export interface RendererProps<iDetails extends object>
  extends Pick<DetailsProps<iDetails>, "formName" | "selecteds"> {
  detailsType: DetailsType<iDetails>;
}

export type DetailsType<iDetails extends object> = {
  name: keyof iDetails;
  Renderer: FC<RendererProps<iDetails>>;
  toFormName?: boolean;
};
