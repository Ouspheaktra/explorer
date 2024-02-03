import { HTMLProps, useEffect, useRef } from "react";
import panZoom, { PanZoom } from "panzoom";
import "./style.scss";

export default function VideoPlayer({
  controls,
  _id,
  ...props
}: HTMLProps<HTMLVideoElement> & { _id: number }) {
  const panzoomHandle = useRef<PanZoom>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeBarRef = useRef<HTMLInputElement | null>(null);
  const volumeBarRef = useRef<HTMLInputElement | null>(null);
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
  return (
    <div className="video-player">
      <video
        ref={videoRef}
        {...props}
        onWheel={({ currentTarget: video, deltaY }) => {
          // scale
          if (isRightHold.current)
            video.style.scale = (
              parseFloat(video.style.scale || "1") + (deltaY < 0 ? 0.02 : -0.02)
            ).toString();
          // skip
          else video.currentTime += deltaY < 0 ? 5 : -5;
        }}
        onMouseDown={(e) => {
          if (e.button === 2) isRightHold.current = true;
        }}
        onMouseUp={({ currentTarget: video }) => {
          isRightHold.current = false;
          video.paused ? video.play() : video.pause();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        onTimeUpdate={({ currentTarget: video }) =>
          timeBarRef.current
            ? (timeBarRef.current.value = video.currentTime.toString())
            : null
        }
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
      {controls && (
        <div className="vp-control">
          <div className="vp-side">
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
          </div>
          <input
            ref={timeBarRef}
            className="vp-time-bar"
            type="range"
            min={0}
            onInput={(e) =>
              (videoRef.current!.currentTime = e.currentTarget.valueAsNumber)
            }
          />
          <div className="vp-side">
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
      )}
    </div>
  );
}
