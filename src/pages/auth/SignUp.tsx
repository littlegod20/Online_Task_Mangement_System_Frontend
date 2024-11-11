import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Link, useNavigate } from "react-router-dom";
import { formInputs, initalUser } from "../../utils/constants";
import { handleInputChange } from "../../utils/form";
import { useEffect, useState } from "react";
import { AuthProps } from "../../types/auth.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { postUserData } from "../../state/slices/authSlice";
import { isFormDataComplete } from "../../utils/helpers";

const SignUp = () => {
  const [formData, setFormData] = useState<AuthProps>(initalUser);
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isFormDataComplete(formData)) {
        const response = await dispatch(
          postUserData({ userData: formData, type: "signup" })
        ).unwrap();
        console.log("Server response:", response);
        navigate("/login");
        setFormData(initalUser);
      } else {
        console.log("Please fill in all fields.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log("status:", status);
    console.log("error:", error);
  });

  return (
    <main className="w-full flex flex-col p-10 justify-center items-center min-h-screen">
      <section className="w-full  flex flex-col justify-center ">
        <div>
          <p className="text-2xl font-bold text-red-950">Welcome!</p>
          <p className="text-sm text-slate-500 italic">
            Please sign up to use this website.
          </p>
        </div>
        <form
          className="w-full p-3 space-y-3 flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          {formInputs.map((item, index) => (
            <div className="sm:w-[400px]">
              <Input
                key={index}
                onChange={(e) => handleInputChange(e, setFormData)}
                name={item.label}
                value={formData[item.label as keyof AuthProps]}
                placeholder={item.placeholder}
              />
            </div>
          ))}
          <div className="w-2/3 lg:w-4/5 pt-4 text-center">
            <Button
              title="Sign Up"
              loadingTitle="Signing Up..."
              disabled={status === "loading"}
            />

            <div className="pt-2">
              <p className="text-red-600">{error ? String(error) : ""}</p>
            </div>

            <p className="text-sm pt-3 text-slate-500">
              Already signed up? login in{" "}
              <Link
                to={"/login"}
                className="text-red-900 font-medium hover:underline hover:cursor-pointer hover:text-yellow-500"
              >
                here
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignUp;
