interface ButtonProps {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ title }) => {
  return (
    <>
      <button className="bg-red-900 text-white hover:bg-white hover:text-red-900 hover:border-2 hover:border-red-900 transition-all duration-300 ease-in w-full">
        {title}
      </button>
    </>
  );
};

export default Button;
