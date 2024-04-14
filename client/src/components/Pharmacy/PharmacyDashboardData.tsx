import React from "react";
import { PharmacyDashboardType } from "../../service/pharmacySideFunctions";
import { Card } from "flowbite-react";
import CustomMedicineImg from "./CustomMedicineImg";
import { formatDate } from "../../service/appointmentSideFunctions";
import { Link } from "react-router-dom";
import Header from "../UI/Header";
import NoDataAvailable from "../UI/NoDataAvailable";

type Props = {
  data: PharmacyDashboardType | undefined;
};

const PharmacyDashboardData: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="flex h-fit w-full flex-wrap gap-3 lg:!w-fit lg:!flex-grow lg:!gap-6 xl:!h-full xl:!gap-12">
        <Card
          className="my-auto flex-grow lg:!max-w-sm xl:h-5/6 xl:!max-w-md xxl:!max-w-2xl"
          href={`/profile/ph/${data?.pharmacy?._id}`}
        >
          {data ? (
            <div className="flex flex-col gap-5 xl:!gap-7 xxl:!gap-9">
              <Header size={2} text={data?.pharmacy?.name} />
              <hr />
              <div className="flex justify-between text-sm xxl:!text-lg">
                Address:
                <p className="text-gray-400">{data?.pharmacy?.address}</p>
              </div>
              <div className="flex justify-between text-sm xxl:!text-lg">
                Phone number:
                <p className="text-gray-400">+{data?.pharmacy?.phone_number}</p>
              </div>
              <div>
                <p className="text-sm xxl:!text-lg">Working hours:</p>
                <p className="text-md mt-2 text-center text-gray-400 xl:!text-lg xxl:!text-2xl">
                  {data?.pharmacy?.working_hours}
                </p>
              </div>
            </div>
          ) : (
            <NoDataAvailable />
          )}
        </Card>
        <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3 lg:!mx-auto xxl:!gap-6">
          <div className="flex w-44 flex-col justify-around gap-3 xxl:!w-80 xxl:!gap-6">
            <Card className="max-w-xs xxl:!max-w-sm">
              <p className="text-center text-sm xxl:!text-lg">
                Num. of medicine
              </p>
              <h1 className="mx-auto my-auto text-2xl text-green-500 xxl:!text-4xl">
                {data?.total?.total_number ?? 0}
              </h1>
            </Card>
            <Card className="max-w-xs xxl:!max-w-sm">
              <p className="text-center text-sm xxl:!text-lg">
                Total available
              </p>
              <h1 className="mx-auto my-auto text-2xl text-green-500 xxl:!text-4xl">
                {data?.total?.total_available ?? 0}
              </h1>
            </Card>
          </div>
          <div className="flex w-44 flex-col justify-around gap-3 xxl:!w-80 xxl:!gap-6">
            <Card className="max-w-xs xxl:!max-w-sm">
              <p className="text-center text-sm xxl:!text-lg">Total price</p>
              <h1 className="mx-auto my-auto text-2xl text-green-500 xxl:!text-4xl">
                {data?.total?.total_price ?? 0}{" "}
                <span className="text-sm">BAM</span>
              </h1>
            </Card>
            <Card className="max-w-xs">
              <p className="text-center text-sm xxl:!max-w-sm xxl:!text-lg">
                Not available
              </p>
              <h1 className="mx-auto my-auto text-2xl text-red-600 xxl:!text-4xl">
                {data?.total?.total_not_available ?? 0}
              </h1>
            </Card>
          </div>
        </div>
      </div>
      <Card className="h-fit w-full lg:!w-fit lg:!flex-grow xl:!w-1/3 xl:!flex-grow-0">
        {data?.recentMedicine && data?.recentMedicine.length > 0 ? (
          <div>
            <p className="xxl:!text-xl">Recent added medicine</p>
            <div className="divide-y">
              {data?.recentMedicine.map((m) => (
                <Link
                  to={`/medicine?id=${m._id}`}
                  key={m._id}
                  className="flex cursor-pointer items-center gap-2 p-2 transition-all duration-100 hover:bg-gray-100"
                >
                  <CustomMedicineImg
                    url={
                      m.photo.startsWith(m.name)
                        ? `http://localhost:3001/uploads/${m.photo}`
                        : m.photo
                    }
                    className="h-auto w-7 rounded-full md:!w-14 xl:!w-16"
                  />
                  <p className="text-xs xxl:!text-lg">
                    {m?.name}({m?.strength + " mg"})
                  </p>
                  <p className="ml-auto text-xs xxl:!text-lg">
                    {formatDate(m?.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-400 xxl:!text-lg">
              There are no recent added medicines
            </p>
          </div>
        )}
      </Card>
    </>
  );
};

export default PharmacyDashboardData;
