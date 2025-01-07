import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="w-full top-0  bg-blue-300 px-4 py-2 sticky flex justify-between">
      <Link href={"/"}>Cite Smart</Link>
      <div>
        <ul className="flex gap-4">
          <li>
            <Button>
              <Link href={"/login"}>Login</Link>
            </Button>
          </li>
          <li>
            <Button>
              <Link href={"/signup"}>Sign Up</Link>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
