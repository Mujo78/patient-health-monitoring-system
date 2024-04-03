import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Medicine as MedicineType,
  getMedicine,
  medicine,
} from "../../../features/medicine/medicineSlice";
import { useAppDispatch } from "../../../app/hooks";
import Pagination from "../../../components/UI/Pagination";
import MedicineModal from "../../../components/Pharmacy/MedicineModal";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { useNavigate } from "react-router-dom";
import useSelectedPage from "../../../hooks/useSelectedPage";
import PharmacyInfo from "../../../components/Pharmacy/PharmacyInfo";
import { useQuery } from "../../../hooks/useQuery";
import MedicineSearchHeader from "../../../components/Pharmacy/MedicineSearchHeader";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import Footer from "../../../components/UI/Footer";
import MedicineCard from "../../../components/Pharmacy/MedicineCard";

const Medicine: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [medicineData, setMedicineData] = useState<MedicineType>();
  const lastQuery = useRef<string>();

  const navigate = useNavigate();
  const {
    medicine: med,
    status,
    message,
  } = useSelector(medicine, shallowEqual);
  const dispatch = useAppDispatch();

  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const searchQuery = query.get("searchQuery") || "";
  const category = query.get("category") || "";

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
    setMedicineData(data);
    setShow(true);
  };

  useSelectedPage("Medicine overview");

  return (
    <div className="h-fit md:!h-full">
      <div className="h-full transition-all duration-300">
        <div className="flex h-full w-full flex-col gap-4 md:!gap-0 lg:!flex-row lg:!gap-3 lg:divide-x lg:pl-3">
          {status === "loading" ? (
            <div className="w-full lg:!w-2/3">
              <CustomSpinner size="xl" />
            </div>
          ) : (
            <div className=" flex h-full w-full flex-col justify-start px-2 lg:!w-2/3 lg:!px-0">
              <MedicineSearchHeader />
              {med && med?.data?.length > 0 && status !== "failed" ? (
                <div className="flex h-full flex-col justify-between">
                  <div className="flex h-fit w-full flex-col flex-wrap justify-center md:!flex-row xxl:mt-2">
                    {med?.data?.map((m: MedicineType) => (
                      <MedicineCard
                        key={m._id}
                        medicine={m}
                        onClick={() => handleShow(m)}
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
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <ErrorMessage
                    text={message || "No data available"}
                    size="md"
                    className="my-auto mt-5 xxl:!text-2xl"
                  />
                </div>
              )}
            </div>
          )}
          <PharmacyInfo />
        </div>
      </div>

      {medicineData && (
        <MedicineModal show={show} onClose={onClose} medicine={medicineData} />
      )}
    </div>
  );
};

export default Medicine;
