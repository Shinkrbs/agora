"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LayoutTemplate, Users, Trello } from "lucide-react";

interface ConfigItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

export function ConfigurationGrid() {
  const router = useRouter();

  const configItems: ConfigItem[] = [
    {
      id: "templates",
      label: "Position Templates",
      description: "Define standard ballot positions",
      icon: LayoutTemplate,
      href: "/position-templates",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "members",
      label: "Manage Organization",
      description: "Manage officer access and roles",
      icon: Users,
      href: "/organization-management",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {configItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.id}
            className="p-6 hover:shadow-lg transition-shadow hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer group"
          >
            <Button
              variant="ghost"
              className="w-full h-auto p-0 justify-start flex-col items-start hover:bg-transparent"
              onClick={() => router.push(item.href)}
            >
              <div className={`${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50 text-left">
                {item.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                {item.description}
              </p>
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
