import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { apiClientAuth } from "../helpers/ApiClient";

type Options<T> = {
  conditions?: boolean | string;
  checkData?: boolean;
  onSuccess?: (data: T) => void | boolean | undefined;
};

const useAPI = <T>(url: string, options?: Options<T>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<T>();

  const { conditions, checkData, onSuccess } = options || {};

  const checkDataProp = checkData ? !data : true;
  const conditionsToCheck = conditions ?? true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<T> = await apiClientAuth.get(url);
        setData(response.data);
        if (onSuccess) onSuccess(response.data);
      } catch (error: any) {
        setError(error?.response?.data ?? error?.message);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };

    if (conditionsToCheck && checkDataProp) {
      fetchData();
    }
  }, [url, conditionsToCheck, checkDataProp, onSuccess]);

  return { loading, error, data, setError, setLoading };
};

export default useAPI;
