import { Dumbbell, LogIn, LogOut, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export function TopMenu() {
  return (
    <header className="top-menu">
      <NavLink className="top-menu-brand" to="/profile" aria-label="Gym Reviews profile">
        <span className="brand-mark menu-mark" aria-hidden="true">
          <Dumbbell size={20} strokeWidth={2.4} />
        </span>
        <span>Gym Reviews</span>
      </NavLink>

      <nav className="top-menu-nav" aria-label="Primary navigation">
        <NavLink className="menu-link" to="/login">
          <LogIn size={18} strokeWidth={2.2} />
          <span>Login</span>
        </NavLink>

        <NavLink className="menu-link" to="/profile">
          <UserRound size={18} strokeWidth={2.2} />
          <span>Profile</span>
        </NavLink>

        <a className="menu-icon-link tooltip-link" href={`${apiBaseUrl}/logout`} aria-label="Log out">
          <LogOut size={19} strokeWidth={2.2} />
          <span className="tooltip" role="tooltip">
            Logout
          </span>
        </a>
      </nav>
    </header>
  );
}
