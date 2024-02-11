import { ComponentProps, FC, HTMLProps, ReactNode, useState } from "react";
import { FileComponentProps, Order, Sort } from "./types";
import { builtinSorts } from "./builtin";
import { useGlobal } from "../GlobalContext";
import Details from "../Details";
import { iFile } from "../types";
import { toggleValue } from "../utils";
import { scrollFileIntoView } from "./utils";
import "./style.scss";

type ListProps = HTMLProps<HTMLUListElement> & {
  FileComponent?: FC<FileComponentProps>;
  listTop?: ReactNode;
  topButtons?: ReactNode;
  bottomButtons?: ReactNode;
  sorts?: Sort[];
  filteredFiles: iFile[];
};

export default function List<iDetailsType extends object>({
  listTop,
  topButtons,
  bottomButtons,
  sorts = [],
  FileComponent,
  filteredFiles,
  details,
  ...ulProps
}: ListProps & {
  details?: Pick<
    ComponentProps<typeof Details<iDetailsType>>,
    "detailsTypes" | "formName"
  >;
}) {
  const [open, setOpen] = useState(true);
  // null means fullMode
  // [] means selected file
  const [selecteds, setSelecteds] = useState<iFile[] | null>(null);
  const {
    setDir,
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
  const sortedGroups = sorter.sort(filteredFiles);
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
  const fullMode = selecteds !== null;
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
                  document.getElementById("viewer")!.style.display = fullMode
                    ? ""
                    : "none";
                  if (fullMode) setFile(selecteds[0]);
                  setSelecteds(fullMode ? null : [file]);
                  scrollFileIntoView(file._id);
                }}
                style={{ backgroundColor: "aqua" }}
              >
                {fullMode ? "S" : "F"}
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
                {files.map((f) => {
                  const { type, ext, fullname, dir, _id } = f;
                  const isCurrent = fullMode
                    ? selecteds!.some((file) => file._id === _id)
                    : file?._id === _id;
                  return (
                    <li
                      key={_id}
                      data-file-id={_id}
                      data-file-fullname={fullname}
                      className={`is-${type} ${isCurrent ? "active" : ""}`}
                      onClick={(e) => {
                        if (type === "unknown") return;
                        if (fullMode) {
                          if (e.ctrlKey)
                            setSelecteds(toggleValue([...selecteds!], f));
                          else setSelecteds([f]);
                        } else if (!isCurrent) {
                          // is file, change file
                          if (ext) setFile(f);
                          // if directory, change dir
                          else setDir(dir);
                        }
                      }}
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
                onClick={() => {
                  setSort([name, sortOrder === "asc" ? "desc" : "asc"]);
                  scrollFileIntoView(file._id);
                }}
              >
                {name}
              </button>
            ))}
          </ul>
          {bottomButtons}
        </li>
      </ul>
      {details && (
        <Details<iDetailsType>
          key={file._id}
          {...details}
          files={selecteds || [file]}
        />
      )}
    </>
  );
}
