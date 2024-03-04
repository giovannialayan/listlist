import { useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { MdCancel } from 'react-icons/md';
import '../styles/AddGroupControl.css';
import { Group } from '../interfaces';

interface Props {
  groups: Group[];
  onSubmit: (group: string, parent: number) => void;
  onCancel: () => void;
}

function AddGroupControl({ groups, onSubmit, onCancel }: Props) {
  const [groupInput, setGroupInput] = useState('');
  const [subGroupsChecked, setSubGroupsChecked] = useState(false);
  const [parentGroup, setParentGroup] = useState(0);

  const handleSubmit = () => {
    if (groupInput.trim() !== '') {
      onSubmit(groupInput, subGroupsChecked ? parentGroup : -1);
    }
  };

  const handleCancel = () => {
    onCancel();
    setSubGroupsChecked(false);
  };

  return (
    <div>
      <a onClick={handleCancel}>
        <MdCancel />
      </a>
      <input
        type='text'
        value={groupInput}
        onChange={(e) => setGroupInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        }}
        autoFocus
      ></input>
      <div className='subGroupCheckbox'>
        <input
          type='checkbox'
          checked={subGroupsChecked}
          onChange={(e) => {
            setSubGroupsChecked(e.currentTarget.checked);
          }}
        ></input>
        <p>sub group</p>
      </div>
      {subGroupsChecked && (
        <DropdownButton title={'Parent Group: ' + groups[parentGroup].name}>
          {groups.map((group) => {
            return (
              group.parent === -1 && (
                <Dropdown.Item key={group.id} onClick={() => setParentGroup(group.id)}>
                  {group.name}
                </Dropdown.Item>
              )
            );
          })}
        </DropdownButton>
      )}
      <Button onClick={handleSubmit}>Add Group</Button>
    </div>
  );
}

export default AddGroupControl;
