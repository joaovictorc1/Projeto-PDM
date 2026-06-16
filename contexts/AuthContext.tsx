import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextData = {
  userName: string | null;
  loading: boolean;
  login: (name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const stored = await AsyncStorage.getItem("userName");

    if (stored) {
      setUserName(stored);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function login(name: string) {
    await AsyncStorage.setItem("userName", name);
    setUserName(name);
  }

  async function logout() {
    await AsyncStorage.removeItem("userName");
    setUserName(null);
  }


  return (
    <AuthContext.Provider
      value={{
        userName,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}