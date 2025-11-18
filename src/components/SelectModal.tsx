interface SelectOption {
  id: string;
  name: string;
}

interface SelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  selectedId?: string;
}

export default function SelectModal({
  isOpen,
  onClose,
  title,
  options,
  onSelect,
  selectedId,
}: SelectModalProps) {
  if (!isOpen) return null;

  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {options.length === 0 ? (
            <div className="text-center text-gray-500 py-12">Нет данных</div>
          ) : (
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left p-3.5 rounded-lg transition-colors ${
                    selectedId === option.id
                      ? 'bg-blue-50 text-blue-900 font-medium'
                      : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

