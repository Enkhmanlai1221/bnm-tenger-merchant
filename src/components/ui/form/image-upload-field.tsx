import { useField } from ".";
import ImageUploadInput from "../image-upload-input";

interface ImageUploadFieldProps {
  name: string;
  className?: string;
  label?: string;
}

export default function ImageUploadField({
  name,
  className,
  label,
}: ImageUploadFieldProps) {
  const { value, onChange, error } = useField(name);

  return (
    <ImageUploadInput
      value={value}
      onChange={onChange}
      error={error}
      className={className}
      label={label}
    />
  );
}
