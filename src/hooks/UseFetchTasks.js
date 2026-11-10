import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export const useFetchTasks = () => {
  const [taskList, setTaskList] = useState(null);
  const [isFetchingTask, setIsFetchingTask] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setIsFetchingTask(true);
      const { data, error } = await supabase.from("tasks").select("*");
      setIsFetchingTask(false);

      setTaskList(data);
    };

    fetchTask();
    return;
  }, []);

  return { taskList, isFetchingTask };
};
