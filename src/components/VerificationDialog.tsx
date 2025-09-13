import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Shield
} from 'lucide-react';

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationComplete: (verified: boolean) => void;
}

const VerificationDialog = ({ open, onOpenChange, onVerificationComplete }: VerificationDialogProps) => {
  const [age, setAge] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleAgeVerification = () => {
    if (!age) return;
    
    const customerAge = calculateAge(age);
    
    if (customerAge < 18) {
      alert('Sorry, you must be at least 18 years old to rent a bike. Age verification failed.');
      return;
    }
    
    setIsVerified(true);
    onVerificationComplete(true);
    onOpenChange(false);
  };

  const handleComplete = () => {
    onVerificationComplete(true);
    onOpenChange(false);
    // Reset form
    setAge('');
    setIsVerified(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-display font-bold">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            Age Verification
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Please verify your age to proceed with bike booking
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-bike-primary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                Age Verification Required
              </h3>
              <p className="text-muted-foreground">
                You must be at least 18 years old to rent a bike
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-bike-primary" />
                  Date of Birth *
                </Label>
                <Input
                  type="date"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {age && (
                <div className="bg-bike-light p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    {calculateAge(age) >= 18 ? (
                      <CheckCircle className="h-5 w-5 text-bike-seafoam" />
                    ) : (
                      <XCircle className="h-5 w-5 text-bike-coral" />
                    )}
                    <span className="font-semibold">
                      Age: {calculateAge(age)} years
                      {calculateAge(age) >= 18 ? ' (Eligible)' : ' (Not Eligible - Must be 18+)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleAgeVerification}
              disabled={!age || calculateAge(age) < 18}
              className="w-full bg-gradient-primary hover:shadow-glow"
            >
              Verify Age & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
