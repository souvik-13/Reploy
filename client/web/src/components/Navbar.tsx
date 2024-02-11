import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="absolute left-0 top-0 right-0 z-10 h-16 flex flex-row items-center justify-between bg-muted">
      <div className="h-full px-2 flex justify-center items-center">
        <h1 className="text-4xl font-bold">Reploy</h1>
      </div>

      <div className=" flex-grow flex flex-row justify-end items-center gap-4 px-4">
        <Button variant={"default"} onClick={() => navigate("/")}>
          Add new project
        </Button>
        <Button variant={"secondary"} onClick={() => navigate("/deployments")}>
          Deployments
          <span className="px-2">
            <MoveRight />
          </span>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
