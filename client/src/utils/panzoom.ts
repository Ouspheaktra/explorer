export interface PanZoomOption {
  zoomSpeed?: number;
  panButton?: number;
  doZoom?: (e: WheelEvent) => boolean;
  onEnd?: (translateX: number, translateY: number, scale: number) => void;
}

export default class PanZoom {
  constructor(public el: HTMLElement, public option: PanZoomOption = {}) {
    const { zoomSpeed = 0.05, panButton = 0, doZoom = truthy, onEnd } = option;
    let pan = false;
    let mouseX = 0,
      mouseY = 0;
    let translateX = 0,
      translateY = 0,
      scale = 1;
    // pan
    this.mouseDown = (e) => {
      if (e.button === panButton) {
        // if panButton is left mouse button
        // mouseMove will drag image/video
        // so prevent that default behavior
        e.preventDefault();
        pan = true;
        const [x, y = 0] = (el.style.translate || "0 0")
          .split(" ")
          .map((o) => parseFloat(o));
        mouseX = e.clientX - x;
        mouseY = e.clientY - y;
      }
    };
    this.mouseMove = (e) => {
      if (pan) {
        translateX = e.clientX - mouseX;
        translateY = e.clientY - mouseY;
        el.style.translate = `${translateX}px ${translateY}px`;
      }
    };
    this.mouseUp = () => {
      pan = false;
      onEnd?.(translateX, translateY, scale);
    };
    el.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
    // zoom
    this.wheel = (e) => {
      if (!doZoom(e)) return;
      const isUp = e.deltaY < 0;
      scale =
        parseFloat(el.style.scale || "1") + (isUp ? zoomSpeed : -zoomSpeed);
      el.style.scale = "" + scale;
      onEnd?.(translateX, translateY, scale);
    };
    if (zoomSpeed > 0) el.addEventListener("wheel", this.wheel);
  }

  private mouseDown: (e: MouseEvent) => void;
  private mouseMove: (e: MouseEvent) => void;
  private mouseUp: (e: MouseEvent) => void;
  private wheel: (e: WheelEvent) => void;

  dispose = () => {
    this.el.style.translate = this.el.style.scale = "";
    this.el.removeEventListener("mousedown", this.mouseDown);
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mouseup", this.mouseUp);
    this.el.removeEventListener("wheel", this.wheel);
  };
}

function truthy() {
  return true;
}
