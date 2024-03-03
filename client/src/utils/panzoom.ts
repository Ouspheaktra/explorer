export interface PanZoomOption {
  zoomSpeed?: number;
  panButton?: number;
  doZoom?: (e: WheelEvent) => boolean;
}

export default class PanZoom {
  constructor(public el: HTMLElement, public option: PanZoomOption = {}) {
    const { zoomSpeed = 0.05, panButton = 0, doZoom = truthy } = option;
    let pan = false;
    let mouseX = 0,
      mouseY = 0;
    // pan
    this.mouseDown = (e) => {
      if (e.button === panButton) {
        pan = true;
        const [x, y=0] = (el.style.translate || "0 0")
          .split(" ")
          .map((o) => parseFloat(o));
        mouseX = e.clientX - x;
        mouseY = e.clientY - y;
      }
    };
    this.mouseMove = (e) => {
      if (pan) {
        el.style.translate = `${e.clientX - mouseX}px ${e.clientY - mouseY}px`;
      }
    };
    this.mouseUp = () => (pan = false);
    el.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
    // zoom
    this.wheel = (e) => {
      if (!doZoom(e)) return;
      const isUp = e.deltaY < 0;
      el.style.scale =
        parseFloat(el.style.scale || "1") +
        (isUp ? zoomSpeed : -zoomSpeed) +
        "";
    };
    if (zoomSpeed > 0) el.addEventListener("wheel", this.wheel);
  }

  private mouseDown: (e: MouseEvent) => void;
  private mouseMove: (e: MouseEvent) => void;
  private mouseUp: (e: MouseEvent) => void;
  private wheel: (e: WheelEvent) => void;

  dispose = () => {
    this.el.removeEventListener("mousedown", this.mouseDown);
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("mouseup", this.mouseUp);
    this.el.removeEventListener("wheel", this.wheel);
  };
}

function truthy() {
  return true;
}
