interface InputProps {
  name: string;
  placeholder: string;
  value?:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ name, placeholder, onChange, value }) => {
  return (
    <div className="flex flex-col space-y-2 w-full sm:w-[400px]">
      <label id={name} htmlFor={name} className="text-red-950">
        {name.capitalize()}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full border rounded p-2 focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-red-900"
      />
    </div>
  );
};

export default Input;
