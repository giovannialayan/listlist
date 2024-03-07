import Button from 'react-bootstrap/Button';
import '../../styles/ListControls.css';
import { useState } from 'react';
import { ItemProperty, Group } from '../../interfaces';
import AddControl from './AddControl';
import AddItemControl from './AddItemControl';
import AddGroupControl from './AddGroupControl';

interface Props {
  groups: Group[];
  properties: string[];
  addGroup: (groupName: string, parentGroup: number) => void;
  addItem: (itemName: string, itemGroups: number[], itemProperties: ItemProperty[]) => void;
  addProperty: (propertyName: string) => void;
}

function ListControls({ groups, properties, addGroup, addItem, addProperty }: Props) {
  const [groupAddMode, setGroupAddMode] = useState(false);
  const [itemAddMode, setItemAddMode] = useState(false);
  const [propertyAddMode, setPropertyAddMode] = useState(false);

  return (
    <div className='container-fluid'>
      <div>
        {groupAddMode && (
          <>
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
          </>
        )}
        {!groupAddMode && !itemAddMode && !propertyAddMode && (
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
        {!groupAddMode && !itemAddMode && !propertyAddMode && (
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
          <AddItemControl
            groups={groups}
            properties={properties}
            addItem={addItem}
            onCancel={() => {
              setItemAddMode(false);
            }}
          ></AddItemControl>
        )}
        {!groupAddMode && !itemAddMode && !propertyAddMode && (
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
