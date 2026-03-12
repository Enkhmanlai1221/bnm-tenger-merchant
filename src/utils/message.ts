import toast from "react-hot-toast";

const success = (message: string) => {
  toast.success(message || "Хүсэлт амжилттай.");
};

const error = (message: string) => {
  toast.error(message || "Хүсэлт амжилтгүй.");
};

export const message = {
  success,
  error,
};
