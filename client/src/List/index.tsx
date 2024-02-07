import { ReactNode, useState } from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { Order, Sort } from "./types";
import { builtinSorts } from "./builtin";
import "./style.scss";

export default function List({ listTop, sorts = [] }: { listTop?: ReactNode, sorts?: Sort[] }) {
  const [open, setOpen] = useState(true);
  const {
    dir: { files },
    goto,
    file,
    setFile,
  } = useGlobal();
  const [[sortName, sortOrder], setSort] = useState<[string, Order]>([
    builtinSorts[0].name,
    "asc",
  ]);
  const allSorts = [...sorts, ...builtinSorts];
  const sorter = allSorts.find((sort) => sort.name === sortName)!
  const sortedGroups = sorter.sort([...files], sortOrder);
  return (
    <ul className={"list" + (open ? " active" : "")}>
      <button className="list-opener" onClick={() => setOpen(!open)}>
        {open ? "X" : "O"}
      </button>
      <li className="list-top">
        <ul>
          {listTop}
        </ul>
      </li>
      {sortedGroups.map(({ name, files }, gid) => {
        return (
          <li key={gid} className="list-group">
            {sorter.showLabel && <span className="list-group-name">{name}</span>}
            <ul className="list-group-files">
              {files.map((f, fid) => {
                const { type, ext, name, dir, _id } = f;
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
                    {name}
                    {ext}
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

