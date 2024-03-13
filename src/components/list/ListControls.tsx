import Button from 'react-bootstrap/Button';
import '../../styles/ListControls.css';
import { useState } from 'react';
import { ItemProperty, Group } from '../../interfaces';
import AddControl from './AddControl';
import AddItemControl from './AddItemControl';
import AddGroupControl from './AddGroupControl';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { MdCancel } from 'react-icons/md';

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
    <div className='container-fluid'>
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
          <>
            <a onClick={() => setPropertyDeleteMode(false)}>
              <MdCancel />
            </a>
            <MultiSelectDropdown
              options={properties.map((prop, index) => {
                return { id: index, label: prop, default: false };
              })}
              onChange={setPropertyDeleteSelections}
            ></MultiSelectDropdown>
            <Button
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
          </>
        )}
        {!groupAddMode && !itemAddMode && !propertyAddMode && !propertyDeleteMode && (
          <>
            <Button
              onClick={() => {
                setPropertyAddMode(true);
              }}
            >
              New Property
            </Button>
            <Button
              onClick={() => {
                setPropertyDeleteMode(true);
              }}
            >
              Delete Property
            </Button>
          </>
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
