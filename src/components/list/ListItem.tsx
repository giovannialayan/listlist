import { MdDragHandle } from 'react-icons/md';
import { GroupSettings, Item, Group } from '../../interfaces';
import '../../styles/ListItem.css';
import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';

interface Props {
  item: Item;
  parentGroup: number;
  groupSettings: GroupSettings;
  allGroups: Group[];
  editItem: (item: number, editedItem: Item) => void;
  deleteItem: (itemId: number, groupId: number) => void;
  addItemToGroup: (itemId: number, groupId: number) => void;
  onDragStart: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onDragEnter: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onDragEnd: (event: React.DragEvent) => void;
  dragOver: boolean;
  editItemGroupPos: (editItem: Item, groupId: number, prevPos: number, newPos: number) => void;
}

function ListItem({
  item,
  parentGroup,
  groupSettings,
  allGroups,
  editItem,
  deleteItem,
  addItemToGroup,
  onDragStart,
  onDragEnter,
  onDragEnd,
  dragOver,
  editItemGroupPos,
}: Props) {
  const [propertiesVisible, setPropertiesVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [posInput, setPosInput] = useState(() => (item.groupPositions[parentGroup] + 1).toString());

  useEffect(() => {
    setPosInput((item.groupPositions[parentGroup] + 1).toString());
  }, [item.groupPositions]);

  return (
    <li
      id={`i${item.id}-g${parentGroup}`}
      className={'list-group-item d-flex flex-column gap-2' + (dragOver ? ' dragOver' : '')}
      onDragStart={(e) => {
        onDragStart(item, parentGroup, e);
      }}
      onDragEnter={(e) => {
        onDragEnter(item, parentGroup, e);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='d-flex flex-row justify-content-between align-items-center gap-3'>
        <div className='d-flex flex-row gap-2'>
          <div role='button' draggable>
            <MdDragHandle size={'1.5em'} />
          </div>
          {groupSettings.numbered && !editMode && <p className='mb-0'>{item.groupPositions[parentGroup] + 1 + '. '}</p>}
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
        </div>
        {!editMode && `${item.name}`}
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
        <div className='d-flex flex-row gap-1'>
          <a
            role='button'
            onClick={() => {
              setPropertiesVisible(!propertiesVisible);
              setEditMode(false);
            }}
          >
            {!propertiesVisible && !editMode && <IoIosArrowDown size={'1.25em'} />}
            {(propertiesVisible || editMode) && <IoIosArrowUp size={'1.25em'} />}
          </a>
          <a
            role='button'
            onClick={() => {
              setEditMode(!editMode);
              setPropertiesVisible(false);
            }}
          >
            <MdEdit size={'1.25em'} />
          </a>
        </div>
      </div>
      <div className={propertiesVisible ? '' : 'collapse'}>
        {item.properties.map((property, index) => {
          return (
            property.data && (
              <p key={index}>
                {property.name}: {property.data}
              </p>
            )
          );
        })}
      </div>
      <div className={`flex-column align-items-center ${editMode ? 'd-flex' : 'collapse'}`}>
        <div>
          {item.properties.map((property, index) => {
            return (
              <p key={index} className='d-flex flex-row align-items-center justify-content-end gap-2'>
                {property.name}:{' '}
                <input
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
                  }}
                ></input>
              </p>
            );
          })}
        </div>
        <div className='d-flex flex-row gap-4'>
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
          </DropdownButton>
          <Button variant='secondary' onClick={() => deleteItem(item.id, parentGroup)}>
            Remove
          </Button>
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
    </li>
  );
}

export default ListItem;
