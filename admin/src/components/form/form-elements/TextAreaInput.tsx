import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";

interface TextAreaInputProps {
  onChange: (data: { message: string }) => void;
  onValidate: (validateFn: () => boolean) => void;
}

export default function TextAreaInput({ onChange, onValidate }: TextAreaInputProps) {
  const [message, setMessage] = useState("");

  // Update parent component with the message value
  useEffect(() => {
    return onChange({ message });
  }, [message, onChange]);

  // Send validation function to the parent component
  useEffect(() => {
    if (onValidate) {
      onValidate(() => {
        // Validation: Check if message is empty
        return message.trim() !== "";
      });
    }
  }, [message, onValidate]);

  return (
    <ComponentCard title="Kitoblar haqida ma'lumotlarni kiriting">
      <div className="space-y-6">
        <div>
          <Label>Tavsif</Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
