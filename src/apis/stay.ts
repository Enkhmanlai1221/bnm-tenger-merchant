import { ICancelPolicyType } from "@/interfaces/cancel-policy";
import { IDiscountType } from "@/interfaces/discount";
import { IGerCluster } from "@/interfaces/ger-cluster";
import { IProperty } from "@/interfaces/property";
import { IPropertyFilter } from "@/interfaces/property-filter";
import { GerCluster } from "@/models/ger-cluster";
import { Property } from "@/models/property";
import { PropertyFilter } from "@/models/property-filter";
import { Result } from "@/models/result";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data: any) => {
  const { rows, count } = await httpRequest.get("/properties", data);
  return new Result<IProperty>({
    rows: rows.map((row: IProperty) => Property.fromJson(row)),
    count,
  });
};

export const claster = async (data: any): Promise<IGerCluster[]> => {
  const res = await httpRequest.get("/places/clusters", data);
  return res.map((item: IGerCluster) => GerCluster.fromJson(item));
};

export const address = async (data: any) => {
  const { rows, count } = await httpRequest.get("/properties/addresses", data);
  return new Result<any>({
    rows: rows.map((row: any) => row),
    count,
  });
};

export const get = async (id: string) => {
  const res = await httpRequest.get(`/properties/${id}`);
  return Property.fromJson(res);
};

export const stayGet = async (id: string, data: any) => {
  const res = await httpRequest.get(`/properties/${id}`, data);
  return Property.fromJson(res);
};

export const availableTags = async (data: any) => {
  const res = await httpRequest.get("/property-tags/available", data);
  return res;
};

export const filter = async (data: any): Promise<IPropertyFilter> => {
  const res = await httpRequest.get("/properties/filters", data);
  return PropertyFilter.fromJson(res);
};

export const getPlaceOffers = async () => {
  const res = await httpRequest.get("/place-offers", {
    page: 1,
    limit: 1000,
  });
  return res?.rows || [];
};

export const getCancelPolicies = async (): Promise<ICancelPolicyType[]> => {
  const res = await httpRequest.get("/cancel-policies", {
    page: 1,
    limit: 1000,
  });
  return res?.rows || [];
};

export const getDiscountTypes = async (): Promise<IDiscountType[]> => {
  const res = await httpRequest.get("/discount-types");
  return res || [];
};

export const getPropertyTags = async () => {
  const res = await httpRequest.get("/property-tags", {
    page: 1,
    limit: 1000,
  });
  return res?.rows || [];
};
