import { ReactNode } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ConfirmDialog = ({ open, onOpenChange, title, onConfirm, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; onConfirm: () => void; children?: ReactNode }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
      </AlertDialogHeader>
      {children}
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>Batal</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Hapus</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmDialog;

