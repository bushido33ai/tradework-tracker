import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Global handler to route Supabase auth hashes (e.g. type=recovery) to the right page.
 * This fixes cases where Supabase redirects to the Site URL root (/) instead of the intended path.
 */
const AuthHashRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only act on hash-based redirects from Supabase
    if (!location.hash) return;

    const params = new URLSearchParams(location.hash.slice(1));
    const type = params.get("type");

    // Password recovery: send user to Update Password page
    if (type === "recovery") {
      // Preserve the hash so supabase-js can parse tokens if needed
      navigate("/update-password" + location.hash, { replace: true });
    }
  }, [location.hash, navigate]);

  return null;
};

export default AuthHashRouter;
