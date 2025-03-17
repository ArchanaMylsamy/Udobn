import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LastVisitedTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const excludedPaths = ["/login", "/register"];
    if (!excludedPaths.includes(location.pathname)) {
      localStorage.setItem("lastVisited", location.pathname);
    }
  }, [location]);

  return null; // Still no rendering
};

export default LastVisitedTracker;
