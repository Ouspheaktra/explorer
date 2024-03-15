import { useEffect, useRef } from "react";
import PanZoom from "../utils/panzoom";
import { fileUrl, secondsToString } from "../utils";
import { useGlobal } from "../GlobalContext";
import { updateFile } from "./utils";
import "./style.scss";

const colorsProperty = ["contrast", "brightness", "saturate", "hue"];

export default function VideoViewer() {
  const {
    file,
    dir: { files },
    next,
    updateFiles,
  } = useGlobal();
  const { path, _id, details } = file;
  const panzoomHandle = useRef<PanZoom>();
  const isPlayingRef = useRef(true);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const mouseHold = useRef<number | false>(false);
  const scrollWhenMouseHold = useRef(false);
  const getEl = <T extends HTMLElement = HTMLInputElement>(query: string) =>
    mainRef.current!.querySelector(".vp-" + query)! as T;
  const getVideo = () => getEl<HTMLVideoElement>("video");
  const toggleVideoPlayState = (play?: boolean) => {
    const video = getVideo();
    if (play === undefined) video.paused ? video.play() : video.pause();
    else play ? video.play() : video.pause();
    isPlayingRef.current = !video.paused;
  };
  useEffect(() => {
    panzoomHandle.current?.dispose();
    const video = getVideo();
    panzoomHandle.current = new PanZoom(video, {
      panButtons: [2],
      doZoom: () => mouseHold.current === 2,
      onEnd: (translateX, translateY, scale) => {
        updateFile(updateFiles, file, {
          translateX: translateX === 0 ? undefined : translateX,
          translateY: translateY === 0 ? undefined : translateY,
          scale: scale === 1 ? undefined : scale,
        });
      },
    });
    panzoomHandle.current.set(
      details.translateX || 0,
      details.translateY || 0,
      details.scale || 1
    );
  }, [_id]);
  const src = fileUrl(path);
  const vttFile = files.find((f) => f.ext === ".vtt" && f.name === file.name);
  return (
    <div
      ref={mainRef}
      className="video-player"
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        id="video"
        className="vp-video"
        src={src}
        autoPlay
        onWheel={({ deltaY, currentTarget: video }) => {
          if (mouseHold.current !== false) scrollWhenMouseHold.current = true;
          // volume up/down
          if (mouseHold.current === 4) {
            const newVolume = video.volume + (deltaY < 0 ? 0.1 : -0.1);
            video.volume = Math.max(0, Math.min(newVolume, 1));
          }
          // skip
          else if (mouseHold.current !== 2)
            video.currentTime += deltaY < 0 ? 5 : -5;
        }}
        onDoubleClick={(e) => {
          // fullscreen
          if (e.button === 0) {
            if (document.fullscreenElement) document.exitFullscreen();
            else mainRef.current!.requestFullscreen();
          }
        }}
        onMouseDown={(e) => {
          if (e.button > 1) mouseHold.current = e.button;
          // prevent middle mouse click default behavior
          // from scroll down page
          else if (e.button === 1) e.preventDefault();
        }}
        onMouseUp={(e) => {
          if (e.button === 0) toggleVideoPlayState();
          // prevent next/prev button from working
          // when hold next/prev button and scroll
          if (Number(mouseHold.current) > 2 && scrollWhenMouseHold.current)
            e.stopPropagation();
          mouseHold.current = scrollWhenMouseHold.current = false;
        }}
        onPause={() => (mainRef.current!.dataset.isPaused = "paused")}
        onPlay={() => (mainRef.current!.dataset.isPaused = "")}
        onEnded={() => next(1)}
        onTimeUpdate={({ currentTarget: video }) => {
          getEl("timebar").value = video.currentTime.toString();
          getEl("current-time").textContent = [
            secondsToString(video.currentTime),
            secondsToString(video.duration),
          ].join("/");
        }}
        onDurationChange={({ currentTarget: video }) => {
          getEl("timebar").max = video.duration.toString();
          toggleVideoPlayState(isPlayingRef.current);
        }}
        onVolumeChange={({ currentTarget: video }) => {
          getEl("volume").value = video.volume.toString();
          localStorage.setItem("volume", video.volume.toString());
        }}
        onLoadedData={({ currentTarget: video }) => {
          const volume = localStorage.getItem("volume") || "1";
          getEl("volume").value = volume;
          video.volume = parseFloat(volume);
          // color
          const form = getEl("color");
          for (let property of colorsProperty) {
            // @ts-ignore
            const input = form[property] as HTMLInputElement;
            input.value = details[property] || input.getAttribute("value");
          }
          form.dispatchEvent(new Event("input", { bubbles: true }));
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
          getVideo().style.filter = [
            `contrast(${form.contrast.valueAsNumber}%)`,
            `brightness(${form.brightness.valueAsNumber}%)`,
            `saturate(${form.saturate.valueAsNumber}%)`,
            `hue-rotate(${form.hue.valueAsNumber}deg)`,
          ].join(" ");
          updateFile(
            updateFiles,
            file,
            Object.fromEntries(
              colorsProperty.map((name) => [
                name,
                form[name].value === form[name].getAttribute("value")
                  ? undefined
                  : form[name].value,
              ])
            )
          );
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
        <button
          type="button"
          style={{ float: "right" }}
          onClick={() => panzoomHandle.current?.set(0, 0, 1).onEnd()}
        >
          reset panzoom
        </button>
      </form>
      {/* CONTROL */}
      <div className="vp-control">
        <div className="vp-timebar-container">
          <div className="vp-more"></div>
          <input
            className="vp-timebar"
            type="range"
            min={0}
            onInput={(e) =>
              (getVideo().currentTime = e.currentTarget.valueAsNumber)
            }
            onMouseMove={({ currentTarget: range, clientX }) => {
              const boundingRect = range.getBoundingClientRect();
              const mouseX = clientX - boundingRect.left;
              const ratio = mouseX / range.offsetWidth;
              const potentialValue = Math.round(ratio * parseInt(range.max));
              const preview = getEl<HTMLVideoElement>("preview-video");
              preview.currentTime = potentialValue;
              preview.parentElement!.style.left = mouseX + "px";
              preview.previousElementSibling!.textContent =
                secondsToString(potentialValue);
            }}
          />
          <div className="vp-preview">
            <span className="vp-time"></span>
            <video
              className="vp-preview-video"
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
            <span className="vp-current-time"></span>
          </div>
          <div className="vp-buttons-side-container">
            <input
              className="vp-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              onInput={(e) => {
                const video = getVideo();
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
