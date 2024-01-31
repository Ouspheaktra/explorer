import { useImage } from "./hooks";

export default function ImageInfo() {
  const {
    dir: { files },
    file: {
      details: { avatars = [] },
    },
    updateImage,
  } = useImage();
  const allAvatars = [
    ...new Set(files.map((file) => file.details.avatars || []).flat()),
  ];
  return (
    <div id="info">
      <div className="avatar-wrapper">
        {avatars.map((avatar) => (
          <span key={avatar} className="avatar">
            <button
              className="x"
              onClick={() =>
                updateImage({
                  avatars: avatars.filter((a) => a !== avatar),
                })
              }
            >
              &times;
            </button>
            {avatar}
          </span>
        ))}
        <input
          className="avatar-input"
          placeholder="avatar"
          list="image-info-avatar"
          onKeyUp={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              updateImage({
                avatars: [...avatars, e.currentTarget.value.trim()].sort(),
              });
              e.currentTarget.value = "";
            }
          }}
        />
        <datalist id="image-info-avatar">
          {allAvatars.map((avatar) => (
            <option key={avatar}>{avatar}</option>
          ))}
        </datalist>
      </div>
    </div>
  );
}
