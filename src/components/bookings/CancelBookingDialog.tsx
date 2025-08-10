import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any | null;
  onConfirm: () => void;
}

const CancelBookingDialog = ({ open, onOpenChange, booking, onConfirm }: CancelBookingDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel your booking{booking?.bikes?.name ? ` for ${booking.bikes.name}` : ''}. You can rebook anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:opacity-90" onClick={onConfirm}>
            Cancel Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBookingDialog;
