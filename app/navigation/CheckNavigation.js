import React, {useContext} from "react";
import TabNavigation from "./TabNavigation";
import DefaultNavigation from "./DefaultNavigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import LoginContext from "../context/LoginContext";

export default function CheckNavigation() {
  const { authToken, user } = useSelector((state) => state.authReducer);
  const { step, saveStep } = useContext(LoginContext);
  console.log('step',step)
  return (
    <>
      {user && authToken && step ===3  ? (
        <>
          <TabNavigation />
        </>
      ) : (
        <>
          <DefaultNavigation />
        </>
      )}
    </>
  );
}
