import Button from 'react-bootstrap/Button';
import '../styles/ListControls.css';
import { useState, useRef } from 'react';

interface Props {
  addGroup: (groupName: string) => void;
}

function ListControls({ addGroup }: Props) {
  const [groupEditMode, setGroupEditMode] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const groupInputRef = useRef<HTMLInputElement>(null);

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
                console.log(groupInputRef.current);
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
    </div>
  );
}

export default ListControls;
