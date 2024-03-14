import Button from 'react-bootstrap/Button';
import '../../styles/ControlMenu.css';
import { useState } from 'react';
import { ItemProperty, Group } from '../../interfaces';
import AddControl from './AddControl';
import AddItemControl from './AddItemControl';
import AddGroupControl from './AddGroupControl';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { MdClose } from 'react-icons/md';

interface Props {
  groups: Group[];
  properties: string[];
  addGroup: (groupName: string, parentGroup: number) => void;
  addItem: (itemName: string, itemGroups: number[], itemProperties: ItemProperty[]) => void;
  addProperty: (propertyName: string) => void;
  deleteProperties: (properties: string[]) => void;
}

function ListControls({ groups, properties, addGroup, addItem, addProperty, deleteProperties }: Props) {
  const [groupAddMode, setGroupAddMode] = useState(false);
  const [itemAddMode, setItemAddMode] = useState(false);
  const [propertyAddMode, setPropertyAddMode] = useState(false);
  const [propertyDeleteMode, setPropertyDeleteMode] = useState(false);
  const [propertyDeleteSelections, setPropertyDeleteSelections] = useState([] as number[]);

  return (
    <div className='d-flex flex-row gap-2'>
      <div>
        {groupAddMode && (
          <AddGroupControl
            groups={groups}
            onSubmit={(groupName, parentGroup) => {
              addGroup(groupName, parentGroup);
              setGroupAddMode(false);
            }}
            onCancel={() => {
              setGroupAddMode(false);
            }}
          ></AddGroupControl>
        )}
        {!groupAddMode && !itemAddMode && !propertyAddMode && !propertyDeleteMode && (
          <Button
            variant='secondary'
            onClick={() => {
              setGroupAddMode(true);
            }}
          >
            New Group
          </Button>
        )}
      </div>
      <div>
        {propertyAddMode && (
          <AddControl
            disallowedInputs={properties}
            onSubmit={(data) => {
              addProperty(data.text);
              setPropertyAddMode(false);
            }}
            onCancel={() => {
              setPropertyAddMode(false);
            }}
          >
            Add Property
          </AddControl>
        )}
        {propertyDeleteMode && (
          <div className='controlMenu'>
            <a onClick={() => setPropertyDeleteMode(false)}>
              <MdClose />
            </a>
            <MultiSelectDropdown
              options={properties.map((prop, index) => {
                return { id: index, label: prop, default: false };
              })}
              onChange={setPropertyDeleteSelections}
            >
              Property Selections
            </MultiSelectDropdown>
            <Button
              variant='secondary'
              onClick={() => {
                deleteProperties(
                  propertyDeleteSelections.map((selection) => {
                    return properties[selection];
                  })
                );
                setPropertyDeleteMode(false);
              }}
            >
              Delete Properties
            </Button>
          </div>
        )}
        {!groupAddMode && !itemAddMode && !propertyAddMode && !propertyDeleteMode && (
          <div className='d-flex flex-row gap-2'>
            <Button
              variant='secondary'
              onClick={() => {
                setPropertyAddMode(true);
              }}
            >
              New Property
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                setPropertyDeleteMode(true);
              }}
            >
              Delete Property
            </Button>
          </div>
        )}
      </div>
      <div>
        {itemAddMode && (
          <AddItemControl
            groups={groups}
            properties={properties}
            addItem={addItem}
            onCancel={() => {
              setItemAddMode(false);
            }}
          ></AddItemControl>
        )}
        {!groupAddMode && !itemAddMode && !propertyAddMode && !propertyDeleteMode && (
          <Button
            variant='secondary'
            disabled={groups.length === 0}
            onClick={() => {
              setItemAddMode(true);
            }}
          >
            New Item
          </Button>
        )}
      </div>
    </div>
  );
}

export default ListControls;
