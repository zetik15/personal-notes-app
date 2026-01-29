import { Account } from "./Account/Account";
import { fetchMe } from "./api/User";
import "./App.css";
import { UserView } from "./components/UserView";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
}

function App() {
  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['users', 'me'],
    queryFn: fetchMe,
    retry: false,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (isError && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [isError]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="app">
      <div className="container">
        {user && <UserView user={user} />}
        <Account />
      </div>
    </div>
  );
}

export default App;
