import { TaskProps } from "../pages/common/Home";
import { AuthProps } from "../types/auth.types";

// helper function that checks if all properties in form object is not null
export const isFormDataComplete = (
  data: AuthProps | Partial<AuthProps> | TaskProps
) => {
  return Object.values(data).every((item) => item !== "" && item !== null);
};


export const isEmpty = (data:object)=>{
  return Object.values(data).every((item)=> item !== "" && item !==null)
}