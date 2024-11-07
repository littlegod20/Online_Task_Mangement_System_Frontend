export const handleInputChange = <T extends object>(
  e: React.ChangeEvent<HTMLInputElement>,
  setData: React.Dispatch<React.SetStateAction<T>>
) => {
  const { name, value } = e.target;

  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};
