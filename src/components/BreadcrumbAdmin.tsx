"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const toCapital = (text: string) => {
  const firstLetter = text.charAt(0).toUpperCase();
  const rest = text.slice(1, text.length);
  return `${firstLetter}${rest}`;
};

export default function BreadcrumbAdmin() {
  const path = usePathname();
  const items = path
    .replace("/admin", "")
    .split("/")
    .filter((v) => v !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) =>
          i !== items.length - 1 ? (
            <Fragment key={i}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href={`/admin/${item}`}>{toCapital(item)}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </Fragment>
          ) : (
            <BreadcrumbItem key={i}>
              <BreadcrumbPage>{toCapital(item)}</BreadcrumbPage>
            </BreadcrumbItem>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
