import { UseFormReturn } from "react-hook-form";
import type { EnquiryFormValues } from "./types";
import { TitleField } from "./fields/TitleField";
import { DescriptionField } from "./fields/DescriptionField";
import { LocationField } from "./fields/LocationField";
import { VisitDateField } from "./fields/VisitDateField";
import { MeasurementNotesField } from "./fields/MeasurementNotesField";

interface EnquiryFormFieldsProps {
  form: UseFormReturn<EnquiryFormValues>;
}

const EnquiryFormFields = ({ form }: EnquiryFormFieldsProps) => {
  return (
    <>
      <TitleField form={form} />
      <DescriptionField form={form} />
      <LocationField form={form} />
      <VisitDateField form={form} />
      <MeasurementNotesField form={form} />
    </>
  );
};

export default EnquiryFormFields;