import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { useEffect, useState } from "react";

interface DefaultInputsProps {
  onChange: (data: {
    name: string;
    author: string;
    language: string;
    bookNumber: string;
  }) => void;
  onValidate?: (validateFn: () => boolean) => void;
}

export default function DefaultInputs({ onChange, onValidate }: DefaultInputsProps) {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    language: "",
    bookNumber: "",
  });

  const options = [
    { value: "rsutili", label: "Rus-tili" },
    { value: "ingiliztili", label: "Ingliz-tili" },
    { value: "o'zbektili", label: "O'zbek-tili" },
  ];

  // ✅ Notify parent ONLY when formData changes
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // ✅ Provide validation function once
  useEffect(() => {
    if (onValidate) {
      onValidate(() => {
        return (
          formData.name.trim() !== "" &&
          formData.author.trim() !== "" &&
          formData.language.trim() !== "" &&
          formData.bookNumber.trim() !== ""
        );
      });
    }
  }, [onValidate, formData]);

  return (
    <ComponentCard title="Kitoblar turilarrini to'ldirish">
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Kitob nomi</Label>
          <Input
            type="text"
            placeholder="kitob nomini kiriting"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="author">Kitob muallifini kiriting</Label>
          <Input
            type="text"
            id="author"
            placeholder="kitob muallifini kiriting"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Kitob tilini tanlang</Label>
          <Select
            options={options}
            placeholder="variantlar"
            onChange={(value: string) =>
              setFormData({ ...formData, language: value })
            }
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label htmlFor="bookNumber">Bu kitobdan nechta kitob borligini kiriting</Label>
          <Input
            type="number"
            id="bookNumber"
            placeholder="kitob sonini kiriting"
            value={formData.bookNumber}
            onChange={(e) =>
              setFormData({ ...formData, bookNumber: e.target.value })
            }
          />
        </div>
      </div>
    </ComponentCard>
  );
}
