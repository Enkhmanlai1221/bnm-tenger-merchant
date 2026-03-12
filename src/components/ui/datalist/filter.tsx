interface FilterProps {
  children: React.ReactNode;
}

export function ListFilter({ children }: FilterProps) {
  return <div className="py-4">{children}</div>;
}
