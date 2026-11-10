import React, { useContext } from "react";
import DateFilterButtonGroup from "./DateFilterButtonGroup";
import Profile from "./Profile";
import { UserContext } from "@/context/UserContext";
import { SessionContext } from "@/context/SessionContext";

const Header = () => {
  const { user } = useContext(UserContext);

  const fullname = user?.fullname?.split(" ")[0];

  return (
    <section className="w-full flex justify-between items-center">
      <section>
        <p className="text-2xl">Welcome, {fullname}!</p>
      </section>
      <Profile />
    </section>
  );
};

export default Header;
