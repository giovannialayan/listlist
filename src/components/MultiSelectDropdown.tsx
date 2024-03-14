import { useState } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
  options: { id: number; label: string; default: boolean }[];
  onChange: (selections: number[]) => void;
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

    onChange([...tempSelectedOptions]);
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
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        {children}
      </button>
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby='multiSelectDropdown'>
        {options.map((option) => (
          <Form.Check
            className='mx-2'
            key={option.id}
            type='checkbox'
            id={`option_${option.id}`}
            label={option.label}
            checked={selectedOptions.includes(option.id)}
            onChange={(e) => handleOptionChange(option.id, e.currentTarget.checked)}
            value={option.id}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              } else if (e.key === 'Enter') {
                handleOptionChange(option.id, e.currentTarget.checked);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default MultiSelectDropdown;
