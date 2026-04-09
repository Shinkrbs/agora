'use client';

import { useState, useEffect } from 'react';
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
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createPositionTemplate } from '../_actions/create-position-template';
import { updatePositionTemplate } from '../_actions/update-position-template';

interface TemplateBuilderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PositionTemplate;
  templates?: PositionTemplate[];
  organizationId: string;
  onSave?: () => void;
}

export function TemplateBuilderModal({
  isOpen,
  onOpenChange,
  initialData,
  templates,
  organizationId,
  onSave,
}: TemplateBuilderModalProps) {
  const [templateName, setTemplateName] = useState(
    initialData?.name ?? ''
  );
  const [positions, setPositions] = useState<PositionTemplateItem[]>(
    initialData?.positions ?? []
  );
  const [nameError, setNameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when initialData or modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setTemplateName(initialData.name);
      setPositions([...initialData.positions]);
      setNameError(null);
    } else if (isOpen && !initialData) {
      setTemplateName('');
      setPositions([]);
      setNameError(null);
    }
  }, [isOpen, initialData]);

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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        name: templateName,
        positions,
        organization_id: organizationId,
      };

      let result;
      if (initialData) {
        // EDIT mode
        result = await updatePositionTemplate(initialData.id, {
          name: templateName,
          positions,
        });
      } else {
        // CREATE mode
        result = await createPositionTemplate(organizationId, payload);
      }

      if (!result.success) {
        toast.error(result.error || 'Failed to save template');
        return;
      }

      toast.success(
        initialData ? 'Template updated successfully' : 'Template created successfully'
      );
      
      // Refresh parent data
      onSave?.();
      
      // Reset and close
      setTemplateName('');
      setPositions([]);
      setNameError(null);
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
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
              onChange={(e) => {
                const newName = e.target.value;
                setTemplateName(newName);
                
                // Check for duplicate names
                if (newName.trim()) {
                  const isDuplicate = templates?.some(
                    (t) =>
                      t.name.toLowerCase() === newName.toLowerCase() &&
                      t.id !== initialData?.id
                  );
                  if (isDuplicate) {
                    setNameError('A template with this name already exists.');
                  } else {
                    setNameError(null);
                  }
                } else {
                  setNameError(null);
                }
              }}
              aria-invalid={!!nameError}
            />
            {nameError && (
              <p className="text-sm font-medium text-destructive">
                {nameError}
              </p>
            )}
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
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!templateName.trim() || !!nameError || isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isLoading ? 'Saving...' : 'Save Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
