import { useEffect, useRef } from "react";
import PanZoom from "../utils/panzoom";
import { fileUrl, secondsToString } from "../utils";
import { useGlobal } from "../GlobalContext";
import "./style.scss";

const zoomSpeed = 0.03;

export default function VideoViewer() {
  const { file, next } = useGlobal();
  const { path, _id } = file;
  const panzoomHandle = useRef<PanZoom>();
  const isPlayingRef = useRef(true);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const timeBarRef = useRef<HTMLInputElement | null>(null);
  const volumeBarRef = useRef<HTMLInputElement | null>(null);
  const currentTimeRef = useRef<HTMLSpanElement | null>(null);
  const isRightHold = useRef(false);
  const toggleVideoPlayState = (play?: boolean) => {
    const video = videoRef.current!;
    if (play === undefined) video.paused ? video.play() : video.pause();
    else play ? video.play() : video.pause();
    isPlayingRef.current = !video.paused;
  };
  useEffect(() => {
    panzoomHandle.current?.dispose();
    const video = videoRef.current!;
    panzoomHandle.current = new PanZoom(video);
  }, [_id]);
  const src = fileUrl(path);
  return (
    <div className="video-player" ref={mainRef}>
      <video
        id="video"
        ref={videoRef}
        src={src}
        autoPlay
        onWheel={({ deltaY }) => {
          if (isRightHold.current)
            videoRef.current!.currentTime += deltaY < 0 ? 5 : -5;
        }}
        onDoubleClick={(e) => {
          if (document.fullscreenElement) document.exitFullscreen();
          else e.currentTarget.parentElement!.requestFullscreen();
        }}
        onMouseDown={(e) => {
          if (e.button === 2) isRightHold.current = true;
        }}
        onMouseUp={({ button }) => {
          if (isRightHold.current && button === 0) toggleVideoPlayState();
          isRightHold.current = false;
          if (button === 1) next(1);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        onPause={() => {
          mainRef.current!.dataset.isPaused = "paused";
        }}
        onPlay={() => {
          mainRef.current!.dataset.isPaused = "";
        }}
        onEnded={() => {
          next(1);
        }}
        onTimeUpdate={({ currentTarget: video }) => {
          if (timeBarRef.current)
            timeBarRef.current.value = video.currentTime.toString();
          if (currentTimeRef.current)
            currentTimeRef.current.textContent = `${secondsToString(
              video.currentTime
            )} / ${secondsToString(video.duration)}`;
        }}
        onDurationChange={({ currentTarget: video }) => {
          timeBarRef.current
            ? (timeBarRef.current.max = video.duration.toString())
            : null;
          toggleVideoPlayState(isPlayingRef.current);
        }}
        onLoadedData={({ currentTarget: video }) =>
          volumeBarRef.current
            ? (volumeBarRef.current.value = video.volume.toString())
            : null
        }
      />
      <button className="vp-play" onClick={() => toggleVideoPlayState()}>
        ▶️
      </button>
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
      <div className="vp-control">
        <div className="vp-timebar-container">
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
                videoRef.current!.volume = e.currentTarget.valueAsNumber;
                videoRef.current!.muted = false;
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
