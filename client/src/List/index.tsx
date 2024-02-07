import { FC, HTMLProps, ReactNode, useState } from "react";
import { useGlobal } from "../GlobalContext";
import { FileComponentProps, Order, Sort } from "./types";
import { builtinSorts } from "./builtin";
import "./style.scss";

export default function List({
  listTop,
  topButtons,
  sorts = [],
  FileComponent,
  ...ulProps
}: HTMLProps<HTMLUListElement> & {
  FileComponent?: FC<FileComponentProps>;
  listTop?: ReactNode;
  topButtons?: ReactNode;
  sorts?: Sort[];
}) {
  const [open, setOpen] = useState(true);
  const [fullMode, setFullMode] = useState(false);
  const {
    dir: { files },
    setDir: goto,
    file,
    setFile,
  } = useGlobal();
  const [[sortName, sortOrder], setSort] = useState<[string, Order]>([
    builtinSorts[0].name,
    "asc",
  ]);
  const allSorts = [...sorts, ...builtinSorts];
  const sorter = allSorts.find((sort) => sort.name === sortName)!;
  const sortedGroups = sorter.sort([...files], sortOrder);
  return (
    <ul
      {...ulProps}
      className={"list" + (open ? " active" : "") + (fullMode ? " full" : "")}
    >
      <li className="list-top">
        <ul>
          <li className="list-top-buttons">
            {topButtons}
            <button
              className="list-fuller"
              onClick={() => setFullMode(!fullMode)}
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
  );
}
