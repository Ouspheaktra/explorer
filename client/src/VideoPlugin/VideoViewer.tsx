import { useEffect, useRef } from "react";
import PanZoom from "../utils/panzoom";
import { fileUrl, secondsToString } from "../utils";
import { useGlobal } from "../GlobalContext";
import "./style.scss";

export default function VideoViewer() {
  const {
    file,
    dir: { files },
    next,
  } = useGlobal();
  const { path, _id } = file;
  const panzoomHandle = useRef<PanZoom>();
  const isPlayingRef = useRef(true);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const timeBarRef = useRef<HTMLInputElement | null>(null);
  const volumeBarRef = useRef<HTMLInputElement | null>(null);
  const currentTimeRef = useRef<HTMLSpanElement | null>(null);
  const mouseHold = useRef<number | false>(false);
  const scrollWhenMouseHold = useRef(false);
  const toggleVideoPlayState = (play?: boolean) => {
    const video = videoRef.current!;
    if (play === undefined) video.paused ? video.play() : video.pause();
    else play ? video.play() : video.pause();
    isPlayingRef.current = !video.paused;
  };
  useEffect(() => {
    panzoomHandle.current?.dispose();
    const video = videoRef.current!;
    panzoomHandle.current = new PanZoom(video, {
      panButton: 2,
      doZoom: () => mouseHold.current === 2,
    });
  }, [_id]);
  const src = fileUrl(path);
  const vttFile = files.find((f) => f.ext === ".vtt" && f.name === file.name);
  return (
    <div
      className="video-player"
      ref={mainRef}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        id="video"
        ref={videoRef}
        src={src}
        autoPlay
        onWheel={({ deltaY, currentTarget: video }) => {
          if (mouseHold.current !== false) scrollWhenMouseHold.current = true;
          // zoom
          if (mouseHold.current === 2) video.currentTime += deltaY < 0 ? 5 : -5;
          // volume up/down
          else if (mouseHold.current === 4) {
            const newVolume = video.volume + (deltaY < 0 ? 0.1 : -0.1);
            video.volume = Math.max(0, Math.min(newVolume, 1));
          }
        }}
        onDoubleClick={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else mainRef.current!.requestFullscreen();
        }}
        onMouseDown={(e) => {
          if (e.button > 1) mouseHold.current = e.button;
          // prevent middle mouse click default behavior
          // from scroll down page
          else if (e.button === 1) e.preventDefault();
        }}
        onMouseUp={(e) => {
          if (e.button === 0) toggleVideoPlayState();
          if (mouseHold.current !== false && scrollWhenMouseHold.current)
            e.stopPropagation();
          mouseHold.current = scrollWhenMouseHold.current = false;
        }}
        onPause={() => (mainRef.current!.dataset.isPaused = "paused")}
        onPlay={() => (mainRef.current!.dataset.isPaused = "")}
        onEnded={() => next(1)}
        onTimeUpdate={({ currentTarget: video }) => {
          timeBarRef.current!.value = video.currentTime.toString();
          currentTimeRef.current!.textContent = [
            secondsToString(video.currentTime),
            secondsToString(video.duration),
          ].join("/");
        }}
        onDurationChange={({ currentTarget: video }) => {
          timeBarRef.current!.max = video.duration.toString();
          toggleVideoPlayState(isPlayingRef.current);
        }}
        onVolumeChange={({ currentTarget: video }) => {
          volumeBarRef.current!.value = video.volume.toString();
          localStorage.setItem("volume", video.volume.toString());
        }}
        onLoadedData={({ currentTarget: video }) => {
          const volume = localStorage.getItem("volume") || "1";
          volumeBarRef.current!.value = volume;
          video.volume = parseFloat(volume);
        }}
      >
        {vttFile && (
          <track
            default
            src={fileUrl(vttFile.path)}
            kind="captions"
            srcLang="en"
            label="English"
          />
        )}
      </video>
      {/* PLAY */}
      <button className="vp-play" onClick={() => toggleVideoPlayState()}>
        ▶️
      </button>
      {/* COLOR */}
      <form
        className="vp-color"
        onInput={({ currentTarget: form }) => {
          videoRef.current!.style.filter = [
            `contrast(${form.contrast.valueAsNumber}%)`,
            `brightness(${form.brightness.valueAsNumber}%)`,
            `saturate(${form.saturate.valueAsNumber}%)`,
            `hue-rotate(${form.hue.valueAsNumber}deg)`,
          ].join(" ");
        }}
        onReset={({ currentTarget: form }) =>
          setTimeout(
            () => form.dispatchEvent(new Event("input", { bubbles: true })),
            1
          )
        }
      >
        bright__:{" "}
        <input
          name="brightness"
          type="number"
          min="0"
          step="4"
          defaultValue="100"
        />
        <br />
        contrast:{" "}
        <input
          name="contrast"
          type="number"
          min="0"
          step="4"
          defaultValue="100"
        />
        <br />
        saturate:{" "}
        <input
          name="saturate"
          type="number"
          min="0"
          step="4"
          defaultValue="100"
        />
        <br />
        hue_____:{" "}
        <input name="hue" type="number" min="0" step="4" defaultValue="360" />
        <br />
        <input type="reset" />
      </form>
      {/* CONTROL */}
      <div className="vp-control">
        <div className="vp-timebar-container">
          <div className="vp-more"></div>
          <input
            ref={timeBarRef}
            className="vp-timebar"
            type="range"
            min={0}
            onInput={(e) =>
              (videoRef.current!.currentTime = e.currentTarget.valueAsNumber)
            }
            onMouseMove={({ currentTarget: range, clientX }) => {
              const boundingRect = range.getBoundingClientRect();
              const mouseX = clientX - boundingRect.left;
              const ratio = mouseX / range.offsetWidth;
              const potentialValue = Math.round(ratio * parseInt(range.max));
              const preview = previewRef.current!;
              preview.currentTime = potentialValue;
              preview.parentElement!.style.left = mouseX + "px";
              preview.previousElementSibling!.textContent =
                secondsToString(potentialValue);
            }}
          />
          <div className="vp-preview">
            <span className="vp-time"></span>
            <video
              ref={previewRef}
              src={src}
              autoPlay={false}
              muted={true}
              height={80}
            />
          </div>
        </div>
        <div className="vp-buttons-container">
          <div className="vp-buttons-side-container">
            <button
              onClick={() => toggleVideoPlayState()}
              className="vp-play-btn"
            ></button>
            <span ref={currentTimeRef} className="vp-time"></span>
          </div>
          <div className="vp-buttons-side-container">
            <input
              ref={volumeBarRef}
              className="vp-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              onInput={(e) => {
                const video = videoRef.current!;
                video.volume = e.currentTarget.valueAsNumber;
                video.muted = false;
              }}
            />
            <button
              type="button"
              onClick={(e) =>
                document.fullscreenElement
                  ? document.exitFullscreen()
                  : e.currentTarget
                      .closest(".video-player")!
                      .requestFullscreen()
              }
            >
              F
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
