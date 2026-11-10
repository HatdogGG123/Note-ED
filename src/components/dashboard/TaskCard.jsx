import React, { useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TaskListContext } from "@/context/TaskListContext";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { EllipsisVertical, Trash, Pencil } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { toast, Toaster } from "@/components/ui/toast";

const TaskCard = ({ title, content, created_at, id }) => {
  const [formattedDate, setFormattedDate] = useState("");
  const { getTasks } = useContext(TaskListContext);

  useEffect(() => {
    const date = new Date(created_at);

    setFormattedDate(date.toDateString());
  }, []);

  const deleteTask = async (taskIdToDelete) => {
    const response = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskIdToDelete);

    getTasks();

    toast.add({
      title: "Task Deleted",
    });
  };

  return (
    <Card>
      <Toaster />
      <CardHeader className={"flex items-center justify-between"}>
        <section>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </section>
      </CardHeader>
      <CardContent>
        <CardDescription className={"wrap-break-word"}>
          <p>{content}</p>
        </CardDescription>
      </CardContent>
      <CardFooter className={"justify-end"}>
        <Button onClick={() => deleteTask(id)} variant="ghost">
          <Trash />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
