import AvatarUpload from "../avatar-upload";
import { useField } from ".";

export function AvatarField({ name }: { name: string }) {
  const { value, onChange, error } = useField(name);

  return (
    <AvatarUpload
      value={value}
      onChange={(value) => {
        onChange(value);
      }}
      error={error}
    />
  );
}
