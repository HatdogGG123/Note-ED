import React, { useContext } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UserContext } from "@/context/UserContext";
import { SessionContext } from "@/context/SessionContext";
import LogoutButton from "./LogoutButton";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";

const Profile = () => {
  const { user } = useContext(UserContext);
  const { session } = useContext(SessionContext);

  console.log(user);

  const email = session?.user.email;
  const nameInitial = user?.fullname?.charAt(0)?.toUpperCase() ?? "";

  return (
    <section>
      <Popover>
        <PopoverTrigger>
          <Avatar className={"size-12"}>
            <AvatarFallback className={"bg-primary"}>
              {/* <p className="text-primary-foreground text-lg">{nameInitial}</p> */}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>

        <PopoverContent align="end" className={"bg-card text-card-foreground"}>
          <p>{email}</p>
          <LogoutButton />
        </PopoverContent>
      </Popover>
    </section>
  );
};

export default Profile;
