import { useEffect, useState } from "react";
import { Pharmacy } from "../../features/medicine/medicineSlice";
import { getPharmacy } from "../../service/pharmacySideFunctions";
import CustomImg from "../UI/CustomImg";
import { Link } from "react-router-dom";
import CustomSpinner from "../UI/CustomSpinner";
import toast from "react-hot-toast";
import ErrorMessage from "../UI/ErrorMessage";

const PharmacyInfo = () => {
  const [pharmacy, setPharmacy] = useState<Pharmacy>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPharmacy();
        setPharmacy(response);
      } catch (err: any) {
        setError(err.response.data ?? err.message);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (error)
      toast.error(
        "There was an error while getting pharmacy informations, try again later!",
      );
  }, [error]);

  const mailTo = `mailto:${pharmacy?.user_id.email}`;
  const phoneTo = `tel:+${pharmacy?.phone_number}`;

  return (
    <div className="h-fit w-full pb-14 md:!pb-0 lg:!h-full lg:!w-1/3">
      {loading ? (
        <CustomSpinner size="xl" />
      ) : pharmacy ? (
        <div className="flex h-fit flex-col items-center justify-center gap-3 bg-green-50 p-3 lg:!h-full lg:!px-3 lg:!py-0 xl:!p-0">
          <CustomImg
            url={pharmacy.user_id.photo}
            className="h-auto w-20 rounded-full lg:!w-28 xxl:!w-44"
          />
          <div className="lg:!text-md flex flex-col gap-2 text-sm xl:!gap-4 xl:!text-[1rem] xxl:!text-2xl">
            <p>
              Name: <span className="text-blue-700"> {pharmacy.name}</span>
            </p>
            <p>
              Address: <span className="text-blue-700">{pharmacy.address}</span>
            </p>
            <Link to={phoneTo}>
              Phone number:{" "}
              <span className="text-blue-700">+{pharmacy.phone_number}</span>
            </Link>
            <Link to={mailTo}>
              Email:{" "}
              <span className="text-blue-700 underline">
                {pharmacy.user_id.email}
              </span>
            </Link>
            <p>Working hours</p>
            <p className="text-center font-semibold text-blue-700 xl:text-xl xxl:text-4xl">
              {pharmacy.working_hours}
            </p>
          </div>
        </div>
      ) : (
        error && (
          <div className="flex h-full items-center justify-center">
            <ErrorMessage text={error} />
          </div>
        )
      )}
    </div>
  );
};

export default PharmacyInfo;
