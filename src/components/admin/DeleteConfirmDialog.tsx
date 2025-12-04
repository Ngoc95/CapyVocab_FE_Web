import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemName: string;
  parentName?: string; // Nếu có parent thì hiện option "xóa khỏi parent"
  onConfirmDelete: (deleteCompletely: boolean) => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  parentName,
  onConfirmDelete,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>{description}</p>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium text-foreground">{itemName}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          {parentName && (
            <Button
              onClick={() => {
                onConfirmDelete(false);
                onOpenChange(false);
              }}
              variant="outline"
              className="w-full"
            >
              Chỉ xóa khỏi "{parentName}"
            </Button>
          )}
          <Button
            onClick={() => {
              onConfirmDelete(true);
              onOpenChange(false);
            }}
            variant="destructive"
            className="w-full"
          >
            Xóa hoàn toàn
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full"
          >
            Hủy
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
