export interface PanZoomOption {
  zoomSpeed?: number;
}

export default class PanZoom {
  constructor(public el: HTMLElement, public option: PanZoomOption = {}) {
    const { zoomSpeed = 0.05 } = option;
    let pan = false;
    let mouseX = 0,
      mouseY = 0;
    // pan
    this.mouseDown = (e) => {
      if (e.button === 0) {
        pan = true;
        const [x, y] = (el.style.translate || "0 0")
          .split(" ")
          .map((o) => parseFloat(o));
        mouseX = e.clientX - x;
        mouseY = e.clientY - y;
      }
    };
    this.mouseMove = (e) => {
      if (pan) {
        e.preventDefault();
        el.style.translate = `${e.clientX - mouseX}px ${e.clientY - mouseY}px`;
      }
    };
    this.mouseUp = () => (pan = false);
    el.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
    // zoom
    this.wheel = (e) => {
      const isUp = e.deltaY < 0;
      el.style.scale =
        parseFloat(el.style.scale || "1") + (isUp ? zoomSpeed : -zoomSpeed) + "";
    };
    if (zoomSpeed > 0)
      el.addEventListener("wheel", this.wheel);
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