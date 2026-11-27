import * as React from "react";
import { createRoot } from "react-dom/client";
import DishOrbitCarousel from "./vendor/dish-orbit/DishOrbitCarousel.jsx";
import { dishes, backdrop } from "./vendor/dish-orbit/dishes.js";
import "./dish-orbit-integration.css";

function OrbitSection({ host, onPrograms, onWeeklyMenu }) {
  const [compact, setCompact] = React.useState(
    () => window.matchMedia("(max-width: 959px)").matches,
  );

  React.useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 959px)");
    const updateCompact = () => setCompact(compactQuery.matches);
    compactQuery.addEventListener("change", updateCompact);
    host.setAttribute("aria-busy", "false");
    host.dataset.ready = "true";
    return () => {
      compactQuery.removeEventListener("change", updateCompact);
    };
  }, [host]);

  return (
    <div className="orbit-static">
      <DishOrbitCarousel
        dishes={dishes}
        backdrop={backdrop}
        loop
        scrollDriven={false}
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
