import {X} from 'lucide-react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent">
      
      <div className="fixed inset-0 transition-opacity flex justify-center w-full items-center ">
        {/* main card */}
        <div className="relative w-4/5 sm:w-3/2 max-w-lg rounded-md shadow-xl flex flex-col justify-center p-5 bg-white opacity-100  z-50 ">
          <div className="w-full  flex justify-between rounded-lg">
            <h2 className="text-xl font-semibold">{title || "Title"}</h2>
            <button
              className="p-1 hover:bg-gray-300 rounded-full transition-colors"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
