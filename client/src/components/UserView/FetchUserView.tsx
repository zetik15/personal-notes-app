import { useQuery } from "@tanstack/react-query"
import { fetchMe } from "../../api/User"
import { queryClient } from "../../api/QueryClient"
import { Loader } from "../Loader"
import { UserView } from "./UserView"


export const FetchUserView = () => {
    
    const userViewQuery = useQuery({
        queryFn: () => fetchMe(),
        queryKey: ['users', 'me']
    }, queryClient)

    switch(userViewQuery.status) {
        case 'pending':
            return <Loader />
        case 'success':
            return <UserView user={userViewQuery.data} />
        case 'error':
            return <div>
                    <span>Не удалось загрузить данные пользователя</span>
                    <button onClick={() => userViewQuery.refetch()}>Повторить попытку</button>
                </div>
        default:
            return null;
    }
}