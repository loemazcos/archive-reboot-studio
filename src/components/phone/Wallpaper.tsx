type Props = { dim: boolean; mode: "home" | "lock" };

export default function Wallpaper({ dim, mode }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      <img
        src={mode === "lock" ? "/lock-wallpaper.jpg" : "/home-wallpaper.jpg"}
        alt=""
        draggable={false}
        className="h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          backgroundColor: mode === "lock" || dim ? "rgba(0, 0, 0, 0.34)" : "rgba(0, 0, 0, 0.08)",
        }}
      />
    </div>
  );
}
