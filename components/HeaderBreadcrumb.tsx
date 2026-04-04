"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { STATIC_LABELS } from "@/types/header-breadcrumb";
import { toTitleCase } from "@/lib/utils/to-title-case";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadcrumNavItem = {
  title: string;
  href: string;
};

interface HeaderBreadcrumbProps {
  sidebarItems: BreadcrumNavItem[];
}

export function HeaderBreadcrumb({ sidebarItems }: HeaderBreadcrumbProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const sidebarMatch = sidebarItems.find((item) => item.href === href);

    const label =
      sidebarMatch?.title ?? STATIC_LABELS[segment] ?? toTitleCase(segment);

    return { href, label };
  });

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <div
                key={crumb.href}
                className="inline-flex items-center gap-1.5"
              >
                <BreadcrumbItem
                  className={
                    index < crumbs.length - 1 ? "hidden md:inline-flex" : ""
                  }
                >
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator
                    className={
                      index < crumbs.length - 2 ? "hidden md:block" : ""
                    }
                  />
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
