import { Account } from "./Account/Account";
import { fetchMe } from "./api/User";
import "./App.css";
import { UserView } from "./components/UserView";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  email: string;
}

function App() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['users', 'me'],
    queryFn: fetchMe,
    retry: false,
    refetchOnWindowFocus: false
  });

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
