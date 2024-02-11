import { FC } from "react";
import { iFile } from "../types";

export interface DetailProps<iDetails extends object> {
  allFiles: iFile[];
  selecteds: iFile[];
  detailsType: DetailsType<iDetails>;
  update: UpdateFn<iDetails>;
}


export type DetailsType<iDetails extends object> = {
  name: keyof iDetails;
  Renderer: FC<DetailProps<iDetails>>;
  toFormName?: boolean;
};

export type UpdateFn<iDetails extends object> = (
  name: string,
  value: any,
  detailsType: DetailsType<iDetails>
) => void;