import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getMedicine,
  medicine,
} from "../../../features/medicine/medicineSlice";
import { useAppDispatch } from "../../../app/hooks";
import { Card } from "flowbite-react";
import CustomMedicineImg from "../../../components/Pharmacy/CustomMedicineImg";
import Pagination from "../../../components/UI/Pagination";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../../../components/UI/Footer";
import useSelectedPage from "../../../hooks/useSelectedPage";
import { useQuery } from "../../../hooks/useQuery";
import MedicineSearchHeader from "../../../components/Pharmacy/MedicineSearchHeader";
import CustomSpinner from "../../../components/UI/CustomSpinner";

const MedicineOverview: React.FC = () => {
  const navigate = useNavigate();
  const { medicine: med, status, message } = useSelector(medicine);
  const location = useLocation().pathname;
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const searchQuery = query.get("searchQuery") || "";
  const category = query.get("category") || "";
  const { id: medicineId } = useParams();
  const dispatch = useAppDispatch();
  const lastQuery = useRef<string>();

  useSelectedPage("Medicine overview");

  useEffect(() => {
    if (query.toString() !== lastQuery.current && !medicineId) {
      lastQuery.current = query.toString();
      dispatch(getMedicine({ page, searchQuery, category }));
      navigate(`/medicine?${query.toString()}`);
    }
  }, [page, dispatch, navigate, category, searchQuery, query, medicineId]);

  const handleNavigate = (newPage: number) => {
    if (page !== newPage && !medicineId) {
      const page = newPage;
      query.set("page", page.toString());
      dispatch(getMedicine({ page, searchQuery, category }));
      navigate(`/medicine?${query.toString()}`);
    }
  };

  const handleShow = (id: string) => {
    console.log(id);
  };

  return (
    <>
      {
        <div className="h-full transition-all pl-3 duration-300 divide-x flex justify-between w-full">
          {!med && status === "loading" ? (
            <CustomSpinner size="lg" />
          ) : (
            <div className="w-full mr-3">
              <div className="flex-grow w-full flex flex-col h-full justify-between">
                <MedicineSearchHeader />
                {med?.data !== undefined && med?.data?.length > 0 ? (
                  <>
                    <div className="w-full h-full flex-wrap items-start flex">
                      {med?.data?.map((m) => (
                        <Card
                          className={`h-fit w-1/5 relative cursor-pointer hover:bg-gray-50 w-md m-3 ${
                            medicineId === m._id ? "!bg-green-50" : ""
                          } `}
                          key={m._id}
                          onClick={() => handleShow(m._id)}
                        >
                          <div className="flex flex-col gap-2 w-full justify-around">
                            <CustomMedicineImg
                              url={
                                m.photo.startsWith(m.name)
                                  ? `http://localhost:3001/uploads/${m.photo}`
                                  : m.photo
                              }
                              className="mx-auto w-[100px] h-[100px] rounded-xl"
                            />
                            <p className="text-xl font-semibold">{m.name}</p>
                            <p className="text-xs">{m.category}</p>
                            <p className="text-md font-bold mt-auto ml-auto">
                              {m.available ? (
                                <span className="text-green-500">
                                  {m.price} BAM
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  Not available
                                </span>
                              )}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <Footer variant={1}>
                      <Pagination
                        page={Number(med?.currentPage)}
                        totalPages={Number(med?.numOfPages)}
                        handleNavigate={handleNavigate}
                      />
                    </Footer>
                  </>
                ) : (
                  <div className="h-full w-full flex-col flex justify-center items-center">
                    <ErrorMessage
                      text={message === "There are no results!" ? message : ""}
                      size="md"
                      className="my-auto mt-15"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="w-1/3 h-full">
            {!medicineId ? (
              <div className="flex h-full justify-center items-center text-center">
                <ErrorMessage
                  text="You haven't selected any medicine to review"
                  size="md"
                />
              </div>
            ) : (
              <div>
                <Outlet />
              </div>
            )}
          </div>
        </div>
      }
    </>
  );
};

export default MedicineOverview;
