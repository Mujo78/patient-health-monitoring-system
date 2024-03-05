import { useEffect, useState } from "react";
import { Pharmacy } from "../../features/medicine/medicineSlice";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import { getPharmacy } from "../../service/pharmacySideFunctions";
import { Spinner } from "flowbite-react";
import CustomImg from "../UI/CustomImg";
import { Link } from "react-router-dom";

const PharmacyInfo = () => {
  const [pharmacy, setPharmacy] = useState<Pharmacy | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const { accessUser } = useSelector(authUser);

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

  const mailTo = `mailto:${pharmacy?.user_id.email}`;
  return (
    <div className="w-full lg:!w-1/3 h-fit lg:!h-full">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      ) : (
        pharmacy && (
          <div className="flex flex-col items-center h-fit lg:!h-full p-3 lg:!py-0 lg:!px-3 xl:!p-0 gap-3 justify-center bg-green-50">
            <CustomImg
              url={pharmacy.user_id.photo}
              className="rounded-full w-20 lg:!w-28 xxl:!w-44 h-auto"
            />
            <div className="flex flex-col text-sm lg:!text-md xl:!text-lg xxl:!text-2xl gap-2">
              <p>
                Name: <span className="text-blue-700"> {pharmacy.name}</span>
              </p>
              <p>
                Address:{" "}
                <span className="text-blue-700">{pharmacy.address}</span>
              </p>
              <p>
                Phone number:{" "}
                <span className="text-blue-700">+{pharmacy.phone_number}</span>
              </p>
              <Link to={mailTo}>
                Email:{" "}
                <span className="underline text-blue-700">
                  {pharmacy.user_id.email}
                </span>
              </Link>
              <p>Working hours</p>
              <p className="text-center text-blue-700 font-semibold">
                {pharmacy.working_hours}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PharmacyInfo;
