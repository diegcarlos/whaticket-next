"use client";
import Login from "@/app/login/page";
import useAuth from "@/hooks/useAuth";
import { createContext, useContext } from "react";

interface PropsAuthProvider {
  children: React.ReactNode;
}
interface PropsContextAuth {
  loading: boolean;
  user: {
    name: string;
    id: number;
    email: string;
    profile: string;
    tokenVersion: number;
    whatsappId: number;
    queues: {
      id: number;
      name: string;
      color: string;
      UserQueue: {
        userId: string;
        queueId: string;
        createdAt: string;
        updatedAt: string;
      };
    }[];
    whatsapp: { id: string; name: string };
  };
  isAuth: boolean;
  handleLogin: (data: { email: string; password: string }) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<PropsContextAuth>({} as PropsContextAuth);

function AuthProvider(props: PropsAuthProvider) {
  const { children } = props;
  const { loading, user, isAuth, handleLogin, handleLogout } = useAuth();

  return (
    <AuthContext.Provider
      value={{ loading, user, isAuth, handleLogin, handleLogout }}
    >
      {isAuth ? children : <Login />}
    </AuthContext.Provider>
  );
}

export default function useAccess() {
  return { ...useContext(AuthContext) };
}

export { AuthContext, AuthProvider };
