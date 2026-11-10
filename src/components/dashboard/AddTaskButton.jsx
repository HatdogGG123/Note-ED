import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "@/context/SessionContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "../ui/field";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useFetchTasks } from "@/hooks/UseFetchTasks";
import { TaskListContext } from "@/context/TaskListContext";
import { toast, Toaster } from "@/components/ui/toast";

const AddTaskButton = () => {
  const { session } = useContext(SessionContext);
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    priorityLevel: 1,
  });

  const { tasks, getTasks, isFetchingTask } = useContext(TaskListContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Called");

    const response = await supabase.from("tasks").insert({
      user_id: session?.user.id,
      title: task.title,
      content: task.description,
      priority_level: task.priorityLevel,
    });

    if (!response.error) {
      await getTasks();

      toast.add({
        title: `Task created`,
        description: "",
      });

      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />
      <DialogTrigger
        render={
          <Button>
            <p>Add Task</p>
            <Plus strokeWidth={1} />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className={"text-lg"}>Add new task</DialogTitle>
        </DialogHeader>

        <form action="" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldContent>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </FieldContent>
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </Field>

            <Field>
              <Label>Priority Level</Label>
              <section className="flex gap-1 w-full">
                <Button
                  variant={`${task.priorityLevel === 3 ? "default" : "outline"}`}
                  className={`grow`}
                  onClick={() =>
                    setTask((prev) => ({ ...prev, priorityLevel: 3 }))
                  }
                >
                  High
                </Button>
                <Button
                  variant={`${task.priorityLevel === 2 ? "default" : "outline"}`}
                  className={`grow`}
                  onClick={() =>
                    setTask((prev) => ({ ...prev, priorityLevel: 2 }))
                  }
                >
                  Mid
                </Button>
                <Button
                  variant={`${task.priorityLevel === 1 ? "default" : "outline"}`}
                  className={`grow`}
                  onClick={() =>
                    setTask((prev) => ({ ...prev, priorityLevel: 1 }))
                  }
                >
                  Low
                </Button>
              </section>
            </Field>

            <section className="w-full">
              <Button type="submit" className={"w-full"}>
                Save Task
              </Button>
            </section>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskButton;
