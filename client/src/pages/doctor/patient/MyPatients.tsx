import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  PatientsType,
  getPatientsForDoctor,
} from "../../../service/patientSideFunctions";
import PatientCard from "../../../components/Patient/PatientCard";
import { CustomFlowbiteTheme, TextInput } from "flowbite-react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import CustomButton from "../../../components/UI/CustomButton";
import Pagination from "../../../components/UI/Pagination";
import { useSelector } from "react-redux";
import { authUser } from "../../../features/auth/authSlice";
import useSelectedPage from "../../../hooks/useSelectedPage";
import { useQuery } from "../../../hooks/useQuery";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import Footer from "../../../components/UI/Footer";

const customTextInputTheme: CustomFlowbiteTheme["textInput"] = {
  field: {
    input: {
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "p-2.5 text-sm xxl:!text-xl xxl:!p-3",
        lg: "sm:text-md p-4",
      },
    },
  },
};

const MyPatients: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [patients, setPatients] = useState<PatientsType | undefined>();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { accessUser } = useSelector(authUser);
  const navigate = useNavigate();
  const { id } = useParams();
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const searchQuery = query.get("searchQuery") || "";
  const lastQuery = useRef<string>();

  useSelectedPage("My patients");

  useEffect(() => {
    const fetchData = async () => {
      if (!id && accessUser && query.toString() !== lastQuery.current) {
        lastQuery.current = query.toString();
        try {
          setLoading(true);
          const response = await getPatientsForDoctor(
            accessUser.token,
            page,
            searchQuery
          );
          setPatients(response);
          navigate(`/my-patients?${query.toString()}`);
        } catch (err: any) {
          setMessage(err.response?.data);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [page, searchQuery, id, accessUser, navigate, query]);

  const handleNavigatePage = async (newPage: number) => {
    if (page !== newPage && accessUser) {
      query.set("page", newPage.toString());
      const response = await getPatientsForDoctor(
        accessUser.token,
        page,
        searchQuery
      );
      setPatients(response);
      navigate(`/my-patients?${query.toString()}`);
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (search !== "" && search !== searchQuery && accessUser) {
      query.set("page", "1");
      query.set("searchQuery", search);

      const response = await getPatientsForDoctor(
        accessUser.token,
        page,
        searchQuery
      );
      setPatients(response);
      navigate(`/my-patients?${query.toString()}`);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
    navigate("/my-patients?page=1");
  };

  return (
    <div className="h-fit md:!h-full mx-2">
      {id ? (
        <Outlet />
      ) : (
        <div className="w-full flex flex-col h-full">
          <div className="flex w-full p-2 mx-auto items-center">
            <form onSubmit={handleSearch} className="w-full py-3">
              <div className="flex gap-2 mx-auto w-full xl:!w-3/4">
                <TextInput
                  theme={customTextInputTheme}
                  className="flex-grow"
                  name="search"
                  value={search}
                  onChange={onChange}
                  placeholder="Joe Doe"
                />
                <CustomButton
                  type="submit"
                  className="w-fit xxl:!w-36"
                  disabled={search === ""}
                  size="md"
                >
                  <p className="xxl:text-xl">Search</p>
                </CustomButton>
              </div>
              {searchQuery && (
                <div className="my-2 ml-2 text-end">
                  <span
                    onClick={clearSearch}
                    className="text-sm xxl:!text-2xl md:mr-1.5 cursor-pointer text-red-500 hover:underline"
                  >
                    Clear
                  </span>
                </div>
              )}
            </form>
          </div>
          {loading ? (
            <CustomSpinner size="lg" fromTop={24} />
          ) : (
            <div className="flex flex-col gap-4 h-full">
              {patients && patients.data?.length > 0 ? (
                <div className="flex flex-col justify-between h-full gap-4">
                  <div className="w-full h-fit">
                    <div className="flex justify-start w-full mx-1 gap-1 flex-wrap">
                      {patients?.data.map((n) => (
                        <PatientCard
                          key={n._id}
                          className="m-1"
                          data={n}
                          variant={2}
                        />
                      ))}
                    </div>
                  </div>

                  <Footer variant={1}>
                    <div className="pb-12 w-full md:!pb-0">
                      <Pagination
                        page={Number(page)}
                        totalPages={patients.numOfPages}
                        handleNavigate={handleNavigatePage}
                      />
                    </div>
                  </Footer>
                </div>
              ) : (
                <div className="text-center mt-16">
                  <ErrorMessage
                    className="mx-auto my-auto xxl:text-2xl"
                    text={message || "No data available."}
                    size="md"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPatients;
