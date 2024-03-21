import { useRef, useState } from "react";
import { iDir, iFile } from "./types";
import {
  prepareFile,
  promisesAllOneByOne,
  objectToQuery,
  dirToPrevDir,
} from "./utils";
import { GetNext, GlobalContext, Next, SetDir, SetFile } from "./GlobalContext";
import { deleteFile, postCommand, postFile } from "./utils/api";
import ImagePlugin from "./ImagePlugin";
import VideoPlugin from "./VideoPlugin";
import {
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Explorer from "./components/Explorer";
import PrevNext from "./components/PrevNext";
import "./App.scss";

const plugins = [ImagePlugin, VideoPlugin];

document.onfullscreenchange = () => {
  if (document.fullscreenElement) document.body.classList.add("fullscreen");
  else document.body.classList.remove("fullscreen");
};

function App() {
  const [updateId, setUpdateId] = useState(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewer = searchParams.get("viewer");
  const { file, dir } = useLoaderData() as { file: iFile | null; dir: iDir };
  document.title = file ? file.fullname : dir.dir || "Explorer";
  const getNextRef = useRef<GetNext>(() => undefined);
  //
  if (!dir) return "Loading...";
  //
  const setDir: SetDir = (dir) => navigate(`/${encodeURIComponent(dir)}`),
    setFile: SetFile = (file) =>
      file
        ? // prettier-ignore
          navigate(`/${encodeURIComponent(dir.dir)}/${encodeURIComponent(file.fullname)}${location.search}`)
        : setDir(dir.dir),
    getNext: GetNext = (plus) => getNextRef.current(plus),
    next: Next = (plus) => {
      const file = getNext(plus);
      if (file) setFile(file);
    },
    onCommand = (files: iFile[]) => () => {
      let nextId = 1;
      let next = getNext(nextId);
      while (next && files.includes(next)) next = getNext(++nextId);
      if (next) setFile(next);
      else setDir(dir.dir);
      dir.files = dir.files.filter((f) => !files.includes(f));
    },
    plugin =
      plugins.find((p) => (file ? p.type === file.type : p.type === viewer)) ||
      false;
  return (
    <GlobalContext.Provider
      value={{
        dir,
        setDir,
        file: file!,
        setFile,
        updateFiles: (args) =>
          promisesAllOneByOne(args.map((arg) => postFile(...arg))).then(
            (newFiles) => {
              const { files } = dir;
              for (let newFile of newFiles) {
                const file = files.find((file) => newFile._id === file._id);
                if (file) Object.assign(file, prepareFile(newFile));
              }
              setUpdateId(updateId + 1);
              return newFiles;
            }
          ),
        deleteFiles: (files) =>
          promisesAllOneByOne(files.map((file) => deleteFile(file))).then(
            onCommand(files)
          ),
        commandFiles: (files, ...rest) =>
          promisesAllOneByOne(
            files.map((file) => postCommand(file, ...rest))
          ).then(onCommand(files)),
        next,
        getNext,
        setGetNext: (getNext) => (getNextRef.current = getNext),
      }}
    >
      {/* VIEWER */}
      <div
        id="viewer"
        onDoubleClick={(e) => {
          if (document.fullscreenElement) document.exitFullscreen();
          else e.currentTarget.requestFullscreen();
        }}
      >
        {file && plugin && <plugin.Viewer />}
        {file && <PrevNext />}
      </div>
      {/* LIST */}
      {viewer && plugin ? (
        <plugin.List
          closeButton={
            <button
              onClick={() =>
                setSearchParams((q) => {
                  q.delete("viewer");
                  return q;
                })
              }
            >
              close
            </button>
          }
        />
      ) : (
        <Explorer
          topButtons={
            file ? (
              <button
                onClick={() =>
                  setSearchParams((q) => {
                    q.set("viewer", file.type);
                    return q;
                  })
                }
              >
                {file.type}
              </button>
            ) : (
              plugins.map((p) => (
                <button
                  key={p.type}
                  onClick={() =>
                    setSearchParams((q) => {
                      q.set("viewer", p.type);
                      return q;
                    })
                  }
                >
                  {p.type}
                </button>
              ))
            )
          }
        />
      )}
    </GlobalContext.Provider>
  );
}

export default App;

let lastDirectory: string | undefined = "[---]",
  lastDir: iDir = { dir: "", prevDir: "", files: [] };

export const appLoader: LoaderFunction = async ({
  params: { directory, filename },
}) => {
  const dir =
    lastDirectory === directory
      ? lastDir
      : await fetch(`/api/dir?${objectToQuery({ dir: directory || "" })}`)
          .then((res) => res.json())
          .then((dir: iDir) => {
            dir.files = dir.files.filter((f) => !f.ext || f.stat.size);
            dir.prevDir = dirToPrevDir(dir.dir);
            dir.files.forEach((f, i) => {
              f._id = i;
              prepareFile(f);
            });
            return dir;
          });
  lastDirectory = directory;
  lastDir = dir;
  return {
    dir,
    file: (filename && dir.files.find((f) => f.fullname === filename)) || null,
  };
};
