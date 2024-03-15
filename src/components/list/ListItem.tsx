import { MdDragHandle } from 'react-icons/md';
import { GroupSettings, Item, Group } from '../../interfaces';
import '../../styles/ListItem.css';
import { useState } from 'react';
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
}: Props) {
  const [propertiesVisible, setPropertiesVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <li
      className={'list-group-item d-flex flex-column gap-3' + (dragOver ? ' dragOver' : '')}
      onDragStart={(e) => {
        onDragStart(item, parentGroup, e);
      }}
      onDragEnter={(e) => {
        onDragEnter(item, parentGroup, e);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='d-flex flex-row justify-content-center align-items-center gap-1'>
        <div draggable>
          <MdDragHandle />
        </div>
        {!editMode && `${groupSettings.numbered ? item.groupPositions[parentGroup] + 1 + '. ' : ''}${item.name}`}
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
          onClick={() => {
            setPropertiesVisible(!propertiesVisible);
            setEditMode(false);
          }}
        >
          {!propertiesVisible && !editMode && <IoIosArrowDown />}
          {(propertiesVisible || editMode) && <IoIosArrowUp />}
        </a>
        <a
          onClick={() => {
            setEditMode(!editMode);
            setPropertiesVisible(false);
          }}
        >
          <MdEdit />
        </a>
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
