import { DetailsProps } from "./types";
import "./style.scss";
import { Fragment } from "react";

export default function Details<iDetails extends object>({
  detailsTypes,
  ...rendererProps
}: DetailsProps<iDetails>) {
  return (
    <div id="details">
      {detailsTypes.map((detailsType) => {
        const { name, Renderer } = detailsType;
        return (
          <Fragment
            key={name as string}
          >
            <span>{name as string}</span>
            <Renderer
              {...rendererProps}
              detailsType={detailsType}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
