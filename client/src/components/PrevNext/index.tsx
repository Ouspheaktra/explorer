import { useEffect } from "react";
import { useGlobal } from "../../GlobalContext";

export default function PrevNext() {
  const { next } = useGlobal();
  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      if (e.button > 2) {
        e.preventDefault();
        document
          .getElementById((e.button === 3 ? "prev" : "next") + "-btn")!
          .click();
      }
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  return (
    <>
      <button id="prev-btn" className="prev" onClick={() => next(-1)}>
        &lt;
      </button>
      <button id="next-btn" className="next" onClick={() => next(1)}>
        &gt;
      </button>
    </>
  );
}
