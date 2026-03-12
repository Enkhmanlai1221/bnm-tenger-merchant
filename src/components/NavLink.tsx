import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  children,
  ...rest
}: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, "/");

  const hrefValue = rest.href as string | URL;
  const hrefString = typeof hrefValue === "string" ? hrefValue : hrefValue.toString();
  const isActive = pathnameWithoutLocale.startsWith(hrefString);

  return (
    <Link {...rest} data-active={isActive}>
      {children}
    </Link>
  );
}