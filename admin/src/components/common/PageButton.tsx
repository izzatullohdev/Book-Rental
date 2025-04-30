
interface BreadcrumbProps {
  pageTitle: string;
  onClick?: () => void; 
}

const PageButton: React.FC<BreadcrumbProps> = ({ pageTitle,onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="px-3 py-2 mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:text-white"
        x-text="pageName"
      >
        {pageTitle}
      </button>
    </div>
  );
};

export default PageButton;
