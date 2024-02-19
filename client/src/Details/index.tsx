import { DetailsProps } from "./types";

export default function Details<iDetails extends object>({
  detailsTypes,
  ...rendererProps
}: DetailsProps<iDetails>) {
  return (
    <div id="details">
      {detailsTypes.map((detailsType) => {
        const { Renderer } = detailsType;
        let name = detailsType.name as string;
        return (
          <div key={name} className={`${name}-wrapper`}>
            <Renderer
              {...rendererProps}
              detailsType={detailsType}
            />
          </div>
        );
      })}
    </div>
  );
}
