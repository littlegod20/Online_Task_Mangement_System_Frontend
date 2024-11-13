import { AuthProps } from "../types/auth.types";

export const initalUser: AuthProps = {
  username: "",
  email: "",
  password: "",
  // role: "user",
};

export const formInputs = [
  {
    label: "username",
    placeholder: "eg. John Doe",
  },
  {
    label: "email",
    placeholder: "eg. johndoe@gmail.com",
  },
  {
    label: "password",
    placeholder: "Enter strong password",
  },
  // {
  //   label: "role",
  //   placeholder: "eg. user or admin",
  // },
];

export const LogInformInputs = [
  {
    label: "username",
    placeholder: "eg. John Doe",
  },
  {
    label: "email",
    placeholder: "eg. johndoe@gmail.com",
  },
  {
    label: "password",
    placeholder: "Enter strong password",
  },
];

export const taskForm = [
  {
    label: "title",
    placeholder: "title of task",
    type: "text",
  },
  {
    label: "description",
    placeholder: "decribe task",
    type: "text",
  },
  {
    label: "date",
    placeholder: "deadline of submision",
    type: "date",
  },
];

export const taskData = {
  title: "",
  description: "",
  date: new Date(),
  status: "pending" as const,
};
