import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const formInputs = [
  {
    label: "Name",
    placeholder: "eg. John Doe",
  },
  {
    label: "Email",
    placeholder: "eg. johndoe@gmail.com",
  },
  {
    label: "Password",
    placeholder: "Enter strong password",
  },
];

const Login = () => {
  return (
    <main className="w-full flex flex-col p-10 justify-center items-center min-h-screen">
      <section className="w-full lg:w-1/2  flex flex-col justify-center ">
        <div className="pb-3">
          <header className="text-2xl font-bold text-red-950">Login</header>
          <p className="text-sm text-slate-500 italic">
            Login here if you've already signed up.
          </p>
        </div>
        <form className="w-full p-3 space-y-3 flex flex-col justify-center items-center">
          {formInputs.map((item) => (
            <>
              <Input name={item.label} placeholder={item.placeholder} />
            </>
          ))}

          <div className="w-2/3 lg:w-1/3 pt-4 text-center">
            <Button title="Log In" />
            <p className="text-sm pt-3 text-slate-500">
              Don't have an account? sign up{" "}
              <Link
                to={"/signup"}
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
