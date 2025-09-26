import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
// FIX: Import hooks for API key management and translation.
import { useApiKey } from '../hooks/useApiKey';
import { useTranslation } from '../hooks/useTranslation';
import { UserIcon } from './icons';

const UserMenu: React.FC = () => {
  const { user, login, logout } = useAuth();
  // FIX: Get the clearApiKey function from the hook.
  const { clearApiKey } = useApiKey();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
        login({ name: 'Alex Doe', email: 'alex.doe@example.com' });
    }
  }, [login, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-200 transition-colors"
      >
        <span className="font-semibold text-sm text-slate-700 hidden sm:block">{user.name}</span>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-slate-600" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-10">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-slate-200">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
             {/* FIX: Add button to clear the API key. */}
             <button
              onClick={() => {
                clearApiKey();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {t('change_api_key')}
            </button>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
