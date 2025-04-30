import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Select from "../Select";
import Input from "../input/InputField";
import MultiSelect from "../MultiSelect";

interface SelectInputsProps {
  onChange: (data: { category: string; page: string; year: string }) => void;
  onValidate?: (validateFn: () => boolean) => void;
}

export default function SelectInputs({ onChange, onValidate }: SelectInputsProps) {
  const [formData, setFormData] = useState({
    category: "",
    page: "",
    year: "",
  });

  const options = [
    { value: "drama", label: "Drama" },
    { value: "tarixiy", label: "Tarixiy" },
    { value: "hayotiy", label: "Hayotiy" },
  ];

  // This function will be called by parent during submit to validate the form data
  useEffect(() => {
    if (onValidate) {
      onValidate(() => {
        return (
          formData.category.trim() !== "" &&
          formData.page.trim() !== "" &&
          formData.year.trim() !== ""
        );
      });
    }
  }, [formData, onValidate]);

  // Update the parent component when form data changes
  useEffect(() => {
    // Only call onChange when formData actually changes, not on every render
    onChange(formData);
  }, [onChange,formData]); // Removed onChange from dependencies to prevent infinite loop

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "1", text: "1 chi variant", selected: false },
    { value: "2", text: "2 chi variant", selected: false },
    { value: "3", text: "3 chi variant", selected: false },
    { value: "4", text: "4 chi variant", selected: false },
    { value: "5", text: "5 chi variant", selected: false },
  ];

  return (
    <ComponentCard title="Kitoblar kategoriyasini to'ldirish">
      <div className="space-y-6">
        <div>
          <Label>Kategoriyalrni tanlang tanlang</Label>
          <Select
            options={options}
            placeholder="Katgoriyalarni tanlang"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
            defaultValue={formData.category}
          />
        </div>
        <div>
          <MultiSelect
            label="Bir nechta kategoriyalarni tanlang"
            options={multiOptions}
            defaultSelected={["1", "3"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
        </div>
        <div>
          <Label htmlFor="inputTwo">Kitob sahifasini kiriting</Label>
          <Input
            type="number"
            id="page"
            placeholder="kitob sahifasini kiriting"
            value={formData.page}
            onChange={(e) =>
              setFormData({ ...formData, page: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="inputTwo">Kitob chiqarilgan sana oy/kun/yil kiriting</Label>
          <Input
            type="date"
            id="year"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: e.target.value })
            }
          />
        </div>
      </div>
    </ComponentCard>
  );
}