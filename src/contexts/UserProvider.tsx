import { useEffect, useMemo, useState, type ReactNode } from "react";
import { UserContext } from "./UserContext";
import type { User } from "../types";
import axios from "../config/axios";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("users/profile");
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: !!user,
      isLoading,
    }),
    [user, isLoading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
