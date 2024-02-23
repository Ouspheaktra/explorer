import express from "express";
import p from "path";
import fs from "fs";
import { execSync, exec } from "child_process";
import bodyParser from "body-parser";
import jobs from "./jobs";
import {
  iFile,
  getFileDetail,
  getFileParts,
  mimeTypes,
  readFilesData,
  writeFilesData,
  dataURLtoFile,
  removeThumbnails,
  replaceAll,
  findAvailableName,
} from "./utils";

const app = express();
const port = process.env.PORT || (__filename.endsWith(".js") ? 5555 : 5000);

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(express.static(p.join(__dirname, "../client/dist")));

app.get("/", (req, res) => {
  res.sendFile(p.join(__dirname, "../client/dist", "index.html"));
});

app.use(bodyParser.json({ limit: "1mb" }));

app.get("/api/dir", (req, res) => {
  const { dir = "" } = req.query as { dir: string };
  //
  const filesData = readFilesData(dir);
  //
  return res.json({
    dir,
    files: (dir
      ? //
        fs.readdirSync(dir + "/")
      : // list drive
        execSync("wmic logicaldisk get caption", { encoding: "utf-8" })
          .split("\n")
          .slice(1)
          .map((o) => o.trim())
          .filter(Boolean)
    )
      .filter((o) => !o.startsWith("."))
      .map((filename) =>
        getFileDetail(dir ? dir + "/" + filename : filename, filesData)
      ),
  });
});

app.post("/api/file", (req, res) => {
  const {
    file,
    details,
    newName: originalNewName,
  } = req.body as {
    file: iFile;
    details: iFile["details"];
    newName: string;
  };
  const { dir, name, ext } = file;
  const oldFullname = name + ext;
  let newName = originalNewName;
  let newFullname = newName + ext;
  // rename
  if (newName) {
    // keep rename newName if exist
    newName = findAvailableName(dir, newName, ext);
    fs.renameSync(dir + "/" + oldFullname, dir + "/" + newName + ext);
    // rename thumbnail
    const thumbnailDir = dir + "/.explorer/thumbnails/";
    fs.readdirSync(thumbnailDir).forEach(
      (filename) =>
        filename.startsWith(oldFullname) &&
        fs.renameSync(
          thumbnailDir + filename,
          thumbnailDir + newFullname + filename.slice(oldFullname.length)
        )
    );
  }
  const data = readFilesData(dir);
  // edit details
  delete data[name + ext]; // delete old details
  if (Object.keys(details).length) data[(newName || name) + ext] = details;
  //
  writeFilesData(dir, data);
  //
  return res.json({
    ...file,
    ...getFileDetail(dir + "/" + (newName || name) + ext, data),
  });
});

app.delete("/api/file", (req, res) => {
  const { file } = req.body as {
    file: iFile;
  };
  const { dir, name, ext } = file;
  const fullname = name + ext;
  const path = dir + "/" + fullname;
  // remove file
  if (!fs.existsSync(path)) return res.sendStatus(404);
  fs.rmSync(path);
  // remove thumbnail
  removeThumbnails(file);
  // remove data
  const data = readFilesData(dir);
  delete data[fullname];
  writeFilesData(dir, data);
  //
  return res.sendStatus(200);
});

app.post("/api/thumbnails", (req, res) => {
  const {
    file: { dir, name, ext },
    datas,
  } = req.body as {
    file: iFile;
    datas: string[];
  };
  const thumbnailsDir = dir + "/.explorer/thumbnails/";
  fs.mkdirSync(thumbnailsDir, { recursive: true });
  for (let id = 0; id < datas.length; id++)
    dataURLtoFile(
      datas[id],
      thumbnailsDir + name + ext + "_" + ("" + id).padStart(2, "0") + ".jpg"
    );
  return res.sendStatus(200);
});

app.post("/api/command", (req, res) => {
  const { file, command: originalCommand } = req.body as {
    file: iFile;
    command: string;
    newExt?: string;
  };
  const { dir, name, ext } = file;
  const newExt: string = req.body.newExt || ext;
  // copy file into .explorer
  const explorerDir = dir + "/.explorer/",
    fullname = name + ext,
    tempFullname = name + "_temp" + ext,
    outFullname = name + newExt;
  fs.renameSync(dir + "/" + fullname, explorerDir + tempFullname);
  // prepare command
  let command = originalCommand;
  for (let [placeholder, value] of [
    ["input", explorerDir + tempFullname],
    ["output", explorerDir + outFullname],
  ])
    command = replaceAll(command, `{${placeholder}}`, value);
  //
  jobs.add((next) => {
    console.log("Command on file", fullname);
    exec(command, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("Command finished:\n ", fullname, "\n ", originalCommand);
        // remove thumbnails
        removeThumbnails(file);
        // remove temp file
        fs.rmSync(explorerDir + tempFullname);
        // edit details
        const newName = findAvailableName(dir, name, newExt),
          newFullname = newName + newExt,
          data = readFilesData(dir),
          oldDetails = data[fullname];
        delete data[fullname]; // delete old details
        if (oldDetails) data[newFullname] = oldDetails;
        writeFilesData(dir, data);
        // move file back
        fs.renameSync(explorerDir + outFullname, dir + "/" + newFullname);
      }
      //
      next();
    });
  });
  //
  res.sendStatus(200);
});

app.get("/file", (req, res) => {
  const { path = "" } = req.query as { path: string };
  //
  if (!fs.existsSync(path)) return res.sendStatus(404);
  //
  const { ext } = getFileParts(path);
  // if is director, 404
  if (!ext) return res.sendStatus(404);
  // if image file
  if (Object.keys(mimeTypes.image).includes(ext)) return res.sendFile(path);
  // if video file
  else if (Object.keys(mimeTypes.video).includes(ext)) {
    const size = fs.statSync(path).size;
    const range = req.headers.range;
    let fileStream: fs.ReadStream;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      fileStream = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": mimeTypes.video[ext],
      };
      res.writeHead(206, head);
    } else {
      fileStream = fs.createReadStream(path);
      const head = {
        "Content-Length": size,
        "Content-Type": mimeTypes.video[ext],
      };
      res.writeHead(200, head);
    }
    fileStream.on("error", (err) => {
      console.log("ERROR FILE", path);
      console.error(err);
    });
    fileStream.pipe(res);
  } else return res.send("no viewer for extension: " + ext);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
