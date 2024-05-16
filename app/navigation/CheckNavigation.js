import React, { useContext, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import DefaultNavigation from "./DefaultNavigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import LoginContext from "../context/LoginContext";


export default function CheckNavigation() {
  

  const { authToken, user } = useSelector((state) => state.authReducer);
  const { ent_hangmuc, ent_khuvuc } = useSelector((state) => state.entReducer);
  const { step, saveStep } = useContext(LoginContext);

  

  return (
    <>
      {user && authToken && step === 3 ? (
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
