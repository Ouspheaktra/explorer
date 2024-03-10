import { useEffect } from "react";
import { useGlobal } from "../GlobalContext";

export default function PrevNext() {
  const { next } = useGlobal();
  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      if (e.button > 2) {
        e.preventDefault();
        next(e.button === 3 ? -1 : 1);
      }
    };
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  return (
    <>
      <button className="prev" onClick={() => next(-1)}>
        &lt;
      </button>
      <button className="next" onClick={() => next(1)}>
        &gt;
      </button>
    </>
  );
}
