interface InputProps {
  [key: string]: string;
}

const Input: React.FC<InputProps> = ({ name, placeholder }) => {
  return (
    <div className="flex flex-col space-y-2 w-full sm:w-[400px]">
      <label id={name} htmlFor={name} className="text-red-950">
        {name}
      </label>
      <input
        id={name}
        placeholder={placeholder}
        className="w-full border rounded p-2 focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-red-900"
      />
    </div>
  );
};

export default Input;
