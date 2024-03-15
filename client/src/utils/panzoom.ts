export interface PanZoomOption {
  zoomSpeed?: number;
  panButtons?: number[];
  doZoom?: (e: WheelEvent) => boolean;
  onEnd?: (translateX: number, translateY: number, scale: number) => void;
}

export default class PanZoom {
  private mouseDown: (e: MouseEvent) => void;
  private mouseMove: (e: MouseEvent) => void;
  private mouseUp: (e: MouseEvent) => void;
  private wheel: (e: WheelEvent) => void;

  constructor(public el: HTMLElement, public option: PanZoomOption = {}) {
    const { zoomSpeed = 0.05, panButtons = [0], doZoom = truthy } = option;
    let pan = false;
    let mouseX = 0,
      mouseY = 0;
    // pan
    this.mouseDown = (e) => {
      if (panButtons.includes(e.button)) {
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
        this.set(e.clientX - mouseX, e.clientY - mouseY, this.scale);
      }
    };
    this.mouseUp = () => {
      pan = false;
      this.onEnd();
    };
    el.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
    // zoom
    this.wheel = (e) => {
      if (!doZoom(e)) return;
      const isUp = e.deltaY < 0;
      this.set(
        this.translateX,
        this.translateY,
        parseFloat(el.style.scale || "1") + (isUp ? zoomSpeed : -zoomSpeed)
      );
      this.onEnd();
    };
    if (zoomSpeed > 0) el.addEventListener("wheel", this.wheel);
  }

  private translateX = 0;
  private translateY = 0;
  private scale = 1;

  onEnd = () => {
    this.option.onEnd?.(this.translateX, this.translateY, this.scale);
  }

  set = (translateX: number, translateY: number, scale: number) => {
    this.translateX = translateX;
    this.translateY = translateY;
    this.scale = scale;
    this.el.style.translate = `${translateX}px ${translateY}px`;
    this.el.style.scale = "" + scale;
    return this;
  };

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
