import { useEffect, useRef } from "react";
import panZoom, { PanZoom } from "panzoom";
import { fileUrl, secondsToString } from "../utils";
import { useGlobal } from "../GlobalContext";
import "./style.scss";

export default function VideoViewer() {
  const {
    file: { path, _id },
    next,
  } = useGlobal();
  const panzoomHandle = useRef<PanZoom>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const timeBarRef = useRef<HTMLInputElement | null>(null);
  const volumeBarRef = useRef<HTMLInputElement | null>(null);
  const playRef = useRef<HTMLInputElement | null>(null);
  const currentTimeRef = useRef<HTMLSpanElement | null>(null);
  const isRightHold = useRef(false);
  useEffect(() => {
    panzoomHandle.current?.dispose();
    const video = videoRef.current!;
    panzoomHandle.current = panZoom(video, {
      smoothScroll: false,
      // disable zoom
      zoomSpeed: 0,
      zoomDoubleClickSpeed: 1,
      // double click to fullscreen
      onDoubleClick: () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else video.closest(".video-player")!.requestFullscreen();
      },
    });
    const panzoom = panzoomHandle.current;
    // use translate property instead of transform property
    // because translate property works very well on video
    panzoom.on("transform", (e: PanZoom) => {
      const { x, y } = e.getTransform();
      video.style.transform = "";
      video.style.translate = x + "px " + y + "px";
    });
    // video.onmouseup has toggle video play state
    // which if pan, we don't want to toggle play state
    // so we store play state on panstart and use it on panend
    let isVideoPaused = false;
    panzoom.on("panstart", () => {
      isVideoPaused = video.paused;
    });
    panzoom.on("panend", () => {
      isVideoPaused ? video.pause() : video.play();
    });
  }, [_id]);
  const src = fileUrl(path);
  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        onWheel={({ deltaY }) => {
          const video = videoRef.current!;
          // scale
          if (isRightHold.current)
            video.style.scale = (
              parseFloat(video.style.scale || "1") + (deltaY < 0 ? 0.02 : -0.02)
            ).toString();
          // skip
          else video.currentTime += deltaY < 0 ? 5 : -5;
        }}
        onClick={(e) => {
          e.preventDefault();
          return false;
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          if (e.button === 2) isRightHold.current = true;
          return false;
        }}
        onMouseUp={({ button }) => {
          isRightHold.current = false;
          if (button === 0) {
            const video = videoRef.current!;
            video.paused ? video.play() : video.pause();
          } else if (button === 1) next(1);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        onPause={() => {
          playRef.current!.style.display = "";
        }}
        onPlay={() => {
          playRef.current!.style.display = "none";
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
        onDurationChange={({ currentTarget: video }) =>
          timeBarRef.current
            ? (timeBarRef.current.max = video.duration.toString())
            : null
        }
        onLoadedData={({ currentTarget: video }) =>
          volumeBarRef.current
            ? (volumeBarRef.current.value = video.volume.toString())
            : null
        }
      />
      <div ref={playRef} className="vp-play">
        ▶
      </div>
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