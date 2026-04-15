"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReceiptModalProps {
  receiptUrl: string;
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceiptModal({
  receiptUrl,
  title,
  isOpen,
  onOpenChange,
}: ReceiptModalProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>
            Receipt for {title}
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full bg-muted rounded-lg overflow-hidden">
          {isImageLoading && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          <div className="relative w-full h-96">
            <Image
              src={receiptUrl}
              alt={`Payment receipt for ${title}`}
              fill
              className="object-contain"
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            asChild
            variant="default"
          >
            <a href={receiptUrl} download target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
