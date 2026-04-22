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
import type { HeaderBreadcrumbProps } from "@/types/header-breadcrumb";
import { nonNavigableSegments } from "@/types/header-breadcrumb";

const UUID_SEGMENT_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NUMERIC_ID_SEGMENT_REGEX = /^\d+$/;

function isIdSegment(segment: string) {
  return (
    UUID_SEGMENT_REGEX.test(segment) || NUMERIC_ID_SEGMENT_REGEX.test(segment)
  );
}

export function HeaderBreadcrumb({ sidebarItems }: HeaderBreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const allCrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const sidebarMatch = sidebarItems.find((item) => item.href === href);

    const label =
      sidebarMatch?.title ?? STATIC_LABELS[segment] ?? toTitleCase(segment);

    return {
      href,
      label,
      segment,
      isId: isIdSegment(segment),
      isSideBarRoute: Boolean(sidebarMatch),
    };
  });

  const crumbs = allCrumbs.filter((crumb) => !crumb.isId);

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
            const isRoleSegment = nonNavigableSegments.has(crumb.segment);
            const shouldLink = !isLast && !isRoleSegment && crumb.isSideBarRoute;

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
                  {shouldLink ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage
                      className={
                        isRoleSegment
                          ? "text-muted-foreground font-normal"
                          : undefined
                      }
                    >
                      {crumb.label}
                    </BreadcrumbPage>
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
