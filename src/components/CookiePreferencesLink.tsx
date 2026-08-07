"use client";

export function CookiePreferencesLink() {
  return (
    <li>
      <button
        onClick={() => {
          localStorage.removeItem("luwcoco-cookie-consent");
          window.location.reload();
        }}
        className="hover:text-ink"
      >
        Preferencias de cookies
      </button>
    </li>
  );
}
