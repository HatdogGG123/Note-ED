import React from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";

const DateFilterButtonGroup = () => {
  return (
    <section className="flex flex-col gap-2 w-fit">
      <p>Priority Level</p>
      <section className="flex gap-3">
        <Button variant="default" className={"px-8"}>
          All
        </Button>
        <Button variant="ghost" className={"px-8"}>
          High
        </Button>
        <Button variant="ghost" className={"px-8"}>
          Medium
        </Button>
        <Button variant="ghost" className={"px-8"}>
          Low
        </Button>
      </section>
    </section>
  );
};

export default DateFilterButtonGroup;
