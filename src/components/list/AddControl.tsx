import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import MultiSelectDropdown from '../MultiSelectDropdown';

interface Props {
  children: string;
  disallowedInputs?: string[];
  dropdownOptions?: { id: number; label: string; default: boolean }[];
  onSubmit: (data: { text: string; selections: number[] }) => void;
  onCancel: () => void;
}

function AddControl({ children, dropdownOptions = [], disallowedInputs = [], onSubmit, onCancel }: Props) {
  const [inputText, setInputText] = useState('');
  const [dropdownSelections, setDropdownSelections] = useState([] as number[]);

  const handleSubmit = (text: string, selections: number[]) => {
    if (text.trim() !== '' && !disallowedInputs.includes(text.trim())) {
      onSubmit({ text, selections });
      setInputText('');
    }
  };

  const handleCancel = () => {
    onCancel();
    setInputText('');
  };

  return (
    <div className='controlMenu'>
      <a onClick={handleCancel}>
        <MdClose />
      </a>
      <input
        type='text'
        value={inputText}
        onChange={(e) => setInputText(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(inputText, dropdownSelections);
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        }}
        autoFocus
      ></input>
      {dropdownOptions.length > 0 && (
        <MultiSelectDropdown
          options={dropdownOptions}
          onChange={(selections) => {
            setDropdownSelections(selections);
          }}
        ></MultiSelectDropdown>
      )}
      <Button
        variant='secondary'
        onClick={() => {
          handleSubmit(inputText, dropdownSelections);
        }}
      >
        {children}
      </Button>
    </div>
  );
}

export default AddControl;
