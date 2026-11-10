import { useFetchTasks } from "@/hooks/UseFetchTasks";
import React, { useEffect } from "react";
import TaskCard from "./TaskCard";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";

const TaskList = ({ taskList, priorityLevel }) => {
  return (
    <section
      className={`flex flex-col gap-5 ${taskList?.length === 0 ? "hidden" : ""}`}
    >
      <CardHeader className={"flex items-center gap-2"}>
        <p className="font-medium">{priorityLevel}</p>
        <Badge variant="default">{taskList?.length || 0}</Badge>
      </CardHeader>

      <CardContent>
        {taskList?.length === 0 ? (
          <>
            <p className="text-center">No task recorded.</p>
          </>
        ) : (
          taskList?.map((task) => <TaskCard key={task.id} {...task} />)
        )}
      </CardContent>
    </section>
  );
};

export default TaskList;
