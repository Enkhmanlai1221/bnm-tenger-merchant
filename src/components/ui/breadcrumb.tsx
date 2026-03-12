import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

export default function BreadCrumb({
  breadcrumb = [],
}: {
  breadcrumb?: { name: string; href: string; current: boolean }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol role="list" className="flex items-center gap-3">
        <Link legacyBehavior href="/listings">
          <a className="text-md font-medium text-gray-500 hover:text-gray-700">
            Үндсэн
          </a>
        </Link>
        {breadcrumb.map((page, index) => (
          <li key={index} className="flex items-center gap-3">
            <IconChevronRight className="size-4 text-gray-500" />
            <Link legacyBehavior href={page.href}>
              <a
                className={`text-md font-medium text-gray-500 hover:text-gray-700 ${page.current ? "text-primary-600 font-bold" : ""}`}
              >
                {page.name}
              </a>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
