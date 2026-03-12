import React from "react";
import { useLanguage } from "@/providers/language";

const PlaceInfo = () => {
  const { translate } = useLanguage();
  return <div>{translate("placesdetail", "PlacesDetail")}</div>;
};

export { PlaceInfo };
