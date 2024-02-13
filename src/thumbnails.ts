import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";

export const thumbnailImage = (imagePath: string, outputPath: string) =>
  sharp(imagePath)
    .metadata()
    .then((metadata) =>
      sharp(imagePath)
        .resize(
          metadata.width! > metadata.height!
            ? // Landscape
              {
                height: 200,
                width: undefined,
              }
            : // Portrait
              {
                width: 200,
                height: undefined,
              }
        )
        .toFile(outputPath)
    );

export const thumbnailsVideo = (videoPath: string, outputDir: string) =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      const { width, height } = metadata.streams[0];
      ffmpeg(videoPath)
        .screenshots({
          count: 5,
          folder: "outputDir",
          size: width! > height! ? "?x200" : "200x?",
        })
        .on("error", reject)
        .on("end", resolve)
        // .save(outputPath);
    });
  });

