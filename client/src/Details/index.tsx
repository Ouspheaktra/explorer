import { DetailsProps } from "./types";
import { Fragment, useState } from "react";
import "./style.scss";

export default function Details<iDetails extends object>({
  detailsTypes,
  ...rendererProps
}: DetailsProps<iDetails>) {
  const [open, setOpen] = useState(
    localStorage.getItem("open-details") === "1"
  );
  return (
    <div id="details" className={open ? "open" : ""}>
      <button
        className="x"
        data-sign={open ? "x" : "o"}
        onClick={() => {
          setOpen(!open);
          localStorage.setItem("open-details", open ? "" : "1");
        }}
      ></button>
      {detailsTypes.map((detailsType) => {
        const { name, Renderer } = detailsType;
        return (
          <Fragment key={name as string}>
            <span>{name as string}</span>
            <Renderer {...rendererProps} detailsType={detailsType} />
          </Fragment>
        );
      })}
    </div>
  );
}
