
import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
export default function InputStates() {
  
  return (
    <ComponentCard
      title="Input States"
      desc="Validation styles for error, success and disabled states on form controls."
    >
      <div className="space-y-5 sm:space-y-6">
        <div>
          <Label>Kitob Raqami</Label>
          <Input
            type="number"
            placeholder="kitob raqamini kiriting"
          />
        </div>
        {/* Success Input */}
        <div>
          <Label>Ro'yxatdan o'tish id </Label>
          <Input
            type="text"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
