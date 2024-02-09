import { useGlobal } from "../GlobalContext";

export default function PrevNext() {
  const { next } = useGlobal();
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
