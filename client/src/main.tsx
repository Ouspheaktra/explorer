import ReactDOM from "react-dom/client";
import App from "./App.tsx";

if (location.hostname !== "localhost") {
  // https://github.com/vitejs/vite/issues/2076
  const showErrorOverlay = (err: Error) => {
    const ErrorOverlay = customElements.get("vite-error-overlay");
    if (!ErrorOverlay) return;
    document.body.appendChild(new ErrorOverlay(err));
  };
  window.addEventListener("error", ({ error }) => showErrorOverlay(error));
  window.addEventListener("unhandledrejection", ({ reason }) =>
    showErrorOverlay(reason)
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
