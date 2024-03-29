import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Medicine as MedicineType,
  getMedicine,
  medicine,
} from "../../features/medicine/medicineSlice";
import { useAppDispatch } from "../../app/hooks";
import Pagination from "../../components/UI/Pagination";
import MedicineModal from "../../components/Pharmacy/MedicineModal";
import ErrorMessage from "../../components/UI/ErrorMessage";
import { useNavigate } from "react-router-dom";
import useSelectedPage from "../../hooks/useSelectedPage";
import PharmacyInfo from "../../components/Pharmacy/PharmacyInfo";
import { useQuery } from "../../hooks/useQuery";
import MedicineSearchHeader from "../../components/Pharmacy/MedicineSearchHeader";
import CustomSpinner from "../../components/UI/CustomSpinner";
import Footer from "../../components/UI/Footer";
import MedicineCard from "../../components/Pharmacy/MedicineCard";

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
    <div className="h-fit md:!h-full">
      <div className="h-full transition-all duration-300">
        <div className="h-full lg:pl-3 lg:divide-x flex flex-col gap-4 md:!gap-0 lg:!gap-3 lg:!flex-row w-full">
          {status === "loading" ? (
            <CustomSpinner size="xl" />
          ) : (
            <div className=" w-full flex flex-col h-full lg:!w-2/3 justify-start px-2 lg:!px-0">
              <MedicineSearchHeader />
              {med && med?.data?.length > 0 && status !== "failed" ? (
                <div className="flex flex-col justify-between h-full">
                  <div className="w-full h-fit flex-col md:!flex-row flex-wrap flex xxl:mt-2 justify-center">
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
    </div>
  );
};

export default Medicine;
