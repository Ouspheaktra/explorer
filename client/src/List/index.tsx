import { ComponentProps, FC, HTMLProps, ReactNode, useState } from "react";
import { FileComponentProps, Order, Sort } from "./types";
import { builtinSorts } from "./builtin";
import { useGlobal } from "../GlobalContext";
import "./style.scss";
import Details from "../Details";

type ListProps = HTMLProps<HTMLUListElement> & {
  FileComponent?: FC<FileComponentProps>;
  listTop?: ReactNode;
  topButtons?: ReactNode;
  sorts?: Sort[];
  fileType?: string;
};

export default function List<iDetailsType extends object>({
  listTop,
  topButtons,
  sorts = [],
  FileComponent,
  fileType,
  details,
  ...ulProps
}: ListProps & {
  details?: ComponentProps<typeof Details<iDetailsType>>;
}) {
  const [open, setOpen] = useState(true);
  const [fullMode, setFullMode] = useState(false);
  const {
    dir: { files },
    setDir: goto,
    file,
    viewerMode,
    setViewerMode,
    setFile,
    setNext,
  } = useGlobal();
  const [[sortName, sortOrder], setSort] = useState<[string, Order]>([
    builtinSorts[0].name,
    "asc",
  ]);
  const allSorts = [...sorts, ...builtinSorts];
  const sorter = allSorts.find((sort) => sort.name === sortName)!;
  const sortedGroups = sorter.sort(
    fileType ? files.filter((f) => f.type === fileType) : files
  );
  if (sortOrder === "desc") {
    sortedGroups.reverse();
    sortedGroups.forEach((g) => g.files.reverse());
  }
  setNext((plus) => {
    if (!file) return;
    const files = sortedGroups.map(({ files }) => files).flat();
    const currentId = files.findIndex((f) => file._id === f._id);
    if (currentId) setFile(files.at((currentId + plus) % files.length)!);
  });
  return (
    <>
      <ul
        {...ulProps}
        className={"list" + (open ? " active" : "") + (fullMode ? " full" : "")}
      >
        <li className="list-top">
          <ul>
            <li className="list-top-buttons">
              {topButtons}
              {file && (
                <button onClick={() => setViewerMode(!viewerMode)}>
                  {viewerMode ? "Close" : "Viewer"}
                </button>
              )}
              <button
                className="list-fuller"
                onClick={() => {
                  document.getElementById("viewer")!.style.display = fullMode ? "" : "none";
                  setFullMode(!fullMode);
                }}
                style={{ backgroundColor: "aqua" }}
              >
                {fullMode ? "S" : "M"}
              </button>
              <button
                className="list-opener"
                onClick={() => setOpen(!open)}
                style={{ backgroundColor: "pink" }}
              >
                {open ? "X" : "O"}
              </button>
            </li>
            {listTop}
          </ul>
        </li>
        {sortedGroups.map(({ name, files }, gid) => {
          return (
            <li key={gid} className="list-group">
              <span className="list-group-name">{name}</span>
              <ul className="list-group-files">
                {files.map((f, fid) => {
                  const { type, ext, fullname, dir, _id } = f;
                  const isCurrent = file && file._id === _id;
                  return (
                    <li
                      key={fid}
                      className={`is-${type} ${isCurrent ? "active" : ""}`}
                      onClick={
                        type !== "unknown" && !isCurrent
                          ? () => {
                              // is file, change file
                              if (ext) setFile(f);
                              // if directory, change dir
                              else goto(dir);
                            }
                          : undefined
                      }
                    >
                      {FileComponent ? (
                        <FileComponent fullMode={fullMode} file={f} />
                      ) : (
                        fullname
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
        <li className="list-bottom">
          Order:
          <ul>
            {allSorts.map(({ name }) => (
              <button
                key={name}
                style={{ background: sortName === name ? "yellow" : "" }}
                onClick={() =>
                  setSort([name, sortOrder === "asc" ? "desc" : "asc"])
                }
              >
                {name}
              </button>
            ))}
          </ul>
        </li>
      </ul>
      {details && <Details<iDetailsType> key={file._id} {...details} />}
    </>
  );
}
