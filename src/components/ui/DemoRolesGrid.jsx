import React from "react";
import { SEED_USERS } from "../../data/seedData";

/**
 * DemoRolesGrid Component
 * Displays a grid of demo user buttons for quick login.
 * Props:
 *   onLogin: function(email) - invoked when a demo button is clicked.
 */
export function DemoRolesGrid({ onLogin }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-xs">
      {SEED_USERS.map((user) => (
        <button
          type="button"
          key={user.email}
          onClick={() => onLogin(user.email)}
          title={`${user.fullName} (${user.email}) - ${user.role}`}
          className="py-1 px-2 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 hover:border-brand-500 hover:shadow-md cursor-pointer text-left transition-smooth"
        >
          <div className="font-semibold">{user.role}</div>
          <div className="text-xs">{user.fullName || 'Sin nombre'}</div>
        </button>
      ))}
    </div>
  );
}
export default DemoRolesGrid;
