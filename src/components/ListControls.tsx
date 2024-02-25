import Button from 'react-bootstrap/Button';
import '../styles/ListControls.css';
import { useState, useRef } from 'react';
import AddControl from './AddControl';

interface Props {
  groups: string[];
  addGroup: (groupName: string) => void;
  addItem: (itemName: string, itemGroups: string[]) => void;
}

function ListControls({ groups, addGroup, addItem }: Props) {
  const [groupEditMode, setGroupEditMode] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const groupInputRef = useRef<HTMLInputElement>(null);

  const [itemAddMode, setItemAddMode] = useState(false);

  const handleNewGroup = (groupName: string) => {
    addGroup(groupName);
    setNewGroup('');
    setGroupEditMode(false);
  };

  return (
    <div className='container-fluid'>
      <div>
        {groupEditMode && (
          <>
            <input
              ref={groupInputRef}
              type='text'
              value={newGroup}
              onChange={(e) => setNewGroup(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNewGroup(newGroup);
                }
              }}
              autoFocus
            ></input>
            <Button
              onClick={() => {
                handleNewGroup(newGroup);
              }}
            >
              Add Group
            </Button>
          </>
        )}
        {!groupEditMode && (
          <>
            <Button
              onClick={() => {
                setGroupEditMode(true);
                if (groupInputRef.current) {
                  groupInputRef.current.focus();
                }
              }}
            >
              New Group
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
