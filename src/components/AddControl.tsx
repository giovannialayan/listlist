import { Button } from 'react-bootstrap';
import { useState } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

interface Props {
  children: string;
  onSubmit: (data: { text: string; selections: string[] }) => void;
  dropdownOptions: { id: number; label: string; default: boolean }[];
}

function AddControl({ children, onSubmit, dropdownOptions }: Props) {
  const [inputText, setInputText] = useState('');
  const [dropdownSelections, setDropdownSelections] = useState([] as string[]);

  const handleSubmit = (text: string, selections: string[]) => {
    if (text.trim() !== '') {
      onSubmit({ text, selections });
      setInputText('');
    }
  };

  return (
    <>
      <input
        type='text'
        value={inputText}
        onChange={(e) => setInputText(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(inputText, dropdownSelections);
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
