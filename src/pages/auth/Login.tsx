import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { LogInformInputs, initalUser } from "../../utils/constants";
import { useState } from "react";
import { AuthProps } from "../../types/auth.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { postUserData } from "../../state/slices/authSlice";
import { handleInputChange } from "../../utils/form";
import { isFormDataComplete } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState<Partial<AuthProps>>({
    username: "",
    password: "",
    email: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // if the user is already authenticated, redirect home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isFormDataComplete(formData)) {
        const response = await dispatch(
          postUserData({ userData: formData, type: "login" })
        ).unwrap();

        setFormData(initalUser);
        navigate("/home");
        return response;
      } else {
        console.log("Please fill in all fields.");
      }
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
    }
  };

  return (
    <main className="w-full flex flex-col p-10 justify-center items-center min-h-screen">
      <section className="w-full  flex flex-col justify-center ">
        <div className="pb-3">
          <header className="text-2xl font-bold text-red-950">Login</header>
          <p className="text-sm text-slate-500 italic">
            Login here if you've already signed up.
          </p>
        </div>
        <form
          className="w-full p-3 space-y-3 flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          {LogInformInputs.map((item, index) => (
            <div className="sm:w-[400px]" key={index}>
              <Input
                name={item.label}
                placeholder={item.placeholder}
                value={formData[item.label as keyof AuthProps]}
                onChange={(e) => handleInputChange(e, setFormData)}
              />
            </div>
          ))}

          <div className="w-2/3 lg:w-4/5 pt-4 text-center">
            <Button
              title="Log In"
              loadingTitle="Logging In..."
              disabled={status === "loading"}
            />

            {error ? (
              <div className="pt-2">
                <p className="text-red-600">{String(error)}</p>
              </div>
            ) : (
              ""
            )}

            <p className="text-sm pt-3 text-slate-500">
              Don't have an account? sign up{" "}
              <Link
                to={"/"}
                className="text-red-900 font-medium hover:underline hover:cursor-pointer"
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

export default Login;
