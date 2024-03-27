import React from "react";
import TabNavigation from "./TabNavigation";
import DefaultNavigation from "./DefaultNavigation";
import { Provider, useDispatch, useSelector } from "react-redux";

export default function CheckNavigation() {
  const { authToken, user } = useSelector((state) => state.authReducer);
  return (
    <>
      {user && authToken  ? (
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
