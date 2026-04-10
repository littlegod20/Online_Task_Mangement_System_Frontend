import { LucideIcon } from "lucide-react";

interface ButtonProps {
  title: string | LucideIcon;
  loadingTitle?: string;
  disabled?: boolean;
  onClick?: () => void;
  /** When `title` is a string, renders this icon to the left on the same row. */
  icon?: LucideIcon;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  title,
  disabled,
  loadingTitle,
  onClick,
  icon: Icon,
  className = "",
  type = "button",
}) => {
  const renderTitle = () => {
    if (typeof title === "string") {
      if (Icon) {
        return (
          <span className="flex items-center justify-center gap-2">
            <Icon size={18} strokeWidth={2} aria-hidden />
            <span>{title}</span>
          </span>
        );
      }
      return title;
    }

    const IconComponent = title;
    return (
      <div className="flex justify-center items-center">
        <IconComponent size={15} />
      </div>
    );
  };

  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-2 bg-red-900 text-white transition-all duration-300 ease-in hover:border-2 hover:border-red-900 hover:bg-white hover:text-red-900 disabled:cursor-wait disabled:pointer-events-none disabled:opacity-70 ${className.includes("w-") ? "" : "w-full"} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {disabled ? loadingTitle : renderTitle()}
    </button>
  );
};

export default Button;
