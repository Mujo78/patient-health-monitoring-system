import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  getPatientsForDoctor,
  searchForPatient,
} from "../../service/patientSideFunctions";
import PatientCard from "../../components/PatientCard";
import { Patient } from "../../features/medicine/medicineSlice";
import { Spinner, TextInput } from "flowbite-react";
import ErrorMessage from "../../components/UI/ErrorMessage";
import CustomButton from "../../components/UI/CustomButton";
import Pagination from "../../components/UI/Pagination";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import useSelectedPage from "../../hooks/useSelectedPage";
import { useQuery } from "../../hooks/useQery";

type patients = {
  currentPage: number | null;
  data: Patient[];
  numOfPages: number;
};

const MyPatients: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const query = useQuery();
  const [loading, setLoading] = useState<boolean>(false);
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");
  const { accessUser } = useSelector(authUser);
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<patients | undefined>();
  const [message, setMessage] = useState<string>("");

  useSelectedPage("My patients");

  useEffect(() => {
    const fetchData = async () => {
      if (!id && accessUser) {
        try {
          setLoading(true);
          if (searchQuery) {
            const response = await searchForPatient(
              accessUser.token,
              accessUser.data._id,
              searchQuery,
              Number(page)
            );
            setPatients(response);
          } else {
            const response = await getPatientsForDoctor(
              accessUser.token,
              accessUser.data._id,
              Number(page)
            );
            setPatients(response);
          }
        } catch (err: any) {
          setMessage(err.response?.data || "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [page, searchQuery, id, accessUser]);

  const handleNavigatePage = async (newPage: number) => {
    if (accessUser) {
      try {
        setLoading(true);
        if (searchQuery !== null) {
          const response = await searchForPatient(
            accessUser.token,
            accessUser.data._id,
            searchQuery,
            newPage
          );
          setPatients(response);
          navigate(
            `/my-patients/search?searchQuery=${searchQuery}&page=${newPage}`
          );
        } else {
          const response = await getPatientsForDoctor(
            accessUser.token,
            accessUser.data._id,
            newPage
          );
          setPatients(response);
          navigate(`/my-patients?page=${newPage}`);
        }
      } catch (err: any) {
        setMessage(err.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    setPatients(undefined);
    if (accessUser) {
      try {
        setLoading(true);
        navigate(`/my-patients/search?searchQuery=${search}&page=1`);
        const response = await searchForPatient(
          accessUser.token,
          accessUser.data._id,
          search,
          1
        );
        setPatients(response);
      } catch (err: any) {
        setMessage(err.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-fit mx-3">
      {id ? (
        <Outlet />
      ) : (
        <div className="h-[90vh]">
          <>
            <div className="w-full flex flex-col min-h-full">
              <div className="flex h-2/6 p-2 w-3/4 mx-auto items-center">
                <TextInput
                  className="w-full mr-3"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name"
                />
                <CustomButton
                  onClick={handleSearch}
                  disabled={search === ""}
                  size="md"
                >
                  Search
                </CustomButton>
              </div>
              {loading ? (
                <div className="flex justify-center mt-24">
                  {" "}
                  <Spinner size="lg" />{" "}
                </div>
              ) : patients && patients.data?.length > 0 ? (
                <>
                  <div className="w-full h-5/6">
                    {loading ? (
                      <div className="flex justify-center mt-24">
                        <Spinner size="lg" />
                      </div>
                    ) : (
                      <div className="flex justify-center w-full flex-wrap">
                        {patients?.data.map((n) => (
                          <PatientCard
                            key={n._id}
                            className="m-1"
                            data={n}
                            variant={2}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-full h-2/6 flex mt-auto">
                    <Pagination
                      page={Number(page)}
                      totalPages={patients.numOfPages}
                      handleNavigate={handleNavigatePage}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-between h-[70vh] items-start">
                  <div className="ml-auto h-fit">
                    <Link to="/my-patients" className="text-red-600 underline">
                      Clear
                    </Link>
                  </div>
                  <div className="h-full w-full flex items-center justify-center">
                    <ErrorMessage
                      className="mx-auto my-auto"
                      text={message}
                      size="md"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default MyPatients;
