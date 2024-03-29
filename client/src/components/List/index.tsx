import { useEffect, useRef, useState } from "react";
import { FilterRegexGroup, ListProps, Order, SortedGroup } from "./types";
import { builtinSorts } from "./builtin";
import { useGlobal } from "../../GlobalContext";
import Editor from "../Editor";
import { iFile } from "../../types";
import { notBoolean, toggleItem } from "../../utils";
import { FILTER_REG, scrollFileIntoView } from "./utils";
import TrashEditor from "../TrashEditor";
import { useSearchParams } from "react-router-dom";
import "./style.scss";

export default function List({
  listTop,
  topButtons,
  bottomButtons,
  sorts = [],
  FileComponent,
  filteredFiles: preFilteredFiles,
  EditorComponents,
  ...ulProps
}: ListProps) {
  const [open, setOpen] = useState(true);
  const { setDir, file, setFile, setGetNext } = useGlobal();
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);
  const [selecteds, setSelecteds] = useState<iFile[]>(file ? [file] : []);
  const [sortedGroups, setSortedGroups] = useState<SortedGroup[]>([]);
  const [query, setSearchParams] = useSearchParams();
  const fullMode = Boolean(
    query.get("viewer") && query.get("full-list") === "1"
  );
  const allSorts = [...sorts, ...builtinSorts];
  const querySortName = query.get("sort-name");
  const sortName =
    (querySortName && allSorts.find((s) => s.name === querySortName)?.name) ||
    builtinSorts[1].name;
  const sortOrder = query.get("sort-order") || ("desc" as Order);
  const filter = query.get("filter") || "";

  // new file, update selecteds
  useEffect(() => {
    if (file) setSelecteds([file]);
    else setSelecteds([]);
  }, [file]);

  // sort and filter
  useEffect(() => {
    console.log("SORT || FILTER");

    let filteredFiles = preFilteredFiles;

    // FILTER
    if (filter) {
      const filters = filter
        .split("\n")
        .map((f) => FILTER_REG.exec(f)!.groups! as unknown as FilterRegexGroup);
      let first = true;
      for (let filter of filters) {
        const { not, detail: detailName, word } = filter;
        // if has detail name
        if (detailName) {
          if (first) {
            first = false;
            filteredFiles = [];
          }
          filteredFiles = filteredFiles.concat(
            preFilteredFiles.filter(({ details }) => {
              const detail = details[detailName] as string | string[];
              return detail
                ? notBoolean(
                    not,
                    Array.isArray(detail)
                      ? detail.some((o) => o === word)
                      : detail === word
                  )
                : false;
            })
          );
        }
        // if filename
        else {
          filteredFiles = filteredFiles.filter(({ name }) =>
            notBoolean(not, name.startsWith(word))
          );
        }
      }
    }

    // SORT
    const sorter = allSorts.find((sort) => sort.name === sortName)!;
    const sortedGroups = sorter.sort(filteredFiles);
    const unknown = sortedGroups.pop()!;
    if (sortOrder === "desc") {
      sortedGroups.reverse();
      sortedGroups.forEach((g) => g.files.reverse());
      unknown.files.reverse();
    }
    sortedGroups.push(unknown);
    //
    setSortedGroups(sortedGroups);
  }, [sortName, sortOrder, filter, preFilteredFiles]);

  setGetNext((plus) => {
    const [file] = selecteds;
    if (!file) return;
    const files = sortedGroups.map(({ files }) => files).flat();
    const currentId = files.indexOf(file);
    if (currentId > -1) return files.at((currentId + plus) % files.length)!;
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
              {/* FULLMODE */}
              <button
                className="list-fuller"
                onClick={() => {
                  //
                  setSearchParams((q) => {
                    q.set("full-list", fullMode ? "" : "1");
                    return q;
                  });
                  // if back to list mode
                  // view first selected file
                  const [file] = selecteds;
                  if (fullMode && file) setFile(file);
                  //
                  if (file) scrollFileIntoView(file._id);
                }}
                style={{ backgroundColor: "aqua" }}
              >
                {fullMode ? "S" : "F"}
              </button>
              {/* OPEN/CLOSE */}
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
            // GROUP NAME
            <li key={gid} className="list-group">
              <button
                className="list-group-name"
                onContextMenu={(e) => e.preventDefault()}
                onClick={(e) => {
                  const textarea = filterBtnRef.current!
                    .previousElementSibling! as HTMLTextAreaElement;
                  // left click, add to filter
                  if (e.button === 0) {
                    textarea.value =
                      `[${sortName}]${name}\n${textarea.value}`.trim();
                  }
                  // right click, add negative to filter
                  else if (e.button === 2) {
                    textarea.value =
                      `![${sortName}]${name}\n${textarea.value}`.trim();
                  }
                  textarea.dispatchEvent(new Event("input", { bubbles: true }));
                }}
              >
                {name}
              </button>
              {/* FILES */}
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
                          else {
                            setDir(dir);
                            document.getElementById("reset-filter")!.click();
                          }
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
          {/* ORDER */}
          Order:
          <select
            value={sortName}
            onChange={(e) => {
              const newSortName = e.currentTarget.value;
              setSearchParams((q) => {
                q.set("sort-name", newSortName);
                return q;
              });
              if (selecteds.length) scrollFileIntoView(selecteds.at(-1)!._id);
            }}
          >
            {allSorts.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => {
              const newSortOrder = e.currentTarget.value as Order;
              setSearchParams((q) => {
                q.set("sort-order", newSortOrder);
                return q;
              });
              if (selecteds.length) scrollFileIntoView(selecteds.at(-1)!._id);
            }}
          >
            {["asc", "desc"].map((order) => (
              <option key={order} value={order}>
                {order}
              </option>
            ))}
          </select>
          <br />
          {/* FILTER */}
          Filter:
          <br />
          <button
            id="reset-filter"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => {
              const filterInput = filterBtnRef.current!
                .previousElementSibling! as HTMLTextAreaElement;
              filterInput.value = "";
              filterInput.dispatchEvent(new Event("input", { bubbles: true }));
              filterBtnRef.current!.click();
            }}
          >
            &times;
          </button>
          <textarea
            rows={1}
            defaultValue={filter}
            className="filter auto-height"
            onInput={(e) => {
              const element = e.currentTarget;
              element.style.height = "5px";
              element.style.height = element.scrollHeight + "px";
            }}
          ></textarea>
          <button
            ref={filterBtnRef}
            onClick={(e) => {
              const filterInput = e.currentTarget
                .previousElementSibling! as HTMLTextAreaElement;
              const newFilter = filterInput.value.trim();
              if (newFilter === filter) return;
              setSearchParams((q) => {
                q.set("filter", newFilter);
                return q;
              });
            }}
          >
            ➜
          </button>
          <br />
          {bottomButtons}
        </li>
      </ul>
      {/* EDITOR */}
      {selecteds.length && (
        <Editor
          key={selecteds[0]._id}
          Components={[...EditorComponents, TrashEditor]}
          selecteds={selecteds}
        />
      )}
    </>
  );
}
