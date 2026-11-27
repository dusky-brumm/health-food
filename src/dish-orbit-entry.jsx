import * as React from "react";
import { createRoot } from "react-dom/client";
import DishOrbitCarousel from "./vendor/dish-orbit/DishOrbitCarousel.jsx";
import { dishes, backdrop } from "./vendor/dish-orbit/dishes.js";
import "./dish-orbit-integration.css";

function OrbitSection({ host, onPrograms, onWeeklyMenu }) {
  const [compact, setCompact] = React.useState(
    () => window.matchMedia("(max-width: 959px)").matches,
  );
  const [reducedMotion, setReducedMotion] = React.useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  React.useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 959px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateCompact = () => setCompact(compactQuery.matches);
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    compactQuery.addEventListener("change", updateCompact);
    motionQuery.addEventListener("change", updateMotion);
    host.setAttribute("aria-busy", "false");
    host.dataset.ready = "true";
    return () => {
      compactQuery.removeEventListener("change", updateCompact);
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, [host]);

  return (
    <div className={compact || reducedMotion ? "orbit-static" : "orbit-scroll"}>
      <DishOrbitCarousel
        dishes={dishes}
        backdrop={backdrop}
        loop={false}
        scrollDriven={!compact && !reducedMotion}
        height={compact ? "auto" : "var(--orbit-height)"}
        onPlay={onWeeklyMenu}
        onOrder={onPrograms}
        onSearch={onWeeklyMenu}
        onMenu={onPrograms}
      />
    </div>
  );
}

export function mountDishOrbit(host, callbacks) {
  const root = createRoot(host);
  root.render(<OrbitSection host={host} {...callbacks} />);
  return () => root.unmount();
}
