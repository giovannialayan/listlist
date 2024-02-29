import { useState } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
  options: { id: number; label: string; default: boolean }[];
  onChange: (selections: string[]) => void;
  children?: string;
}

function MultiSelectDropdown({ options, onChange, children = 'Select Options' }: Props) {
  const getInitialSelected = (): number[] => {
    const defaultOptions = options.filter((option) => {
      return option.default;
    });

    return defaultOptions.map((option) => {
      return option.id;
    });
  };

  const [selectedOptions, setSelectedOptions] = useState(getInitialSelected);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionChange = (id: number, checked: boolean) => {
    let tempSelectedOptions = selectedOptions;

    if (checked) {
      tempSelectedOptions.push(id);
    } else {
      tempSelectedOptions = tempSelectedOptions.filter((optionId) => optionId !== id);
    }

    setSelectedOptions(tempSelectedOptions);

    let selections = options.filter((option) => tempSelectedOptions.includes(option.id)).map((option) => option.label);

    onChange(selections);
  };

  return (
    <div className={`dropdown ${isOpen ? 'show' : ''}`}>
      <button
        className='btn btn-secondary dropdown-toggle'
        type='button'
        id='multiSelectDropdown'
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {children}
      </button>
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby='multiSelectDropdown'>
        {options.map((option) => (
          <Form.Check
            // disabled={option.default}
            key={option.id}
            type='checkbox'
            id={`option_${option.id}`}
            label={option.label}
            checked={selectedOptions.includes(option.id)}
            onChange={(e) => handleOptionChange(option.id, e.currentTarget.checked)}
            value={option.id}
          />
        ))}
      </div>
    </div>
  );
}

export default MultiSelectDropdown;
