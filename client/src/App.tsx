import { useEffect, useRef, useState } from "react";
import { AppState, iDir } from "./types";
import Explorer from "./Explorer";
import {
  dirToPrevDir,
  prepareFile,
  promisesAllOneByOne,
  pushHistory,
  setTitle,
} from "./utils";
import { GlobalContext, Next, SetDir, SetFile } from "./GlobalContext";
import { deleteFile, getDir, postCommand, postFile } from "./utils/api";
import ImagePlugin from "./ImagePlugin";
import VideoPlugin from "./VideoPlugin";
import PrevNext from "./PrevNext";
import "./App.scss";
import { scrollFileIntoView } from "./List/utils";

const plugins = [ImagePlugin, VideoPlugin];

function App() {
  const [state, setState] = useState<AppState>({
    dir: null,
    file: null,
    viewerMode: false,
  });
  const { dir, file, viewerMode } = state;
  const nextRef = useRef<Next>(() => {});
  const setDir: SetDir = (dir, pushIntoHistory = true) =>
      getDir(dir).then((data) => {
        // push history
        if (pushIntoHistory) pushHistory({ ...state, dir: data }, true);
        // prepare
        data.prevDir = dirToPrevDir(data.dir);
        data.files.forEach((f, i) => {
          f._id = i;
          prepareFile(f);
        });
        //
        setState({ file: null, dir: data, viewerMode });
        return data;
      }),
    setFile: SetFile = (newFile) => {
      pushHistory({ ...state, file: newFile });
      setState({ viewerMode, dir, file: newFile });
    };
  // query data
  useEffect(() => {
    const search = new URLSearchParams(location.search.slice(1));
    const dirPath = search.get("dir") || "";
    setDir(dirPath, false).then((dir) => {
      const filename = search.get("file")!;
      if (filename) {
        const file = dir.files.find((f) => f.fullname === filename);
        const viewerMode = search.get("viewerMode") === "true";
        if (file) {
          setState({ file, dir, viewerMode });
          scrollFileIntoView(file._id);
          setTitle({ ...state, dir, file });
        }
      } else setTitle({ ...state, dir });
    });
  }, []);
  //
  if (!dir) return "Loading...";
  const plugin =
    file && file.type && plugins.find((plugin) => plugin.type === file.type);
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
              pushHistory({ ...state, dir: newDir, file: newFiles[0] }, false);
              setState({ file: newFiles[0], dir: newDir, viewerMode });
              // scrollFileIntoView(newFiles[0]._id);
              return newFiles;
            }
          ),
        deleteFiles: (files) =>
          promisesAllOneByOne(files.map((file) => deleteFile(file))).then(
            () =>
              setState({
                file,
                dir: {
                  ...dir,
                  files: dir.files.filter((f) => !files.includes(f)),
                },
                viewerMode,
              })
          ),
        commandFiles: (files, command, newExt) =>
          promisesAllOneByOne(files.map((file) => postCommand(file, command, newExt))).then(
            () =>
              setState({
                file,
                dir: {
                  ...dir,
                  files: dir.files.filter((f) => !files.includes(f)),
                },
                viewerMode,
              })
          ),
        viewerMode,
        setViewerMode: (viewerMode) => {
          pushHistory({ ...state, viewerMode }, false);
          setState({ file, dir, viewerMode });
        },
        next: (plus) => nextRef.current(plus),
        setNext: (next) => (nextRef.current = next),
      }}
    >
      <div id="viewer">
        {plugin && <plugin.Viewer />}
        {file && <PrevNext />}
      </div>
      {viewerMode && plugin ? <plugin.List /> : <Explorer />}
    </GlobalContext.Provider>
  );
}

export default App;
