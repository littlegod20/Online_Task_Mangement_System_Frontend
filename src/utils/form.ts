export const handleInputChange = <T extends object>(
  e: React.ChangeEvent<HTMLInputElement>,
  setData: React.Dispatch<React.SetStateAction<T>>
) => {
  const { name, value, type } = e.target;

  setData((prevData) => ({
    ...prevData,
    [name]: type === 'date' ? new Date(value) : value
  }));

  console.log("name:", name, "value:", value);
};



