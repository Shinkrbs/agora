'use client';

import { useState } from 'react';
import { PositionTemplate, PositionTemplateItem } from '@/types/database';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';

interface TemplateBuilderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PositionTemplate;
}

export function TemplateBuilderModal({
  isOpen,
  onOpenChange,
  initialData,
}: TemplateBuilderModalProps) {
  const [templateName, setTemplateName] = useState(
    initialData?.name ?? ''
  );
  const [positions, setPositions] = useState<PositionTemplateItem[]>(
    initialData?.positions ?? []
  );

  const handleAddPosition = () => {
    setPositions([...positions, { name: '', seat_count: 1 }]);
  };

  const handlePositionChange = (
    index: number,
    field: 'name' | 'seat_count',
    value: string | number
  ) => {
    const updated = [...positions];
    if (field === 'name') {
      updated[index].name = value as string;
    } else {
      updated[index].seat_count = Math.max(1, parseInt(String(value)) || 1);
    }
    setPositions(updated);
  };

  const handleRemovePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Mock save function
    const payload = {
      name: templateName,
      positions,
    };
    console.log(
      initialData
        ? `Updating template: ${initialData.id}`
        : 'Creating new template:',
      payload
    );
    // Reset and close
    setTemplateName('');
    setPositions([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTemplateName('');
    setPositions([]);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    } else {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Template' : 'Create Position Template'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Modify the template and its positions below.'
              : 'Set up a new position template by defining roles and seat counts.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              placeholder="e.g., Standard Council Ballot"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <Separator />

          {/* Positions List */}
          <div className="space-y-3">
            <Label>Positions</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {positions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2 px-3">
                  No positions added yet. Click &quot;+ Add Position&quot; to get
                  started.
                </p>
              ) : (
                positions.map((position, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-end bg-secondary/30 p-3 rounded-md"
                  >
                    <div className="flex-1">
                      <Label htmlFor={`position-name-${index}`} className="text-xs">
                        Position Name
                      </Label>
                      <Input
                        id={`position-name-${index}`}
                        placeholder="e.g., President"
                        value={position.name}
                        onChange={(e) =>
                          handlePositionChange(index, 'name', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="w-20">
                      <Label htmlFor={`seat-count-${index}`} className="text-xs">
                        Seats
                      </Label>
                      <Input
                        id={`seat-count-${index}`}
                        type="number"
                        min="1"
                        value={position.seat_count}
                        onChange={(e) =>
                          handlePositionChange(index, 'seat_count', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePosition(index)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Add Position Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPosition}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!templateName.trim()}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
