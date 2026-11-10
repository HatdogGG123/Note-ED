import { supabase } from "@/lib/supabaseClient";
import { useFetchTasks } from "@/hooks/UseFetchTasks";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { SessionContext } from "@/context/SessionContext";
import { UserContext } from "@/context/UserContext";
import Header from "@/components/dashboard/Header";
import TaskList from "../components/dashboard/TaskList";
import { Spinner } from "@/components/ui/spinner";
import AddTaskButton from "./../components/dashboard/AddTaskButton";
import { TaskListContext } from "@/context/TaskListContext";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const Dashboard = () => {
  const [task, setTask] = useState({
    highPriority: [],
    midPriority: [],
    lowPriority: [],
  });
  const { session, isLoading } = useContext(SessionContext);
  const { user, setUser } = useContext(UserContext);
  const { tasks, isFetchingTask } = useContext(TaskListContext);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/", { replace: true });
      return;
    }

    console.log(tasks);

    getUser();
    getTask(tasks);
  }, [tasks, session, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;

  const getUser = async () => {
    setIsFetchingUser(true);

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", session?.user?.id)
      .limit(1);

    setIsFetchingUser(false);

    if (error) {
      console.log(error);

      return;
    }

    setUser({
      fullname: data[0]?.fullname,
      id: data[0]?.id,
    });
  };

  const getTask = (tasks) => {
    setTask((prev) => ({
      ...prev,
      highPriority: tasks?.filter((task) => task.priority_level === 3),
    }));
    setTask((prev) => ({
      ...prev,
      midPriority: tasks?.filter((task) => task.priority_level === 2),
    }));
    setTask((prev) => ({
      ...prev,
      lowPriority: tasks?.filter((task) => task.priority_level === 1),
    }));
  };

  return (
    <>
      {isFetchingUser && isFetchingTask ? (
        <section className="h-dvh w-full flex items-center justify-center">
          <section className="flex items-center gap-2">
            <Spinner />
            <p>Loading...</p>
          </section>
        </section>
      ) : (
        <section className="h-dvh w-full flex flex-col gap-10 p-5 relative">
          <Header />
          <section className="flex flex-col gap-2">
            <section className="flex justify-end items-center">
              <AddTaskButton />
            </section>
            <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {tasks?.length === 0 ? (
                <>
                  <Empty className={"col-span-full"}>
                    <EmptyHeader>
                      <EmptyTitle>No data</EmptyTitle>
                      <EmptyDescription>
                        You haven't started any tasks yet.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </>
              ) : (
                <>
                  <TaskList
                    taskList={task.highPriority}
                    priorityLevel={"High"}
                  />
                  <TaskList taskList={task.midPriority} priorityLevel={"Mid"} />
                  <TaskList taskList={task.lowPriority} priorityLevel={"Low"} />
                </>
              )}
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default Dashboard;
