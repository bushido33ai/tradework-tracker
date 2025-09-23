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
    // Only act on redirects from Supabase
    const getParams = () => {
      if (location.hash && location.hash.length > 1) {
        return new URLSearchParams(location.hash.slice(1));
      }
      if (location.search && location.search.length > 1) {
        return new URLSearchParams(location.search.slice(1));
      }
      return null;
    };

    const params = getParams();
    if (!params) return;

    const type = params.get("type");

    // Password recovery: send user to Update Password page
    if (type === "recovery") {
      // Preserve tokens so supabase-js can parse them
      const hash = location.hash && location.hash.length > 1
        ? location.hash
        : "#" + params.toString();
      navigate("/update-password" + hash, { replace: true });
    }
  }, [location.hash, location.search, navigate]);

  return null;
};

export default AuthHashRouter;
