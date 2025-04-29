import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import SelectInputs from "../../components/form/form-elements/SelectInputs";
import TextAreaInput from "../../components/form/form-elements/TextAreaInput";
import PageMeta from "../../components/common/PageMeta";
import FileInputExample from "../../components/form/form-elements/FileInputExample";
export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Kitoblarni qo'shish" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />          
        </div>
        <div className="space-y-6">
          <DropzoneComponent />
          <FileInputExample/>
          <button className="py-15 px-52 rounded-2xl text-5xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:text-white">Yuklash</button>
        </div>
      </div>
    </div>
  );
}