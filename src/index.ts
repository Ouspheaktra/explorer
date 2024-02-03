import express from "express";
import p from "path";
import fs from "fs";
import { execSync } from "child_process";
import bodyParser from "body-parser";
import {
  iFile,
  findMaxId,
  getFileDetail,
  getFileParts,
  mimeTypes,
  readFilesData,
  writeFilesData,
} from "./utils";

const app = express();
const port = process.env.PORT || 5000;

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(express.static(p.join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.sendFile(p.join(__dirname, '../client/dist', 'index.html'));
});

app.use(bodyParser.json());

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

// TODO update file {dir, name, newName, details, newTags}
app.post("/api/file", (req, res) => {
  const {
    file: { dir, name, ext, id },
    details,
    newName,
  } = req.body as {
    file: iFile;
    details: iFile["details"];
    newName: string;
  };
  const hasDetails = Object.keys(details).length;
  const newId = id || (hasDetails ? findMaxId(readFilesData(dir)) + 1 : id);
  const newPath = dir + "/" + newName + (newId ? " - " + newId : "") + ext;
  // rename
  if (typeof newName === "string")
    fs.renameSync(dir + "/" + name + (id ? " - " + id : "") + ext, newPath);
  // edit details
  if (hasDetails) {
    const data = readFilesData(dir);
    data[newId!] = details;
    //
    writeFilesData(dir, data);
  }
  return res.json(getFileDetail(newPath, readFilesData(dir)));
});

app.get("/file", (req, res) => {
  const { path = "" } = req.query as { path: string };
  const { ext } = getFileParts(path);
  // if is director, 404
  if (!ext) return res.sendStatus(404);
  // if image file
  if (Object.keys(mimeTypes.image).includes(ext)) return res.sendFile(path);
  // if video file
  else if (Object.keys(mimeTypes.video).includes(ext)) {
    const size = fs.statSync(path).size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": mimeTypes.video[ext],
      };
      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        "Content-Length": size,
        "Content-Type": mimeTypes.video[ext],
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
    }
  } else return res.send("no viewer for extension: " + ext);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
