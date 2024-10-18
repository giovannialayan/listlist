import { useEffect, useState } from 'react';
import './SideBar.css';
import { MdEdit } from 'react-icons/md';
import { Button, DropdownButton, Dropdown, DropdownItem } from 'react-bootstrap';
import { Item, Group } from '../../interfaces';

interface Props {
  item: Item;
  parentGroup: number;
  allGroups: Group[];
  addItemToGroup: (itemId: number, groupId: number) => void;
  deleteItem: (itemId: number, groupId: number) => void;
  editItemGroupPos: (editItem: Item, groupId: number, prevPos: number, newPos: number) => void;
  editItem: (item: number, editedItem: Item) => void;
}

function SideBar({ item, parentGroup, allGroups, addItemToGroup, deleteItem, editItemGroupPos, editItem }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [posInput, setPosInput] = useState(() => (item.groupPositions[parentGroup] + 1).toString());

  useEffect(() => {
    setPosInput((item.groupPositions[parentGroup] + 1).toString());
  }, [item.groupPositions]);

  const setTextBoxHeight = (element: HTMLElement) => {
    element.style.height = element.scrollHeight + 'px';
  };

  return (
    <div className='sidebar'>
      <div className='sidebarTop'>
        {!editMode && <p className='itemNumber'>{item.groupPositions[parentGroup] + 1 + '. '}</p>}
        {editMode && (
          <input
            className='numberInput'
            value={posInput}
            onChange={(e) => {
              setPosInput(e.currentTarget.value.toString());
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                //make sure it is a number and then floor it in case the user hates me and wants to break it by using a float
                const posNum = +posInput;
                if (!isNaN(posNum)) {
                  editItemGroupPos(item, parentGroup, item.groupPositions[parentGroup], Math.floor(posNum) - 1);
                } else {
                  setPosInput((item.groupPositions[parentGroup] + 1).toString());
                }
              }
            }}
            onBlur={() => setPosInput((item.groupPositions[parentGroup] + 1).toString())}
          ></input>
        )}
        {!editMode && <p className='itemName'>{item.name}</p>}
        {editMode && (
          <input
            value={item.name}
            onChange={(e) => {
              editItem(item.id, {
                ...item,
                name: e.currentTarget.value,
              });
            }}
          ></input>
        )}
        <a
          role='button'
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          <MdEdit size={'1.25em'} />
        </a>
      </div>
      <div className={`itemPropertiesContainer ${editMode ? 'collapse' : ''}`}>
        {item.properties.map((property, index) => {
          return (
            property.data && (
              <div key={index} className='itemProp'>
                <p className='itemPropName'>{property.name}</p>
                <p className='itemPropValue'>{property.data}</p>
                {index != item.properties.filter((p) => p.data).length - 1 && <div className='itemPropLine'></div>}
              </div>
            )
          );
        })}
      </div>
      <div className={`itemPropertiesEditor ${!editMode ? 'collapse' : ''}`}>
        {item.properties.map((property, index) => {
          return (
            <p key={index} className='d-flex flex-column align-items-center justify-content-end gap-2'>
              {property.name}
              <textarea
                value={property.data}
                onChange={(e) => {
                  editItem(item.id, {
                    ...item,
                    properties: item.properties.map((prop, jindex) => {
                      if (jindex === index) {
                        return { ...prop, data: e.currentTarget.value };
                      } else {
                        return prop;
                      }
                    }),
                  });
                  // setTextBoxHeight(e.currentTarget);
                }}
                rows={10}
                cols={50}
              ></textarea>
            </p>
          );
        })}
      </div>
      <div className={`${editMode ? 'd-flex' : 'collapse'} flex-row justify-content-evenly gap-4`}>
        <DropdownButton variant='secondary' title={'Add To Group'} disabled={allGroups.length === item.groups.length}>
          {allGroups
            .filter((group) => !item.groups.includes(group.id))
            .map((group) => {
              return (
                <Dropdown.Item key={group.id} onClick={() => addItemToGroup(item.id, group.id)}>
                  {group.name}
                </Dropdown.Item>
              );
            })}
          <DropdownItem></DropdownItem>
        </DropdownButton>
        <DropdownButton variant='secondary' title={'Remove From Group'}>
          {allGroups
            .filter((group) => item.groups.includes(group.id))
            .map((group) => {
              return (
                <Dropdown.Item key={group.id} onClick={() => deleteItem(item.id, group.id)}>
                  {group.name}
                </Dropdown.Item>
              );
            })}
          <DropdownItem></DropdownItem>
        </DropdownButton>
        <Button
          variant='secondary'
          onClick={() => {
            deleteItem(item.id, -1);
            setEditMode(false);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default SideBar;
