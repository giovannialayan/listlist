import './SideBar.css';
import { MdEdit } from 'react-icons/md';
import { Button, DropdownButton, Dropdown, DropdownItem } from 'react-bootstrap';

function SideBar() {
  return (
    <div className='sidebar'>
      <div className='sidebarTop'>
        <p className='itemNumber'>20.</p>
        <p className='itemName'>factorio</p>
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
      <div className='itemPropertiesContainer'>
        {/* {item.properties.map((property, index) => {
          return (
            property.data && (
              <p key={index}>
                {property.name}: {property.data}
              </p>
            )
          );
        })} */}
        <div className='itemProp'>
          <p className='itemPropName'>review</p>
          <p className='itemPropValue'>
            it tickled my autism, very fun. but i wish the bugs were less creepy and that it if there is going to a tower defense aspect it's more
            predictable and they come from a specific direction or after a nest is destroyed nests never spawn near there again rather than me having
            to be fortified in all directions at all times, it really sucks and feels like it slows down the game a lot for no reason. i really like
            the pace at which the game get more complicated and i didn't have to look stuff up almost at all, it was like trains, rail signals,
            nuclear power were the only things i looked up in my 60 hours of gameplay. i almost never afk'd for stuff to finish, i always had
            something to do or just started doing something else while waiting or if the factory was slow i just rebuilt and expanded to make it more
            efficient. i never felt like i had to sit there and wait for something unless i wanted to. conveyor belt hell, 10/10.
          </p>
          <div className='itemPropLine'></div>
          {/*if this prop is i == length-1 dont render itemPropLine*/}
        </div>
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
