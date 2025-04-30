import { useRef, useState, useCallback } from "react"; // import useCallback to prevent re-renders
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import SelectInputs from "../../components/form/form-elements/SelectInputs";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import FileDrop from "../../components/form/form-elements/FileDrop";
import PageButton from "../../components/common/PageButton";

export default function FormElements() {
  const [defaultInputsData, setDefaultInputsData] = useState({
    name: "",
    author: "",
    language: "",
    bookNumber: "",
    description: "",
    category:"",
    page: "",
    year: "",
    message: "",
  });
  const [uploadedImage, setUploadedFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const defaultInputsValidator = useRef<() => boolean | null>(null);
  const dropzoneValidator = useRef<() => boolean | null>(null);
  const pdfValidator = useRef<() => boolean | null>(null);

  // Memoized handleInputChange function to prevent unnecessary re-renders
  const handleInputChange = useCallback((newData: object) => {
    setDefaultInputsData((prev) => ({
      ...prev,
      ...newData,
    }));
  }, []); // Empty dependency array ensures this function won't change on every render

  // Memoized handler for SelectInputs to prevent re-renders
  const handleSelectInputChange = useCallback((data: { category: string; page: string; year: string }) => {
    handleInputChange({
      category: data.category,
      page: data.page,
      year: data.year,
    });
  }, [handleInputChange]);

  // Memoized handler for TextAreaInput
  const handleTextAreaChange = useCallback((data: { message: string }) => {
    handleInputChange({ description: data.message });
  }, [handleInputChange]);

  const handleSubmit = () => {
    const isDefaultInputsValid = defaultInputsValidator.current?.();
    const isDropzoneValid = dropzoneValidator.current?.();
    const isPdfValid = pdfValidator.current?.();

    if (!isDefaultInputsValid) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    if (!isDropzoneValid) {
      alert("Iltimos, rasm yuklang!");
      return;
    }

    if (!isPdfValid) {
      alert("Iltimos, PDF faylni yuklang.");
      return;
    }

    // All validations passed
    alert("Barcha ma'lumotlar to'g'ri. Yuborildi.");
    console.log("Form Data:", {
      defaultInputsData,
      uploadedImage,
      pdfFile,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-10">
        <PageBreadcrumb pageTitle="Kitoblarni qo'shish" />
        <PageButton pageTitle="Yuklash" onClick={handleSubmit} />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs
            onChange={handleInputChange}
            onValidate={(fn) => (defaultInputsValidator.current = fn)}
          />
          <SelectInputs
            onChange={handleSelectInputChange}
            onValidate={(fn) => (defaultInputsValidator.current = fn)}
          />
          <TextAreaInput
            onChange={handleTextAreaChange}
            onValidate={(fn) => (defaultInputsValidator.current = fn)}
          />
        </div>
        <div className="space-y-6">
          <DropzoneComponent
            onChange={setUploadedFiles}
            onValidate={(fn) => (dropzoneValidator.current = fn)}
          />
          <FileDrop
            onChange={setPdfFile}
            onValidate={(fn) => (pdfValidator.current = fn)}
          />
        </div>
      </div>
    </div>
  );
}