interface InputProps {
  name: string;
  placeholder: string;
  value?: string | Date;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  onChange,
  value,
  type,
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full ">
      <label id={name} htmlFor={name} className="text-red-950 text-sm font-medium">
        {name.capitalize()}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full border rounded p-2 focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-red-900"
        {...(type === "date"
          ? {
              value:
                value instanceof Date ? value.toISOString().slice(0, 10) : "",
            }
          : { value: typeof value === "string" ? value : "" })}
      />
    </div>
  );
};

export default Input;
