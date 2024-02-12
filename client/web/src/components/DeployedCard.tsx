import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";
import AlertDialog from "@/components/AlertDialog";

const DeployedCard = ({
  id,
  className,
  handleDelete,
}: {
  id: string;
  className: string;
  handleDelete: (id: string) => void;
}) => {
  return (
    <div className={cn(className, "flex flex-col max-w-[500px] min-w-[250px]")}>
      <Card id={id} className="p-4 m-4">
        <CardHeader>
          <CardTitle>Project deployed</CardTitle>
          <CardDescription>
            Your project has been deployed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1.5">
            <div className="w-full flex flex-1 gap-1 justify-between items-center">
              <Label
                htmlFor="name"
                className=" text-center font-bold text-muted-foreground"
              >
                id:{" "}
              </Label>
              <Button
                id="name"
                variant={"outline"}
                className="text-muted-foreground flex-grow ml-4"
                onClick={() => {
                  // colpy to clipboard
                  navigator.clipboard.writeText(id);
                }}
              >
                {id}
              </Button>
            </div>
            <div className="flex flex-1 gap-1 justify-between items-center">
              <Label
                htmlFor="url"
                className=" text-center font-bold text-muted-foreground"
              >
                url:
              </Label>
              <Button
                id="url"
                variant={"outline"}
                className="text-muted-foreground flex-grow ml-4"
                onClick={() => {
                  // colpy to clipboard
                  navigator.clipboard.writeText(`http://${id}.localhost:3001`);
                }}
              >
                http://{id}.localhost:3001
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-1">
          <Button
            className="w-full"
            onClick={() => {
              window.open(`http://${id}.localhost:3001`, "_blank");
            }}
          >
            View deployment
          </Button>
          <AlertDialog
            className="w-full bg-destructive"
            handleDelete={handleDelete}
            id={id}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeployedCard;
