import { BRAND } from "../../utils/constants";

export default function Topbar({ user, onLogout }) {
  return (
    <div className="topbar">
      <div>
        <h2>{BRAND}</h2>
      </div>

      <div>
        <span>
          {user?.name} ({user?.role})
        </span>

        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}