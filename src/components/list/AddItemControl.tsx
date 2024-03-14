import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import ItemProperty from '../../interfaces/IItemProperty';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { Group } from '../../interfaces';
import '../../styles/ControlMenu.css';

interface Props {
  groups: Group[];
  properties: string[];
  addItem: (itemName: string, itemGroups: number[], itemProperties: ItemProperty[]) => void;
  onCancel: () => void;
}

function AddItemControl({ groups, properties, addItem, onCancel }: Props) {
  const [inputName, setInputName] = useState('');
  const [groupSelections, setGroupSelections] = useState([0]);
  const [inputProperties, setInputProperties] = useState(Array(properties.length).fill(''));

  const handleSubmit = () => {
    if (inputName.trim() !== '' && groupSelections.length > 0) {
      addItem(
        inputName,
        groupSelections,
        properties.map((prop, index) => {
          return { name: prop, data: inputProperties[index] };
        })
      );
      setInputName('');
      setInputProperties(Array(properties.length).fill(''));
    }
  };

  const handleCancel = () => {
    onCancel();
    setInputName('');
    setInputProperties(Array(properties.length).fill(''));
  };

  return (
    <div className='controlMenu'>
      <a onClick={handleCancel}>
        <MdClose />
      </a>
      <input type='text' value={inputName} onChange={(e) => setInputName(e.currentTarget.value)}></input>
      <MultiSelectDropdown
        options={groups.map((group) => {
          return { id: group.id, label: group.name, default: group.id == 0 };
        })}
        onChange={setGroupSelections}
      >
        Select Groups
      </MultiSelectDropdown>
      {properties.map((property, index) => {
        return (
          <div key={property} className='d-flex flex-row align-items-center justify-content-end gap-2 w-100'>
            <p className='my-0'>{property}: </p>
            <input
              type='text'
              value={inputProperties[index]}
              onChange={(e) => {
                const tempArr = [...inputProperties];
                tempArr[index] = e.currentTarget.value;
                setInputProperties(tempArr);
              }}
            ></input>
          </div>
        );
      })}
      <Button variant='secondary' onClick={handleSubmit}>
        Add Item
      </Button>
    </div>
  );
}

export default AddItemControl;
