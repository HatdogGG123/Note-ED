import { useFetchTasks } from "@/hooks/UseFetchTasks";
import { createContext, useContext, useEffect, useState } from "react";
import { SessionContext } from "@/context/SessionContext";
import { supabase } from "@/lib/supabaseClient";

export const TaskListContext = createContext();

export const TaskListContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState(null);
  const [isFetchingTask, setIsFetchingTask] = useState(false);

  const { session } = useContext(SessionContext);

  const getTasks = async () => {
    setIsFetchingTask(true);
    const { data, error } = await supabase.from("tasks").select("*");
    setIsFetchingTask(false);

    setTasks(data);
    console.log(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <TaskListContext.Provider value={{ tasks, isFetchingTask, setTasks, getTasks }}>
      {children}
    </TaskListContext.Provider>
  );
};
