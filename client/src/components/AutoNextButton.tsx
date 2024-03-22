import { useState } from "react";

export default function AutoNextButton() {
  const [isAutoNext, setIsAutoNext] = useState(localStorage.getItem("auto-next") === "1");
  return (
    <button
      style={{
        textDecoration: isAutoNext ? "" : "line-through",
      }}
      onClick={() => {
        localStorage.setItem("auto-next", isAutoNext ? "" : "1");
        setIsAutoNext(!isAutoNext);
      }}
    >
      auto next
    </button>
  );
}
