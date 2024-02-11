import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_UPLOAD_URL } from "@/utils/constants.ts";
import { SkeletonCard } from "@/components/SceletonCard";
import DeployedCard from "@/components/DeployedCard";

const Deployments = () => {
  const [prevIds, setPrevIds] = useState<string[]>([]);
  const noOfElements: number = Number(localStorage.getItem("cards")) || 10;
  const tempArray = new Array<number>(noOfElements).fill(0);

  const fetchPrevIds = async () => {
    await axios({
      method: "get",
      url: `${BACKEND_UPLOAD_URL}/ids`,
    }).then((res) => {
      console.log("Response:", res.data);
      setPrevIds(res.data.ids);
    });
  };

  useEffect(() => {
    fetchPrevIds();
    localStorage.setItem("cards", `${prevIds.length}`);
  }, []);

  return (
    <main className="absolute left-0 right-0 mt-16 w-full">
      <div className="p-5">
        {prevIds.length <= 0 ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
            {tempArray.map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
            {prevIds.map((id) => (
              <DeployedCard key={id} id={id} className="" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Deployments;
