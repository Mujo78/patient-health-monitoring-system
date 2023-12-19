import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Medicine as MedicineType,
  Pharmacy,
  getMedicine,
  medicine,
} from "../../features/medicine/medicineSlice";
import { useAppDispatch } from "../../app/hooks";
import { Button, Card, Select, Spinner, TextInput } from "flowbite-react";
import CustomMedicineImg from "../../components/UI/CustomMedicineImg";
import Pagination from "../../components/Pagination";
import MedicineModal from "../../components/MedicineModal";
import { getPharmacy } from "../../service/pharmacySideFunctions";
import { authUser } from "../../features/auth/authSlice";
import ErrorMessage from "../../components/UI/ErrorMessage";
import CustomImg from "../../components/UI/CustomImg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../../components/UI/CustomButton";
import Footer from "../../components/Footer";
import useSelectedPage from "../../hooks/useSelectedPage";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Medicine: React.FC = () => {
  const navigate = useNavigate();
  const { medicine: med, status, message } = useSelector(medicine);
  const { accessUser } = useSelector(authUser);
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const searchQ = query.get("searchQuery") || "";
  const categoryQ = query.get("category") || "";
  const [show, setShow] = useState<boolean>(false);
  const [m, setM] = useState<MedicineType>();
  const [search, setSearch] = useState<string>("");
  const [cat, setCat] = useState<string>(categoryQ || "");
  const [pharmacy, setPharmacy] = useState<Pharmacy | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQ) {
          const searchQuery = searchQ;
          if (categoryQ !== "") {
            const category = categoryQ;
            dispatch(getMedicine({ page, searchQuery, category }));
            navigate(
              `/medicine-overview?searchQuery=${searchQuery}&page=${page}&category=${category}`
            );
          } else {
            dispatch(getMedicine({ page, searchQuery }));
            navigate(
              `/medicine-overview?searchQuery=${searchQuery}&page=${page}`
            );
          }
        } else {
          dispatch(getMedicine({ page }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [page, dispatch, navigate, categoryQ, searchQ]);

  useEffect(() => {
    const fetchData = async () => {
      if (accessUser) {
        try {
          setLoading(true);
          const response = await getPharmacy(accessUser.token);
          setPharmacy(response);
        } catch (err: any) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [accessUser]);

  const handleNavigate = (page: number) => {
    console.log(searchQ);
    if (searchQ !== "") {
      const searchQuery = searchQ;
      if (categoryQ !== "" || cat) {
        const category = categoryQ === "" ? cat : categoryQ;
        dispatch(getMedicine({ page, searchQuery, category }));
        navigate(
          `/medicine-overview?searchQuery=${searchQuery}&page=${page}&category=${category}`
        );
      } else {
        dispatch(getMedicine({ page, searchQuery }));
        navigate(`/medicine-overview?searchQuery=${searchQuery}&page=${page}`);
      }
    } else {
      dispatch(getMedicine({ page }));
      navigate(`/medicine-overview?page=${page}`);
    }
  };

  const onClose = () => {
    setShow(false);
  };

  const handleShow = (data: MedicineType) => {
    setM(data);
    setShow(true);
  };

  const handleClickSearch = () => {
    if (search !== "") {
      if (search !== searchQ) {
        const searchQuery = search;
        dispatch(getMedicine({ page, searchQuery }));
        navigate(
          `/medicine-overview?searchQuery=${searchQuery}&page=${page} ${
            categoryQ ? `&category=${categoryQ}` : ""
          }`
        );
      }
    }
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCat(e.target.value);
    const searchQuery = searchQ;
    const category = e.target.value;
    dispatch(getMedicine({ page, searchQuery, category }));
    navigate(
      `/medicine-overview?searchQuery=${searchQuery}&page=${page}&category=${category}`
    );
  };

  const clearSearch = () => {
    navigate("/medicine-overview?page=1");
  };

  useSelectedPage("Medicine overview");

  const mailTo = `mailto:${pharmacy?.user_id.email}`;

  return (
    <>
      {pharmacy !== undefined ? (
        status === "loading" && loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="h-full transition-all pl-3 duration-300 divide-x flex justify-between w-full">
            {status === "loading" ? (
              <div className="mx-auto my-auto">
                <Spinner size="xl" />
              </div>
            ) : (
              <div className="w-full mr-3">
                <div className="flex-grow w-full flex flex-col h-full justify-between">
                  <div className="flex justify-center my-4 items-center">
                    <TextInput
                      className="w-3/4 mr-3"
                      placeholder="Amoxicilline"
                      name="search"
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />
                    <CustomButton
                      onClick={handleClickSearch}
                      disabled={search === ""}
                      size="md"
                    >
                      Search
                    </CustomButton>
                  </div>
                  {searchQ !== "" && (
                    <div className="flex items-center justify-between">
                      <Select
                        sizing="sm"
                        value={cat}
                        name="category"
                        onChange={(e) => handleChangeCategory(e)}
                      >
                        <option value="">Category</option>
                        <option value="Pain Relief">Pain Relief</option>
                        <option value="Antibiotics">Antibiotics</option>
                        <option value="Antipyretics">Antipyretics</option>
                        <option value="Antacids">Antacids</option>
                        <option value="Antihistamines">Antihistamines</option>
                        <option value="Antidepressants">Antidepressants</option>
                        <option value="Anticoagulants">Anticoagulants</option>
                        <option value="Antidiabetics">Antidiabetics</option>
                        <option value="Antipsychotics">Antipsychotics</option>
                        <option value="Vaccines">Vaccines</option>
                        <option value="Other">Other</option>
                      </Select>
                      <span
                        onClick={clearSearch}
                        className="text-sm cursor-pointer text-red-500 hover:underline"
                      >
                        Clear
                      </span>
                    </div>
                  )}
                  {med?.data && status !== "failed" ? (
                    <>
                      <div className="w-full h-full flex-wrap items-start flex">
                        {med?.data?.map((m: MedicineType) => (
                          <Card
                            className="h-fit w-1/5 cursor-pointer hover:bg-gray-50 w-md m-3"
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
                                className="mx-auto w-[100px] h-[100px]"
                              />
                              <p className="text-xl font-semibold">{m.name}</p>
                              <p className="text-xs">{m.category}</p>
                              <p className="text-md font-bold mt-auto ml-auto">
                                {m.available ? (
                                  <span className="text-green-500">
                                    {" "}
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
                        className="my-auto mt-5"
                      />
                      {searchQ && (
                        <Footer variant={1}>
                          <Button
                            onClick={clearSearch}
                            color="failure"
                            className="m-3 text-white font-bold hover:underline cursor-pointer"
                          >
                            Clear
                          </Button>
                        </Footer>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="w-1/3 h-full">
              {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spinner size="md" />
                </div>
              ) : pharmacy ? (
                <div className="flex flex-col items-center h-full gap-3 justify-center bg-green-50">
                  <CustomImg
                    url={pharmacy.user_id.photo}
                    className="w-[140px] h-[120px] rounded-full"
                  />
                  <div className="flex flex-col gap-2">
                    <p>
                      Name:{" "}
                      <span className="text-blue-700"> {pharmacy.name}</span>
                    </p>
                    <p>
                      Address:{" "}
                      <span className="text-blue-700">{pharmacy.address}</span>
                    </p>
                    <p>
                      Phone number:{" "}
                      <span className="text-blue-700">
                        +{pharmacy.phone_number}
                      </span>
                    </p>
                    <Link to={mailTo}>
                      Email:{" "}
                      <span className="underline text-sm text-blue-700">
                        {pharmacy.user_id.email}
                      </span>
                    </Link>
                    <p>Working hours</p>
                    <p className="text-center text-blue-700 font-semibold">
                      {pharmacy.working_hours}
                    </p>
                  </div>
                </div>
              ) : (
                <p>err</p>
              )}
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
        )
      ) : (
        <div className="h-full flex justify-center items-center">
          <p className="text-md text-gray text-gray-400">No data available.</p>
        </div>
      )}
    </>
  );
};

export default Medicine;
