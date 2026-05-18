import { useState } from "react";
import type { FormErrors } from "@common/models/form-errors";
import MailForm from "@common/components/MailForm";
import SelfieUpload from "./SelfieUpload";

interface SelfieData {
  image: File | null;
  bibNumber: string;
}

export interface SelfieFormSubmitData {
  email: string;
  image: File | null;
  bibNumber: string;
  privacy: boolean;
}

interface SelfieFormProps {
  onSubmit: (data: SelfieFormSubmitData) => void | Promise<void>;
  formErrors: FormErrors;
  description?: string;
  isLoading?: boolean;
}

export default function SelfieForm({ onSubmit, formErrors, description, isLoading }: SelfieFormProps) {
  const [selfie, setSelfie] = useState<SelfieData>({ image: null, bibNumber: "" });

  // Unisce lo stato locale della selfie (immagine + bib) con email/privacy che arrivano da MailForm
  async function handleMailSubmit(data: { email: string; privacy: boolean }) {
    await onSubmit({
      email: data.email,
      image: selfie.image,
      bibNumber: selfie.bibNumber,
      privacy: data.privacy,
    });
  }

  return (
    <>
      <SelfieUpload
        onDataChange={setSelfie}
        onError={formErrors.imageError}
        description={description}
      />
      <MailForm
        submitHandle={handleMailSubmit}
        defaultEmail=""
        onErrors={formErrors}
        externalPayment={false} // nessun redirect a gateway esterno: il submit è gestito qui
        isLoading={isLoading}
      />
    </>
  );
}
