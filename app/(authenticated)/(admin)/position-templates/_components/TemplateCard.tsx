'use client';

import { PositionTemplate } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Copy, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TemplateCardProps {
  template: PositionTemplate;
  onEdit: (template: PositionTemplate) => void;
  onDuplicate: (template: PositionTemplate) => void;
  onDelete: (template: PositionTemplate) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const totalSeats = template.positions.reduce(
    (sum, pos) => sum + pos.seat_count,
    0
  );

  const handleDuplicate = () => {
    onDuplicate(template);
  };

  const handleDelete = () => {
    onDelete(template);
  };

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <div
        onClick={() => onEdit(template)}
        className="px-6 space-y-4 h-full flex flex-col"
      >
        {/* Header with Dropdown */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight text-foreground">
              {template.name}
            </h3>
          </div>

          {/* Dropdown Menu - Stop propagation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(template);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleDuplicate();
              }}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badge - Number of Roles */}
        <Badge variant="secondary" className="w-fit">
          {template.positions.length} roles
        </Badge>

        {/* Metadata */}
        <div className="space-y-1 text-sm text-muted-foreground mt-auto">
          <p>
            <strong>Total Seats:</strong> {totalSeats}
          </p>
          <p>
            <strong>Last Updated:</strong>{' '}
            {formatDistanceToNow(new Date(template.updated_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}
