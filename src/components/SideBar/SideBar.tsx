import './SideBar.css';
import { MdEdit } from 'react-icons/md';
import { Button, DropdownButton, Dropdown, DropdownItem } from 'react-bootstrap';

function SideBar() {
  return (
    <div className='sidebar'>
      <div className='d-flex flex-row justify-content-between align-items-center'>
        <p className='mb-0'>20.</p>
        <p className='mb-0'>factorio</p>
        <a
          role='button'
          onClick={() => {
            //   setEditMode(!editMode);
            //   setPropertiesVisible(false);
          }}
        >
          <MdEdit size={'1.25em'} />
        </a>
      </div>
      <div className='d-flex flex-row justify-content-evenly gap-4'>
        <DropdownButton
          variant='secondary'
          title={'Add To Group'}
          disabled={
            // allGroups.length === item.groups.length
            true
          }
        >
          {/* {allGroups
            .filter((group) => !item.groups.includes(group.id))
            .map((group) => {
              return (
                <Dropdown.Item key={group.id} onClick={() => addItemToGroup(item.id, group.id)}>
                  {group.name}
                </Dropdown.Item>
              );
            })} */}
          <DropdownItem></DropdownItem>
        </DropdownButton>
        {/* <Button
          variant='secondary'
          // onClick={() => deleteItem(item.id, parentGroup)}
        >
          Remove
        </Button> */}
        <DropdownButton
          variant='secondary'
          title={'Remove From Group'}
          disabled={
            // allGroups.length === item.groups.length
            true
          }
        >
          {/* {allGroups
            .filter((group) => !item.groups.includes(group.id))
            .map((group) => {
              return (
                <Dropdown.Item key={group.id} onClick={() => addItemToGroup(item.id, group.id)}> //replace addItemToGroup with deleteItem probably
                  {group.name}
                </Dropdown.Item>
              );
            })} */}
          <DropdownItem></DropdownItem>
        </DropdownButton>
        <Button
          variant='secondary'
          //   onClick={() => {
          //     deleteItem(item.id, -1);
          //     setEditMode(false);
          //   }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default SideBar;
