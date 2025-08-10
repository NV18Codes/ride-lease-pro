import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ModifyBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any | null;
  onSubmit: (values: {
    id: string;
    start_date: string;
    end_date: string;
    pickup_location: string;
    drop_location?: string;
    special_instructions?: string;
  }) => void;
}

const toLocalInputValue = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

const ModifyBookingDialog = ({ open, onOpenChange, booking, onSubmit }: ModifyBookingDialogProps) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (booking) {
      setStart(toLocalInputValue(booking.start_date));
      setEnd(toLocalInputValue(booking.end_date));
      setPickup(booking.pickup_location || "");
      setDrop(booking.drop_location || "");
      setNotes(booking.special_instructions || "");
    }
  }, [booking]);

  const handleSubmit = () => {
    if (!booking) return;
    if (!start || !end) return;
    const startISO = new Date(start).toISOString();
    const endISO = new Date(end).toISOString();
    onSubmit({
      id: booking.id,
      start_date: startISO,
      end_date: endISO,
      pickup_location: pickup,
      drop_location: drop || undefined,
      special_instructions: notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modify Booking</DialogTitle>
          <DialogDescription>Update your booking details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Start</label>
            <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">End</label>
            <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Pickup location</label>
            <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Drop location (optional)</label>
            <Input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Drop" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Special instructions (optional)</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-primary hover:shadow-glow" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyBookingDialog;
