import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { LogInformInputs, userData } from "../../utils/constants";
import { useEffect, useState } from "react";
import { AuthProps } from "../../types/auth.types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { postUserData } from "../../state/authSlice";
import { handleInputChange } from "../../utils/form";
import { isFormDataComplete } from "../../utils/helpers";

const Login = () => {
  const [formData, setFormData] = useState<Partial<AuthProps>>({
    username: "",
    password: "",
    email: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isFormDataComplete(formData)) {
        const response = await dispatch(
          postUserData({ userData: formData, type: "login" })
        ).unwrap();
        console.log("Server response:", response);
        navigate("/home");
        setFormData(userData);
      } else {
        console.log("Please fill in all fields.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(()=>{
    console.log('error:', error)
    console.log('status:', status)
  })

  return (
    <main className="w-full flex flex-col p-10 justify-center items-center min-h-screen">
      <section className="w-full lg:w-1/2  flex flex-col justify-center ">
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
            <Input
              key={index}
              name={item.label}
              placeholder={item.placeholder}
              value={formData[item.label as keyof AuthProps]}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
          ))}

          <div className="w-2/3 lg:w-1/3 pt-4 text-center">
            <Button title="Log In" disabled={status === "loading"} />

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
