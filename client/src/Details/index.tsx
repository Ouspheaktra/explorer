import { DetailsProps } from "./types";
import "./style.scss";

export default function Details<iDetails extends object>({
  detailsTypes,
  ...rendererProps
}: DetailsProps<iDetails>) {
  return (
    <div id="details">
      {detailsTypes.map((detailsType) => {
        const { name, Renderer } = detailsType;
        return (
          <Renderer
            key={name as string}
            {...rendererProps}
            detailsType={detailsType}
          />
        );
      })}
    </div>
  );
}
