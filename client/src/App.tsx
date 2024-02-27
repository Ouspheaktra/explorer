import { useEffect, useRef, useState } from "react";
import { AppState, iDir } from "./types";
import Explorer from "./Explorer";
import {
  dirToPrevDir,
  prepareFile,
  promisesAllOneByOne,
  pushHistory as _pushHistory,
  setTitle,
} from "./utils";
import {
  GlobalContext,
  Next,
  PushHistory,
  SetDir,
  SetFile,
} from "./GlobalContext";
import { deleteFile, getDir, postCommand, postFile } from "./utils/api";
import ImagePlugin from "./ImagePlugin";
import VideoPlugin from "./VideoPlugin";
import PrevNext from "./PrevNext";
import { scrollFileIntoView } from "./List/utils";
import "./App.scss";

const plugins = [ImagePlugin, VideoPlugin];

function App() {
  const [state, setState] = useState<AppState>({
    dir: null,
    file: null,
    viewer: new URLSearchParams(location.search.slice(1)).get("viewer") || "",
  });
  const { dir, file, viewer } = state;
  const nextRef = useRef<Next>(() => {});
  const pushHistory: PushHistory = (updateState, pushHistory = true) =>
    _pushHistory({ ...state, ...updateState }, pushHistory);
  const setDir: SetDir = (dir, pushIntoHistory = true) =>
      getDir(dir).then((data) => {
        // push history
        if (pushIntoHistory) pushHistory({ dir: data }, true);
        // prepare
        data.prevDir = dirToPrevDir(data.dir);
        data.files.forEach((f, i) => {
          f._id = i;
          prepareFile(f);
        });
        //
        setState({ file: null, dir: data, viewer });
        return data;
      }),
    setFile: SetFile = (newFile) => {
      pushHistory({ file: newFile });
      setState({ viewer, dir, file: newFile });
    },
    setViewer = (viewer: string) => {
      pushHistory({ viewer }, false);
      setState({ file, dir, viewer });
    };
  // query data
  useEffect(() => {
    const search = new URLSearchParams(location.search.slice(1));
    const dirPath = search.get("dir") || "";
    setDir(dirPath, false).then((dir) => {
      const filename = search.get("file")!;
      if (filename) {
        const file = dir.files.find((f) => f.fullname === filename);
        if (file) {
          setState({ file, dir, viewer });
          scrollFileIntoView(file._id);
          setTitle({ ...state, dir, file });
        }
      } else setTitle({ ...state, dir });
    });
  }, []);
  //
  if (!dir) return "Loading...";
  const plugin =
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
              const newDir: iDir = { ...dir!, files: [...dir!.files] };
              const { files } = newDir;
              for (let newFile of newFiles) {
                const id = files.findIndex((file) => newFile._id === file._id);
                files[id] = prepareFile(newFile);
              }
              pushHistory({ dir: newDir, file: newFiles[0] }, false);
              setState({ file: newFiles[0], dir: newDir, viewer });
              // scrollFileIntoView(newFiles[0]._id);
              return newFiles;
            }
          ),
        deleteFiles: (files) =>
          promisesAllOneByOne(files.map((file) => deleteFile(file))).then(() =>
            setState({
              file,
              dir: {
                ...dir,
                files: dir.files.filter((f) => !files.includes(f)),
              },
              viewer,
            })
          ),
        commandFiles: (files, command, newExt) =>
          promisesAllOneByOne(
            files.map((file) => postCommand(file, command, newExt))
          ).then(() =>
            setState({
              file,
              dir: {
                ...dir,
                files: dir.files.filter((f) => !files.includes(f)),
              },
              viewer,
            })
          ),
        next: (plus) => nextRef.current(plus),
        setNext: (next) => (nextRef.current = next),
        pushHistory,
      }}
    >
      <div id="viewer">
        {file && plugin && <plugin.Viewer />}
        {file && <PrevNext />}
      </div>
      {viewer && plugin ? (
        <plugin.List
          closeButton={<button onClick={() => setViewer("")}>close</button>}
        />
      ) : (
        <Explorer
          topButtons={
            file ? (
              <button onClick={() => setViewer(file.type)}>{file.type}</button>
            ) : (
              plugins.map((p) => (
                <button key={p.type} onClick={() => setViewer(p.type)}>
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
