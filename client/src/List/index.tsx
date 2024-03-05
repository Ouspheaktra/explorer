import { useEffect, useRef, useState } from "react";
import { ListProps, Order, SortedGroup } from "./types";
import { builtinSorts } from "./builtin";
import { useGlobal } from "../GlobalContext";
import Editor from "../Editor";
import { iFile } from "../types";
import { toggleItem, updateQuery } from "../utils";
import { scrollFileIntoView } from "./utils";
import TrashEditor from "../Editor/editors/TrashEditor";
import "./style.scss";

export default function List({
  listTop,
  topButtons,
  bottomButtons,
  sorts = [],
  FileComponent,
  filteredFiles,
  EditorComponents,
  ...ulProps
}: ListProps) {
  const [open, setOpen] = useState(true);
  const { setDir, file, setFile, setNext } = useGlobal();
  const [selecteds, setSelecteds] = useState<iFile[]>(file ? [file] : []);
  useEffect(
    () =>
      !file
        ? setSelecteds([])
        : !selecteds.includes(file)
        ? setSelecteds([file])
        : undefined,
    [file]
  );
  const query = new URLSearchParams(location.search.slice(1));
  const [fullMode, setFullMode] = useState(
    Boolean(query.get("viewer") && query.get("full-list") === "1")
  );
  const allSorts = [...sorts, ...builtinSorts];
  const querySortName = query.get("sort-name");
  const [[sortName, sortOrder], setSort] = useState<[string, Order]>([
    (querySortName && allSorts.find((s) => s.name === querySortName)?.name) ||
      builtinSorts[0].name,
    (query.get("sort-order") as Order) || "asc",
  ]);
  const toSortStore = useRef<{
    sortName: string;
    sortOrder: string;
    filteredFiles: iFile[];
    sortedGroups: SortedGroup[];
  }>({
    sortName: "",
    sortOrder,
    filteredFiles: [],
    sortedGroups: [],
  });

  if (
    sortName !== toSortStore.current.sortName ||
    sortOrder !== toSortStore.current.sortOrder ||
    filteredFiles !== toSortStore.current.filteredFiles
  ) {
    console.log("RE SORT");
    const sorter = allSorts.find((sort) => sort.name === sortName)!;
    const sortedGroups = sorter.sort(filteredFiles);
    const unknown = sortedGroups.pop()!;
    if (sortOrder === "desc") {
      sortedGroups.reverse();
      sortedGroups.forEach((g) => g.files.reverse());
      unknown.files.reverse();
    }
    sortedGroups.push(unknown);
    Object.assign(toSortStore.current, {
      sortName,
      sortOrder,
      sortedGroups,
      filteredFiles,
    });
  }
  const { sortedGroups } = toSortStore.current;
  setNext((plus) => {
    const [file] = selecteds;
    if (!file) return;
    const files = sortedGroups.map(({ files }) => files).flat();
    const currentId = files.indexOf(file);
    if (currentId) setFile(files.at((currentId + plus) % files.length)!);
  });
  return (
    <>
      <ul
        {...ulProps}
        className={"list" + (open ? "" : " hide") + (fullMode ? " full" : "")}
      >
        <li className="list-top">
          <ul>
            <li className="list-top-buttons">
              {topButtons}
              <button
                className="list-fuller"
                onClick={() => {
                  const [file] = selecteds;
                  // if back to list mode
                  // view first selected file
                  if (fullMode && selecteds.length) setFile(file);
                  //
                  setFullMode(!fullMode);
                  updateQuery(
                    { ["full-list"]: fullMode ? "" : "1" },
                    { useReplaceState: true }
                  );
                  //
                  if (file) scrollFileIntoView(file._id);
                }}
                style={{ backgroundColor: "aqua" }}
              >
                {fullMode ? "S" : "F"}
              </button>
              <button
                className="list-opener"
                onClick={() => {
                  document
                    .getElementById("viewer")!
                    .classList.toggle("full", open);
                  setOpen(!open);
                }}
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
                  const isCurrent = selecteds.includes(f);
                  return (
                    <li
                      key={_id}
                      data-file-id={_id}
                      data-file-fullname={fullname}
                      className={`is-${type} ${isCurrent ? "active" : ""}`}
                      onClick={(e) => {
                        if (type === "unknown") return;
                        // if fullscreen, select mode
                        if (fullMode) {
                          if (e.ctrlKey)
                            setSelecteds(toggleItem([...selecteds!], f));
                          else setSelecteds([f]);
                        } else if (!isCurrent) {
                          // is file, change file
                          if (ext) setFile(f);
                          // if directory, change dir
                          else setDir(dir);
                        }
                      }}
                    >
                      <FileComponent fullMode={fullMode} file={f} />
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
        <li className="list-bottom">
          Order:
          <br />
          {allSorts.map(({ name }) => (
            <button
              key={name}
              data-order={sortOrder}
              className={"order-btn" + (sortName === name ? " active" : "")}
              onClick={() => {
                const order =
                  sortName !== name
                    ? "asc"
                    : sortOrder === "asc"
                    ? "desc"
                    : "asc";
                setSort([name, order]);
                updateQuery(
                  { ["sort-name"]: name, ["sort-order"]: order },
                  { useReplaceState: true }
                );
                if (selecteds.length) scrollFileIntoView(selecteds.at(-1)!._id);
              }}
            >
              {name}
            </button>
          ))}
          {bottomButtons}
        </li>
      </ul>
      {selecteds.length && (
        <Editor
          Components={[...EditorComponents, TrashEditor]}
          selecteds={selecteds}
        />
      )}
    </>
  );
}
