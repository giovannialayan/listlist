import Button from 'react-bootstrap/Button';
import '../styles/ListControls.css';
import { useState } from 'react';
import ItemProperty from '../interfaces/IItemProperty';
import Group from '../interfaces/IGroup';
import AddControl from './AddControl';
import AddItemControl from './AddItemControl';

interface Props {
  groups: Group[];
  properties: string[];
  addGroup: (groupName: string) => void;
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
