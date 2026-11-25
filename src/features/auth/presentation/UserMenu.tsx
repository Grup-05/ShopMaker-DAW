import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../application/useAuth';
import './UserMenu.css';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';

  return `${first}${last}`.toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (!user) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((open) => !open);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
      setIsOpen(false);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="user-menu" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        className="user-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`Menú de ${user.name}`}
        onClick={handleToggle}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {getInitials(user.name)}
        </span>
        <span className="user-menu__name">{user.name}</span>
      </button>

      {isOpen && (
        <div className="user-menu__panel">
          <p className="user-menu__identity">
            <span className="user-menu__email">{user.email}</span>
          </p>
          <div
            id={menuId}
            className="user-menu__actions"
            role="menu"
            aria-label="Acciones de cuenta"
          >
            <button
              type="button"
              className="user-menu__logout"
              role="menuitem"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
