import { createContext, useContext, useEffect, useState } from "react";
import { SessionContext } from "./SessionContext";
import { supabase } from "@/lib/supabaseClient";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const { session } = useContext(SessionContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
