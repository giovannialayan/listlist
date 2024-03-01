import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { MdCancel } from 'react-icons/md';
import MultiSelectDropdown from './MultiSelectDropdown';

interface Props {
  children: string;
  dropdownOptions?: { id: number; label: string; default: boolean }[];
  onSubmit: (data: { text: string; selections: number[] }) => void;
  onCancel: () => void;
}

function AddControl({ children, dropdownOptions = [], onSubmit, onCancel }: Props) {
  const [inputText, setInputText] = useState('');
  const [dropdownSelections, setDropdownSelections] = useState([] as number[]);

  const handleSubmit = (text: string, selections: number[]) => {
    if (text.trim() !== '') {
      onSubmit({ text, selections });
      setInputText('');
    }
  };

  const handleCancel = () => {
    onCancel();
    setInputText('');
  };

  return (
    <>
      <a onClick={handleCancel}>
        <MdCancel />
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
        onClick={() => {
          handleSubmit(inputText, dropdownSelections);
        }}
      >
        {children}
      </Button>
    </>
  );
}

export default AddControl;
