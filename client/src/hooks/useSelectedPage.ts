import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { authUser, setSelected } from "../features/auth/authSlice";
import { useEffect } from "react";

function useSelectedPage(pageName: string) {
  const dispatch = useAppDispatch();
  const { selected } = useSelector(authUser);

  useEffect(() => {
    if (selected !== pageName) {
      dispatch(setSelected(pageName));
    }
  }, [selected, dispatch, pageName]);
}

export default useSelectedPage;
