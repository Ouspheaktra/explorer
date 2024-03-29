import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App, { appLoader } from "./App.tsx";

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

window.addEventListener("fullscreenchange", () => {
  document.body.classList.toggle(
    "fullscreen",
    Boolean(document.fullscreenElement)
  );
});

const router = createBrowserRouter([
  {
    path: "/:directory?/:filename?",
    element: <App />,
    loader: appLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
