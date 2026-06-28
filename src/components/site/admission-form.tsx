'use client';
import { play } from "@/lib/site/sounds";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Upload, FileText } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";

const CLASSES = ["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

export function AdmissionForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    applyingClass: "",
    parentName: "",
    phone: "",
    email: "",
    previousSchool: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to Firebase or EmailJS
    play("success"); setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({ studentName: "", dob: "", applyingClass: "", parentName: "", phone: "", email: "", previousSchool: "", address: "" });
    onOpenChange(false);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Thank you for your interest in {SCHOOL.name}. We&apos;ve received your application and will contact you within 48 hours at the phone number provided.
            </p>
            <Button onClick={handleClose} className="bg-xavier hover:bg-xavier-dark text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-bold text-xavier-dark">
            Admission Application Form
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to apply for admission at {SCHOOL.name}. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-xavier-dark uppercase tracking-wide">Student Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="studentName">Student Full Name *</Label>
                <Input
                  id="studentName"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Aarav Kumar Singh"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="applyingClass">Class Applying For *</Label>
              <Select required value={formData.applyingClass} onValueChange={(v) => setFormData({ ...formData, applyingClass: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Parent Details */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif text-sm font-bold text-xavier-dark uppercase tracking-wide">Parent / Guardian Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="parentName">Parent / Guardian Name *</Label>
                <Input
                  id="parentName"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="e.g. Rajesh Kumar Singh"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="parent@email.com"
                className="mt-1"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif text-sm font-bold text-xavier-dark uppercase tracking-wide">Additional Information</h4>
            <div>
              <Label htmlFor="previousSchool">Previous School (if any)</Label>
              <Input
                id="previousSchool"
                value={formData.previousSchool}
                onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                placeholder="Name of previous school"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Residential Address *</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full residential address"
                className="mt-1"
                rows={2}
              />
            </div>
          </div>

          {/* Document Upload (UI only) */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif text-sm font-bold text-xavier-dark uppercase tracking-wide">Documents Required</h4>
            <p className="text-xs text-muted-foreground">Please bring original + photocopy of these documents to the school office during verification:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["Aadhaar Card", "Birth Certificate", "Passport Photo"].map((doc) => (
                <div key={doc} className="flex items-center gap-2 rounded-lg border border-xavier/15 bg-xavier/5 px-3 py-2 text-xs">
                  <FileText className="size-3.5 text-xavier-dark shrink-0" />
                  <span className="text-foreground/80">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-xavier hover:bg-xavier-dark text-white">
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
