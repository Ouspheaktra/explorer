import { useGlobal } from "../../GlobalContext";

export default function AutoShutdown() {
  const {
    dir: {
      files: [file],
    },
    commandFiles,
  } = useGlobal();
  return (
    <div>
      <label className="label">auto-shutdown</label>
      <button
        onClick={() => {
          commandFiles([file], ":auto-shutdown=1");
        }}
      >
        Set
      </button>
      <button
        onClick={() => {
          commandFiles([file], ":auto-shutdown=0");
        }}
      >
        Cancel
      </button>
    </div>
  );
}
