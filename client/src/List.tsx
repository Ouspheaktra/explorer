import { ReactNode, useState } from "react";
import { useGlobal } from "./contexts/GlobalContext";
import { iFile } from "./types";
import { toDateString } from "./utils";
import "./List.scss";

type Order = "asc" | "desc";
type SortedGroup = {
  name: string;
  files: iFile[];
};
type Sort = {
  name: string;
  showLabel: boolean;
  sort: (files: iFile[], order: Order) => SortedGroup[];
};

const builtinSorts: Sort[] = [
  {
    name: "Name",
    showLabel: false,
    sort: (files, order) => {
      // sort
      if (order === "asc") files.sort((a, b) => a.name.localeCompare(b.name));
      else files.sort((a, b) => b.name.localeCompare(a.name));
      //
      return createSortedGroup(files, (file) => file.name[0].toUpperCase());
    },
  },
  {
    name: "Date",
    showLabel: false,
    sort: (files, order) => {
      //
      const knowns: iFile[] = [],
        unknowns: iFile[] = [];
      for (let file of files)
        if (file.stat.mtime) knowns.push(file);
        else unknowns.push(file);
      // sort
      if (order === "asc")
        knowns.sort(
          (a, b) => a.stat.mtime!.getTime() - b.stat.mtime!.getTime()
        );
      else
        knowns.sort(
          (a, b) => b.stat.mtime!.getTime() - a.stat.mtime!.getTime()
        );
      // group
      const groups = createSortedGroup(knowns, (file) =>
        toDateString(file.stat.mtime!)
      );
      groups.push({
        name: "unknown",
        files: unknowns,
      });
      //
      return groups;
    },
  },
];

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
              by {name}
            </button>
          ))}
        </ul>
      </li>
    </ul>
  );
}

function createSortedGroup(
  files: iFile[],
  makeGroupName: (file: iFile) => string
) {
  const groups: SortedGroup[] = [];
  for (let file of files) {
    const groupName = makeGroupName(file);
    if (groups.at(-1) && groups.at(-1)!.name === groupName)
      groups.at(-1)!.files.push(file);
    else
      groups.push({
        name: groupName,
        files: [file],
      });
  }
  return groups;
}
