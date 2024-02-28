import Button from 'react-bootstrap/Button';
import '../styles/ListControls.css';
import { useState } from 'react';
import AddControl from './AddControl';

interface Props {
  groups: string[];
  addGroup: (groupName: string) => void;
  addItem: (itemName: string, itemGroups: string[]) => void;
  addProperty: (propertyName: string) => void;
}

function ListControls({ groups, addGroup, addItem, addProperty }: Props) {
  const [groupAddMode, setGroupAddMode] = useState(false);
  const [itemAddMode, setItemAddMode] = useState(false);
  const [propertyAddMode, setPropertyAddMode] = useState(false);

  return (
    <div className='container-fluid'>
      <div>
        {groupAddMode && (
          <>
            <AddControl
              onSubmit={(data) => {
                addGroup(data.text);
                setGroupAddMode(false);
              }}
              onCancel={() => {
                setGroupAddMode(false);
              }}
            >
              Add Group
            </AddControl>
          </>
        )}
        {!groupAddMode && (
          <>
            <Button
              onClick={() => {
                setGroupAddMode(true);
              }}
            >
              New Group
            </Button>
          </>
        )}
      </div>
      <div>
        {propertyAddMode && (
          <>
            <AddControl
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
          </>
        )}
        {!propertyAddMode && (
          <>
            <Button
              onClick={() => {
                setPropertyAddMode(true);
              }}
            >
              New Property
            </Button>
          </>
        )}
      </div>
      <div>
        {itemAddMode && (
          <>
            <AddControl
              onSubmit={(data) => {
                addItem(data.text, data.selections);
                setItemAddMode(false);
              }}
              onCancel={() => {
                setItemAddMode(false);
              }}
              dropdownOptions={groups.map((group, index) => {
                return { id: index, label: group, default: index == 0 };
              })}
            >
              Add Item
            </AddControl>
          </>
        )}
        {!itemAddMode && (
          <>
            <Button
              onClick={() => {
                setItemAddMode(true);
              }}
            >
              New Item
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ListControls;
