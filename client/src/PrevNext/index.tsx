import { useEffect } from "react";
import { useGlobal } from "../GlobalContext";

export default function PrevNext() {
  const { next } = useGlobal();
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button > 2) {
        e.preventDefault();
        next(e.button === 3 ? -1 : 1);
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
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
