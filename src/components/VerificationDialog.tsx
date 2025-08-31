import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Upload, 
  User, 
  Globe,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationComplete: (verified: boolean) => void;
}

type CustomerType = 'indian' | 'international' | null;
type VerificationStep = 'customer-type' | 'documents' | 'age-verification' | 'complete';

const VerificationDialog = ({ open, onOpenChange, onVerificationComplete }: VerificationDialogProps) => {
  const [customerType, setCustomerType] = useState<CustomerType>(null);
  const [currentStep, setCurrentStep] = useState<VerificationStep>('customer-type');
  const [documents, setDocuments] = useState({
    driversLicense: null as File | null,
    ageProof: null as File | null,
    passport: null as File | null,
    internationalLicense: null as File | null,
  });
  const [age, setAge] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleFileUpload = (field: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

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
    setCurrentStep('complete');
  };

  const handleComplete = () => {
    onVerificationComplete(true);
    onOpenChange(false);
    // Reset form
    setCustomerType(null);
    setCurrentStep('customer-type');
    setDocuments({
      driversLicense: null,
      ageProof: null,
      passport: null,
      internationalLicense: null,
    });
    setAge('');
    setIsVerified(false);
  };

  const isDocumentsComplete = () => {
    if (customerType === 'indian') {
      return documents.driversLicense && documents.ageProof;
    } else if (customerType === 'international') {
      return documents.passport && documents.internationalLicense;
    }
    return false;
  };

  const renderCustomerTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-16 w-16 text-bike-primary mx-auto mb-4" />
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          Identity Verification Required
        </h3>
        <p className="text-muted-foreground">
          Please select your nationality to proceed with document verification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            customerType === 'indian' ? 'ring-2 ring-bike-primary bg-bike-primary/5' : ''
          }`}
          onClick={() => setCustomerType('indian')}
        >
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-bike-primary mx-auto mb-4" />
            <h4 className="font-display font-semibold text-lg mb-2">Indian Citizen</h4>
            <p className="text-sm text-muted-foreground">
              I am an Indian citizen with valid Indian documents
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            customerType === 'international' ? 'ring-2 ring-bike-primary bg-bike-primary/5' : ''
          }`}
          onClick={() => setCustomerType('international')}
        >
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 text-bike-primary mx-auto mb-4" />
            <h4 className="font-display font-semibold text-lg mb-2">International Visitor</h4>
            <p className="text-sm text-muted-foreground">
              I am a foreign national visiting India
            </p>
          </CardContent>
        </Card>
      </div>

      {customerType && (
        <div className="flex justify-center">
          <Button 
            onClick={() => setCurrentStep('documents')}
            className="bg-gradient-primary hover:shadow-glow"
          >
            Continue to Document Upload
          </Button>
        </div>
      )}
    </div>
  );

  const renderDocumentsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-12 w-12 text-bike-primary mx-auto mb-4" />
        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          Upload Required Documents
        </h3>
        <p className="text-muted-foreground">
          {customerType === 'indian' 
            ? 'Please upload your Driver\'s License and Age Proof (Aadhar Card/Voter ID)'
            : 'Please upload your Passport and International Driver\'s License'
          }
        </p>
      </div>

      <div className="space-y-4">
        {customerType === 'indian' ? (
          <>
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-bike-primary" />
                Driver's License *
              </Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('driversLicense', e.target.files?.[0] || null)}
                className="h-12"
              />
              {documents.driversLicense && (
                <Badge className="bg-bike-seafoam text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {documents.driversLicense.name}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-bike-primary" />
                Age Proof (Aadhar Card / Voter ID) *
              </Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('ageProof', e.target.files?.[0] || null)}
                className="h-12"
              />
              {documents.ageProof && (
                <Badge className="bg-bike-seafoam text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {documents.ageProof.name}
                </Badge>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-bike-primary" />
                Passport *
              </Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('passport', e.target.files?.[0] || null)}
                className="h-12"
              />
              {documents.passport && (
                <Badge className="bg-bike-seafoam text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {documents.passport.name}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-bike-primary" />
                International Driver's License *
              </Label>
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('internationalLicense', e.target.files?.[0] || null)}
                className="h-12"
              />
              {documents.internationalLicense && (
                <Badge className="bg-bike-seafoam text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {documents.internationalLicense.name}
                </Badge>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('customer-type')}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep('age-verification')}
          disabled={!isDocumentsComplete()}
          className="flex-1 bg-gradient-primary hover:shadow-glow"
        >
          Continue to Age Verification
        </Button>
      </div>
    </div>
  );

  const renderAgeVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="h-12 w-12 text-bike-primary mx-auto mb-4" />
        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          Age Verification
        </h3>
        <p className="text-muted-foreground">
          Please enter your date of birth for age verification
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

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('documents')}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleAgeVerification}
          disabled={!age || calculateAge(age) < 18}
          className="flex-1 bg-gradient-primary hover:shadow-glow"
        >
          Verify Age & Complete
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <CheckCircle className="h-16 w-16 text-bike-seafoam mx-auto mb-4" />
      <h3 className="text-2xl font-display font-bold text-foreground mb-2">
        Verification Complete!
      </h3>
      <p className="text-muted-foreground">
        Your documents have been verified and you are eligible to book a bike.
      </p>
      
      <div className="bg-bike-seafoam/10 p-4 rounded-lg">
        <p className="text-sm text-bike-seafoam font-medium">
          ✓ Documents verified<br/>
          ✓ Age verified (18+ years)<br/>
          ✓ Ready to proceed with booking
        </p>
      </div>

      <Button 
        onClick={handleComplete}
        className="w-full bg-gradient-primary hover:shadow-glow"
      >
        Proceed to Booking
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-display font-bold">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            Document Verification
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Complete verification to proceed with your bike booking
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {currentStep === 'customer-type' && renderCustomerTypeStep()}
          {currentStep === 'documents' && renderDocumentsStep()}
          {currentStep === 'age-verification' && renderAgeVerificationStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
