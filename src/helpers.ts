import { AuthProps } from "./types/auth.types";

// helper function that checks if all properties in form object is not null
export const isFormDataComplete = (data: AuthProps) => {
  return Object.values(data).every((item) => item !== "" && item !== null);
};
