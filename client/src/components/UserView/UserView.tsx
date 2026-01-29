import { FC, useState } from "react";
import "./UserView.css";
import { logoutUser } from "../../api/User";
import { queryClient } from "../../api/QueryClient";

interface UserViewProps {
  user: {
    id: string,
    username: string,
    email: string,
  }
}

export const UserView: FC<UserViewProps> = ({ user }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setError(null);
    try {
      await logoutUser();
      queryClient.clear();
      window.location.href = '/login';
    } catch (error) {
      const errorMessage = error instanceof Error
      ? error.message
      : 'Не удалось выйти из системы. Попробуйте снова';
      setError(errorMessage);
      console.error('Ошибка при выходе', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="user-view">
      <div className="user-view__logo">
        {user.username.slice(0, 1).toUpperCase()}
      </div>
      <span className="user-view__email">{user.email}</span>
      <span className="user-view__name">{user.username}</span>
      <button 
        className="user-view__logout" 
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? 'Выход...' : 'Выйти'}
      </button>
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};
