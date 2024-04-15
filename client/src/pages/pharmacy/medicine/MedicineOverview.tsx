import React, { useCallback, useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
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
  const {
    medicine: med,
    status,
    message,
  } = useSelector(medicine, shallowEqual);
  const query = useQuery();
  const page = Number(query.get("page")) ?? 1;
  const medicineId = query.get("id");
  const searchQuery = query.get("searchQuery") || "";
  const category = query.get("category") || "";
  const dispatch = useAppDispatch();
  const lastQuery = useRef<string>();

  const queryParamsSame = query.toString() !== lastQuery.current;

  const handleGetMedicine = useCallback(() => {
    lastQuery.current = query.toString();
    dispatch(getMedicine({ page, searchQuery, category }));
    navigate(`/medicine?${query.toString()}`);
  }, [page, dispatch, searchQuery, category, navigate, query]);

  useEffect(() => {
    if (queryParamsSame) handleGetMedicine();
  }, [queryParamsSame, handleGetMedicine]);

  const handleNavigate = (newPage: number) => {
    if (page !== newPage) {
      const page = newPage;
      query.set("page", page.toString());
      navigate(`/medicine?${query.toString()}`);
    }
  };

  const handleShow = (id: string) => {
    query.set("id", id);
    navigate(`/medicine?${query.toString()}`);
  };

  useSelectedPage("Medicine overview");

  return (
    <div className="h-full">
      <div className="flex h-full w-full flex-col justify-between px-2 transition-all duration-300 lg:flex-row lg:!divide-x">
        {status === "loading" ? (
          <CustomSpinner size="lg" />
        ) : (
          <div className="w-full">
            <div className="flex h-full w-full flex-grow flex-col justify-between">
              <MedicineSearchHeader />
              {status === "failed" &&
              (!medicineId || message?.includes("Network")) ? (
                <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
                  <ErrorMessage text={message} className="my-auto" />
                </div>
              ) : (
                med?.data &&
                med?.data?.length > 0 && (
                  <div className="flex h-full flex-col justify-between pb-12 md:!pb-0">
                    <div className="flex h-fit w-full flex-col flex-wrap justify-center md:!flex-row xl:!mt-4 xxl:mt-2">
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
                )
              )}
            </div>
          </div>
        )}
        {!message?.includes("Network") && (
          <div className="h-full w-full lg:!w-1/3">
            {!medicineId && status !== "loading" ? (
              <div className="hidden h-full items-center justify-center text-center md:!flex">
                <ErrorMessage text="You haven't selected any medicine to review" />
              </div>
            ) : (
              <OneMedicine />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineOverview;
