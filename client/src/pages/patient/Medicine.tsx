import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Medicine as MedicineType,
  getMedicine,
  medicine,
} from "../../features/medicine/medicineSlice";
import { useAppDispatch } from "../../app/hooks";
import { Card } from "flowbite-react";
import CustomMedicineImg from "../../components/Pharmacy/CustomMedicineImg";
import Pagination from "../../components/UI/Pagination";
import MedicineModal from "../../components/Pharmacy/MedicineModal";
import ErrorMessage from "../../components/UI/ErrorMessage";
import { useNavigate } from "react-router-dom";
import useSelectedPage from "../../hooks/useSelectedPage";
import PharmacyInfo from "../../components/Pharmacy/PharmacyInfo";
import { useQuery } from "../../hooks/useQuery";
import MedicineSearchHeader from "../../components/Pharmacy/MedicineSearchHeader";
import CustomSpinner from "../../components/UI/CustomSpinner";

const Medicine: React.FC = () => {
  const navigate = useNavigate();
  const { medicine: med, status, message } = useSelector(medicine);
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const searchQuery = query.get("searchQuery") || "";
  const category = query.get("category") || "";

  const [show, setShow] = useState<boolean>(false);
  const [m, setM] = useState<MedicineType>();

  const dispatch = useAppDispatch();
  const lastQuery = useRef<string>();

  useEffect(() => {
    if (query.toString() !== lastQuery.current) {
      lastQuery.current = query.toString();
      dispatch(getMedicine({ page, searchQuery, category }));
      navigate(`/medicine-overview?${query.toString()}`);
    }
  }, [page, dispatch, navigate, category, searchQuery, query]);

  const handleNavigate = (pageNum: number) => {
    if (page !== pageNum) {
      const page = pageNum;
      query.set("page", page.toString());
      dispatch(getMedicine({ page, searchQuery, category }));
      navigate(`/medicine-overview?${query.toString()}`);
    }
  };

  const onClose = () => {
    setShow(false);
  };

  const handleShow = (data: MedicineType) => {
    setM(data);
    setShow(true);
  };

  useSelectedPage("Medicine overview");

  return (
    <>
      <div className="h-full transition-all lg:pl-3 duration-300 lg:divide-x flex flex-col gap-3 lg:!gap-3 lg:!flex-row justify-between w-full">
        {status === "loading" ? (
          <CustomSpinner size="xl" />
        ) : (
          <div className=" w-full flex flex-col h-full lg:!w-2/3 justify-between px-2 lg:!px-0">
            <MedicineSearchHeader />
            {med && med?.data?.length > 0 && status !== "failed" ? (
              <>
                <div className="w-full h-full flex-col md:!flex-row flex-wrap items-start flex xxl:mt-2">
                  {med?.data?.map((m: MedicineType) => (
                    <Card
                      className="h-auto w-full md:!w-1/4  xxl:!w-1/3 my-2 md:!m-2 cursor-pointer hover:bg-gray-50"
                      key={m._id}
                      onClick={() => handleShow(m)}
                    >
                      <div className="flex flex-col gap-2 w-full justify-around">
                        <CustomMedicineImg
                          url={
                            m.photo.startsWith(m.name)
                              ? `http://localhost:3001/uploads/${m.photo}`
                              : m.photo
                          }
                          className="mx-auto w-24  xxl:!w-44 h-auto"
                        />
                        <p className="text-xl  xxl:!text-3xl font-semibold">
                          {m.name}
                        </p>
                        <p className="text-xs  xxl:!text-xl">{m.category}</p>
                        <p className="text-md font-bold mt-auto xxl:!text-xl ml-auto">
                          {m.available ? (
                            <span className="text-green-800">
                              {m.price} BAM
                            </span>
                          ) : (
                            <span className="text-red-600">Not available</span>
                          )}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
                <Pagination
                  page={Number(med?.currentPage)}
                  totalPages={Number(med?.numOfPages)}
                  handleNavigate={handleNavigate}
                />
              </>
            ) : (
              <div className="h-full w-full flex-col flex justify-center items-center">
                <ErrorMessage
                  text={message || "No data available."}
                  size="md"
                  className="my-auto mt-5  xxl:!text-2xl"
                />
              </div>
            )}
          </div>
        )}
        <PharmacyInfo />
      </div>

      {m && (
        <MedicineModal
          show={show}
          onClose={onClose}
          medicine={m}
          url={
            m.photo.startsWith(m.name)
              ? `http://localhost:3001/uploads/${m.photo}`
              : m.photo
          }
        />
      )}
    </>
  );
};

export default Medicine;
