import relateImg from "../assets/relate.png";
import logoBadge from "../assets/logo-badge.png";

export function HeroArt() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <img
        src={relateImg}
        alt="NJ Shuttle Services vehicle"
        className="h-full w-full object-cover"
        width={1600}
        height={1200}
      />
      {/* Logo decal, styled like a badge mounted on the vehicle */}
      <img
        src={logoBadge}
        alt="NJ Shuttle Services badge"
        className="absolute bottom-4 right-4 h-16 w-16 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.45)] ring-2 ring-white/90 sm:h-20 sm:w-20"
      />
    </div>
  );
}