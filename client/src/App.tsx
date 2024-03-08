import { useEffect, useRef, useState } from "react";
import { AppState, ObjectLiteral, iDir } from "./types";
import Explorer from "./Explorer";
import {
  dirToPrevDir,
  prepareFile,
  promisesAllOneByOne,
  updateQuery as _updateQuery,
} from "./utils";
import { GlobalContext, Next, SetDir, SetFile } from "./GlobalContext";
import { deleteFile, getDir, postCommand, postFile } from "./utils/api";
import ImagePlugin from "./ImagePlugin";
import VideoPlugin from "./VideoPlugin";
import PrevNext from "./PrevNext";
import { scrollFileIntoView } from "./List/utils";
import "./App.scss";

const updateQuery = (
  { file, dir, ...rest }: Partial<AppState> & ObjectLiteral,
  options?: Parameters<typeof _updateQuery>[1]
) => {
  return _updateQuery(
    Object.assign(
      rest,
      file === null || file ? { file: file?.fullname || "" } : {},
      dir ? { dir: dir.dir } : {}
    ),
    options
  );
};

const plugins = [ImagePlugin, VideoPlugin];

function App() {
  const [state, _setState] = useState<AppState>({
    dir: null,
    file: null,
    viewer: new URLSearchParams(location.search.slice(1)).get("viewer") || "",
  });
  const setState = (newState: AppState) => {
    _setState(newState);
    document.title = newState.file?.fullname || newState.dir?.dir || "Explorer";
  };
  const { dir, file, viewer } = state;
  const nextRef = useRef<Next>(() => {});
  const setDir: SetDir = (dir, pushIntoHistory = true) =>
      getDir(dir).then((newDir) => {
        // push history
        if (pushIntoHistory)
          updateQuery({ dir: newDir, file: null }, { replace: true });
        // prepare
        newDir.prevDir = dirToPrevDir(newDir.dir);
        newDir.files.forEach((f, i) => {
          f._id = i;
          prepareFile(f);
        });
        //
        setState({ file: null, dir: newDir, viewer });
        return newDir;
      }),
    setFile: SetFile = (newFile) => {
      updateQuery({ file: newFile, dir });
      setState({ viewer, dir, file: newFile });
    },
    setViewer = (viewer: string) => {
      updateQuery({ viewer }, { useReplaceState: true });
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
        }
      }
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
              updateQuery(
                { dir: newDir, file: newFiles[0] },
                { useReplaceState: true }
              );
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
