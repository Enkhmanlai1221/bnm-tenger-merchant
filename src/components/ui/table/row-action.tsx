type Props = {
  extra: { [key: string]: string | JSX.Element | false };
  onClick?: (key: string) => void;
};

export function RowAction({ extra, onClick }: Props) {
  return (
    <div className="flex items-center gap-2">
      {Object.keys(extra)
        .filter((ext) => ext)
        .map((key, index) => (
          <a key={index} onClick={() => onClick && onClick(key)}>
            {extra[key]}
          </a>
        ))}
    </div>
  );
}
