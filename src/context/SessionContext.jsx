import { supabase } from "@/lib/supabaseClient";
import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext();

export const SessionContextProvider = ({ children, props }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoadng] = useState(false);

  const fetchSession = async () => {
    setIsLoadng(true);

    const { data, error } = await supabase.auth.getSession();

    setIsLoadng(false);

    if (error) {
      console.log(error);
      return;
    }

    setSession(data.session);
  };

  useEffect(() => {
    fetchSession();
  }, []);

  let value = { user: session?.user ?? null, session, setSession };

  return (
    <SessionContext.Provider {...props} value={value}>
      {children}
    </SessionContext.Provider>
  );
};
