'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { deletePositionTemplate } from '../_actions/delete-position-template';

interface DeleteTemplateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  templateId: string;
  onDelete?: () => void;
}

export function DeleteTemplateModal({
  isOpen,
  onOpenChange,
  templateName,
  templateId,
  onDelete,
}: DeleteTemplateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deletePositionTemplate(templateId);

      if (!result.success) {
        toast.error(result.error || 'Failed to delete template');
        return;
      }

      toast.success('Template deleted successfully');
      
      // Refresh parent data
      onDelete?.();
      
      // Close modal
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Template</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">{templateName}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isLoading ? 'Deleting...' : 'Delete Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
