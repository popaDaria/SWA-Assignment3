import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";

const ProtectedRoute = () => {
    const token: string = useAppSelector((state: RootState) => state.user.token);
    return (
        token ? <Outlet /> : <Navigate to='/login' />
    )
};
export default ProtectedRoute;