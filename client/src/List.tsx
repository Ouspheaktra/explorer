import { HTMLProps, ReactNode, useState } from "react";
import "./List.scss";
import { useGlobal } from "./contexts/GlobalContext";
import { iFile } from "./types";

type Order = "asc" | "desc";
type Sort = {
  name: string;
  sort: (files: iFile[], order: Order) => iFile[];
};

const builtinSorts: Sort[] = [
  {
    name: "Name",
    sort: (files, order) => {
      if (order === "asc") files.sort((a, b) => a.name.localeCompare(b.name));
      else files.sort((a, b) => b.name.localeCompare(a.name));
      return files;
    },
  },
  {
    name: "Date",
    sort: (files, order) => {
      if (order === "asc")
        files.sort((a, b) => a.stat!.mtime.getTime() - b.stat!.mtime.getTime());
      else
        files.sort((a, b) => b.stat!.mtime.getTime() - a.stat!.mtime.getTime());
      return files;
    },
  },
];

export default function List({ sorts = [] }: { sorts?: Sort[] }) {
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
  const sortedFiles = allSorts
    .find((sort) => sort.name === sortName)!
    .sort([...files], sortOrder);
  return (
    <ul className={"list" + (open ? " active" : "")}>
      <button className="list-opener" onClick={() => setOpen(!open)}>
        {open ? "X" : "O"}
      </button>
      {sortedFiles.map((f, fid) => {
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
      <li
        style={{
          position: "sticky",
          bottom: 0,
          background: "black",
        }}
      >
        Order:
        <ul>
          {allSorts.map(({ name }) => (
            <button
              key={name}
              style={{ background: sortName === name ? "yellow" : "" }}
              onClick={() => setSort([name, sortOrder === "asc" ? "desc" : "asc"])}
            >
              by {name}
            </button>
          ))}
        </ul>
      </li>
    </ul>
  );
}
