import React from "react";
import { PharmacyDashboardType } from "../../service/pharmacySideFunctions";
import { Card } from "flowbite-react";
import CustomMedicineImg from "./CustomMedicineImg";
import { formatDate } from "../../service/appointmentSideFunctions";
import { Link } from "react-router-dom";

type Props = {
  data: PharmacyDashboardType;
};

const PDashboard: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="flex w-full lg:!w-fit h-fit xl:!h-full lg:!flex-grow flex-wrap gap-3 lg:!gap-6 xl:!gap-12">
        <Card
          className="xl:!max-w-md lg:!max-w-sm flex-grow xl:h-5/6 my-auto"
          href={`/profile/ph/${data.pharmacy._id}`}
        >
          <div className="flex flex-col gap-5 xl:!gap-7 xxl:!gap-9">
            <h1 className="text-center text-xl lg:!text-2xl font-semibold">
              {data.pharmacy.name}
            </h1>
            <hr />
            <div className="flex justify-between text-sm xxl:!text-lg">
              <p>Address:</p>
              <p className="text-gray-400">{data.pharmacy.address}</p>
            </div>
            <div className="flex justify-between text-sm xxl:!text-lg">
              <p>Phone number: </p>
              <p className="text-gray-400">+{data.pharmacy.phone_number}</p>
            </div>
            <div>
              <p className="text-sm xxl:!text-lg">Working hours:</p>
              <p className="text-gray-400 mt-2 text-md xl:!text-lg xxl:!text-2xl text-center">
                {data.pharmacy.working_hours}
              </p>
            </div>
          </div>
        </Card>
        <div className="flex flex-wrap w-fit justify-center mx-auto lg:!mx-auto gap-3 xxl:!gap-6 items-center">
          <div className="flex flex-col w-44 xxl:!w-80 justify-around gap-3 xxl:!gap-6">
            <Card className="max-w-xs xxl:!max-w-sm">
              <p className="text-center text-sm xxl:!text-lg">
                Num. of medicine
              </p>
              <h1 className="text-2xl xxl:!text-4xl mx-auto font-semi-bold text-green-500 my-auto">
                {data?.total?.total_number}
              </h1>
            </Card>
            <Card className="max-w-xs xxl:!max-w-sm">
              <p className="text-center text-sm xxl:!text-lg">
                Total available
              </p>
              <h1 className="text-2xl xxl:!text-4xl mx-auto text-green-500 font-semi-bold my-auto">
                {data?.total?.total_available}
              </h1>
            </Card>
          </div>
          <div className="flex flex-col w-44 xxl:!w-80 gap-3 xxl:!gap-6 justify-around">
            <Card className="max-w-xs xxl:!max-w-sm">
              <p className="text-center text-sm xxl:!text-lg">Total price</p>
              <h1 className="text-2xl xxl:!text-4xl mx-auto text-green-500 font-semi-bold my-auto">
                {data?.total?.total_price} <span className="text-sm">BAM</span>
              </h1>
            </Card>
            <Card className="max-w-xs">
              <p className="text-center text-sm xxl:!max-w-sm xxl:!text-lg">
                Not available
              </p>
              <h1 className="text-2xl xxl:!text-4xl mx-auto text-red-600 font-semi-bold my-auto">
                {data?.total?.total_not_available}
              </h1>
            </Card>
          </div>
        </div>
      </div>
      <Card className="w-full lg:!w-fit h-fit lg:!flex-grow xl:!w-1/3">
        {data?.recentMedicine.length !== 0 ? (
          <div>
            <p className="xxl:!text-xl">Recent added medicine</p>
            <div className="divide-y">
              {data?.recentMedicine.map((m) => (
                <Link
                  to={`/medicine/${m._id}`}
                  key={m._id}
                  className="flex gap-2 items-center p-2 transition-all duration-100 hover:bg-gray-100 cursor-pointer"
                >
                  <CustomMedicineImg
                    url={
                      m.photo.startsWith(m.name)
                        ? `http://localhost:3001/uploads/${m.photo}`
                        : m.photo
                    }
                    className="rounded-full w-7 md:!w-14 xl:!w-16 h-auto"
                  />
                  <p className="text-xs xxl:!text-lg">
                    {m?.name}({m?.strength + " mg"})
                  </p>
                  <p className="text-xs xxl:!text-lg ml-auto">
                    {formatDate(m?.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-sm xxl:!text-lg text-gray-400">
              There are no recent added medicines
            </p>
          </div>
        )}
      </Card>
    </>
  );
};

export default PDashboard;
