import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useEffect, useState } from "react";

const BACKEND_UPLOAD_URL = "http://localhost:3000";

const Landing = () => {
  const [id, setId] = useState<string>("");
  const [initiated, setInitiated] = useState<boolean>(false);
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepName, setStepName] = useState<string>("Deploy");
  const [prevIds, setPrevIds] = useState<string[]>([]);
  // const [name, setName] = useState<string>("");

  useEffect(() => {
    if (currentStep === 3) {
      console.log("Project deployed");
      console.log("id: ", id);
    }
  }, [currentStep]);

  useEffect(() => {
    switch (currentStep) {
      case 0:
        setStepName("Deploy");
        break;
      case 1:
        setStepName("Uploading");
        break;
      case 2:
        setStepName("Building");
        break;
      case 3:
        setStepName("Done");
        break;
      default:
        setStepName("Deploy");
        break;
    }
  }, [currentStep]);

  const initiateDeployment = async () => {
    try {
      const reqBody = {
        repoUrl: repoUrl,
      };
      console.log(reqBody);
      await axios({
        method: "post",
        url: `${BACKEND_UPLOAD_URL}/upload`,
        data: reqBody,
      }).then((res) => {
        console.log("Response:", res.data);
        setId(res.data.id);
        setCurrentStep(2); // set step to building
      });
    } catch (error) {
      setInitiated(false);
      setCurrentStep(0);
      console.error("Error:", error);
    }
  };

  const initiateStatusQuery = async () => {
    await axios({
      method: "get",
      url: `${BACKEND_UPLOAD_URL}/status?id=${id}`,
    }).then((res) => {
      console.log("Response:", res.data);
      if (res.data.status === "deployed") {
        setCurrentStep(3); // set step to done
        setInitiated(false);
      } else {
        setTimeout(initiateStatusQuery, 1000);
      }
    });
  };
  useEffect(() => {
    initiateStatusQuery();
  }, [id]);

  const fetchPrevIds = async () => {
    await axios({
      method: "get",
      url: `${BACKEND_UPLOAD_URL}/ids`,
    }).then((res) => {
      console.log("Response:", res.data);
      setPrevIds(res.data.folders);
    });
  };
  useEffect(() => {
    fetchPrevIds();
  }, [id]);

  return (
    <main className="flex flex-col items-center  justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Github repo url</Label>
                <Input
                  id="name"
                  placeholder="https://github.com/usrer/repo.git"
                  onChange={(e) => {
                    if (e.target.value !== "") setRepoUrl(e.target.value);
                  }}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  disabled={initiated}
                />
              </div>
              {/* <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </form>
        </CardContent>
        {initiated ? (
          <CardFooter className="flex justify-end">
            <Button type="button" className="flex-grow" disabled>
              <Loader2 size={20} className=" animate-spin" />
              {stepName}
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="flex justify-between">
            <Button>Cancel</Button>
            <Button
              onClick={() => {
                setInitiated(true);
                setCurrentStep(1);
                initiateDeployment();
              }}
            >
              Deploy
            </Button>
          </CardFooter>
        )}
      </Card>
      {prevIds?.map((id) => (
        <Card id={id} className="w-[500px] mt-4">
          <CardHeader>
            <CardTitle>Project deployed</CardTitle>
            <CardDescription>
              Your project has been deployed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                Project ID: <span className="text-muted">{id}</span>
              </Label>
              <Label htmlFor="name">
                Project utl:{" "}
                <span className="text-muted">http://{id}.localhost:3001</span>
              </Label>
              {/* <Input
                id="name"
                value={id}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                disabled
              /> */}
            </div>
          </CardContent>
          <CardFooter className="flex">
            <Button
              className="flex-grow"
              onClick={() => {
                window.open(`http://${id}.localhost:3001`, "_blank");
              }}
            >
              View deployment
            </Button>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
};

export default Landing;
