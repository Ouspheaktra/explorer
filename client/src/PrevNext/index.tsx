import { RefObject } from "react";
import { ListMethod } from "../List/types";

export default function PrevNext({
  listRef,
}: {
  listRef: RefObject<ListMethod>;
}) {
  if (listRef.current)
    return (
      <>
        <button className="prev" onClick={() => listRef.current?.next(-1)}>
          &lt;
        </button>
        <button className="next" onClick={() => listRef.current?.next(1)}>
          &gt;
        </button>
      </>
    );
  else null;
}
