import { useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import '../../styles/ControlMenu.css';
import { Group } from '../../interfaces';
import Checkbox from '../Checkbox';

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
    <div className='controlMenu'>
      <a onClick={handleCancel}>
        <MdClose />
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
      <div>
        <Checkbox
          checked={subGroupsChecked}
          onChange={() => {
            setSubGroupsChecked(!subGroupsChecked);
          }}
        >
          sub group
        </Checkbox>
      </div>
      {subGroupsChecked && (
        <DropdownButton variant='secondary' title={'Parent Group: ' + groups[parentGroup].name}>
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
      <Button variant='secondary' onClick={handleSubmit}>
        Add Group
      </Button>
    </div>
  );
}

export default AddGroupControl;
