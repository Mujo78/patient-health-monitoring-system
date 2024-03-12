import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getMedicine,
  medicine,
} from "../../../features/medicine/medicineSlice";
import { useAppDispatch } from "../../../app/hooks";
import Pagination from "../../../components/UI/Pagination";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/UI/Footer";
import useSelectedPage from "../../../hooks/useSelectedPage";
import { useQuery } from "../../../hooks/useQuery";
import MedicineSearchHeader from "../../../components/Pharmacy/MedicineSearchHeader";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import OneMedicine from "../../../components/Pharmacy/OneMedicine";
import MedicineCard from "../../../components/Pharmacy/MedicineCard";

const MedicineOverview: React.FC = () => {
  const navigate = useNavigate();
  const { medicine: med, status, message } = useSelector(medicine);
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const medicineId = query.get("id");
  const searchQuery = query.get("searchQuery") || "";
  const category = query.get("category") || "";
  const dispatch = useAppDispatch();
  const lastQuery = useRef<string>();

  useSelectedPage("Medicine overview");

  useEffect(() => {
    if (query.toString() !== lastQuery.current) {
      lastQuery.current = query.toString();
      dispatch(getMedicine({ page, searchQuery, category }));
      navigate(`/medicine?${query.toString()}`);
    }
  }, [page, dispatch, navigate, category, searchQuery, query]);

  const handleNavigate = (newPage: number) => {
    if (page !== newPage) {
      const page = newPage;
      query.set("page", page.toString());
      dispatch(getMedicine({ page, searchQuery, category }));
      navigate(`/medicine?${query.toString()}`);
    }
  };

  const handleShow = (id: string) => {
    query.set("id", id);
    navigate(`/medicine?${query.toString()}`);
  };

  return (
    <div className="h-full">
      <div className="h-full flex-col lg:flex-row transition-all px-2 duration-300 lg:!divide-x flex justify-between w-full">
        {status === "loading" ? (
          <CustomSpinner size="lg" />
        ) : (
          <div className="w-full">
            <div className="flex-grow w-full flex flex-col h-full justify-between">
              <MedicineSearchHeader />
              {med?.data && med?.data?.length > 0 ? (
                <div className="flex flex-col justify-between h-full pb-12 md:!pb-0">
                  <div className="w-full h-fit flex-col md:!flex-row flex-wrap flex xxl:mt-2 justify-center xl:!mt-4">
                    {med?.data?.map((m) => (
                      <MedicineCard
                        key={m._id}
                        medicine={m}
                        onClick={() => handleShow(m._id)}
                        className={medicineId === m._id ? "!bg-green-50" : ""}
                      />
                    ))}
                  </div>
                  <Footer variant={1}>
                    <Pagination
                      page={Number(med?.currentPage)}
                      totalPages={Number(med?.numOfPages)}
                      handleNavigate={handleNavigate}
                    />
                  </Footer>
                </div>
              ) : (
                status === "failed" &&
                !medicineId && (
                  <div className="h-full w-full flex-col flex justify-center items-center mt-12">
                    <ErrorMessage
                      text={message || "There are no results!"}
                      size="md"
                      className="my-auto"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <div className="w-full lg:!w-1/3 h-full">
          {!medicineId && status !== "loading" ? (
            <div className="h-full justify-center items-center text-center hidden md:!flex">
              <ErrorMessage
                className="text-md xxl:!text-2xl"
                text="You haven't selected any medicine to review"
              />
            </div>
          ) : (
            <OneMedicine />
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineOverview;
