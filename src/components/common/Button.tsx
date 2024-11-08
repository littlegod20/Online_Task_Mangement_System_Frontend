interface ButtonProps {
  title: string;
  loadingTitle?:string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, disabled, loadingTitle, onClick }) => {
  return (
    <>
      <button className="bg-red-900 text-white hover:bg-white hover:text-red-900 hover:border-2 hover:border-red-900 transition-all duration-300 ease-in w-full disabled:opacity-70 disabled:pointer-events-none disabled:cursor-wait" disabled={disabled} onClick={onClick}>
        {disabled ? loadingTitle : title}
      </button>
    </>
  );
};

export default Button;
