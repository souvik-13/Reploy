import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_UPLOAD_URL } from "@/utils/constants.ts";
import { SkeletonCard } from "@/components/SceletonCard";
import DeployedCard from "@/components/DeployedCard";
import { Separator } from "@/components/ui/separator";

const Deployments = () => {
  const [prevIds, setPrevIds] = useState<string[]>([]);
  const [err, setErr] = useState<boolean>(false);
  const noOfElements: number =
    Number(localStorage.getItem("cardsLength")) || 10;
  const tempArray = new Array<number>(noOfElements).fill(0);

  const fetchIds = async () => {
    // if (localStorage.getItem("cards") !== null) {
    //   setPrevIds(localStorage.getItem("cards")!.split(","));
    // } else {
    await axios({
      method: "get",
      url: `${BACKEND_UPLOAD_URL}/ids`,
    })
      .then((res) => {
        setErr(false);
        console.log("Response:", res.data);
        setPrevIds(res.data.ids);
      })
      .catch(() => {
        setErr(true);
      });
    // }
  };

  useEffect(() => {
    fetchIds();
    localStorage.setItem("cards", `${prevIds}`);
    localStorage.setItem("cardsLength", `${prevIds.length}`);
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    await axios({
      method: "delete",
      url: `${BACKEND_UPLOAD_URL}/delete?id=${id}`,
    })
      .then((res) => {
        console.log("Response:", res.data);
        setPrevIds((prevIds) => prevIds.filter((prevId) => prevId !== id));
      })
      .catch(() => {
        console.log("Some error occured from our side");
      });
  };

  return (
    <main className="absolute left-0 right-0 mt-16 w-full place-content-center flex items-center justify-center">
      {err ? (
        <div className="relative container flex flex-1 justify-center items-center p-5 m-5">
          <span className="text-3xl font-bold">500</span>
          <Separator
            orientation="vertical"
            decorative={true}
            className="mx-4"
          />
          <p>Some error occured from our side</p>
        </div>
      ) : (
        <div className="p-5 w-full h-full">
          {prevIds.length <= 0 ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
              {tempArray.map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
              {prevIds.map((id) => (
                <DeployedCard
                  key={id}
                  id={id}
                  className=""
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Deployments;
