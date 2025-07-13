import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type BreadcrumbsProps = {
  paths: {
    name: string;
    href?: string;
  }[];
};

export function Breadcrumbs({
  paths,
  className,
}: BreadcrumbsProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Breadcrumb className={` ${className}`}>
      <BreadcrumbList className="">
        <BreadcrumbItem>
          {paths.length > 0 ? (
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Home</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {paths.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === paths.length - 1 ? (
                <BreadcrumbPage>{path.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={path.href}>{path.name}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
