import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { User } from "../types/User";
import {
  login as grpcLogin,
  signUp as grpcSignUp,
  validateToken as grpcValidate,
  refreshToken as grpcRefresh,
} from "../services/AuthenticationClient";
import {
  LoginResponse,
  SignUpResponse,
} from "../services/grpc/user_services/user_api";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  signUp: (
    username: string,
    email: string,
    password: string,
    role: string
  ) => Promise<User | null>;
  logout: () => void;
  checkAuth: () => Promise<User | null>;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      clearCache();
      return null;
    }

    try {
      const response = await grpcValidate(token);
      if (response.valid) {
        const cachedUser = getCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
      } else {
        
        const refreshToken = localStorage.getItem("userRefreshToken");
        if (refreshToken) {
          const refreshResponse = await grpcRefresh(refreshToken);
          if (refreshResponse.success) {
            const cachedUser = getCachedUser();
            if (cachedUser) {
              const newUser = new User(
                cachedUser.id,
                cachedUser.username,
                cachedUser.email,
                refreshResponse.token,
                refreshToken
              );
              cacheUser(newUser);
              setUser(newUser);
            }
          } else {
            clearCache();
          }
        } else {
          clearCache();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      clearCache();
    }
    
    setIsInitialized(true);
    return user;
  }, [user]);

  useEffect(() => {
    if (!isInitialized && !user) {
      checkAuth();
    }
  }, [isInitialized, user, checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await grpcLogin(email, password);
      if (!response.success || !response.user) {
        return null;
      }

      const userModel = User.fromGrpc(response.user);
      if (userModel) {
        cacheUser(userModel);
        setUser(userModel);
        setIsInitialized(true);
      }
      return userModel;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    role: string
  ) => {
    const response: SignUpResponse = await grpcSignUp(
      username,
      email,
      password,
      role
    );
    const grpcUser = response.user;
    const userModel = User.fromGrpc(grpcUser);
    if (userModel) {
      cacheUser(userModel);
      setUser(userModel);
      setIsInitialized(true);
    }
    return userModel;
  };

  const logout = () => {
    clearCache();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, checkAuth, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const cacheUser = (user: User) => {
  localStorage.setItem("userId", user.id);
  localStorage.setItem("userUsername", user.username);
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userToken", user.token);
  localStorage.setItem("userRefreshToken", user.refreshToken);
};

const clearCache = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("userUsername");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userToken");
  localStorage.removeItem("userRefreshToken");
};

const getCachedUser = (): User | null => {
  const id = localStorage.getItem("userId");
  const username = localStorage.getItem("userUsername");
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("userToken");
  const refreshToken = localStorage.getItem("userRefreshToken");

  if (!id || !username || !email || !token || !refreshToken) return null;

  return new User(id, username, email, token, refreshToken);
};
