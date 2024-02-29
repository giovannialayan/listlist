import { MdDragHandle } from 'react-icons/md';
import Item from '../interfaces/IItem';
import '../styles/ListItem.css';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';

interface Props {
  item: Item;
  parentGroup: string;
  editItem: (item: Item, editedItem: Item) => void;
  onDragStart: (item: Item, parentGroup: string) => void;
  onDragEnter: (item: Item, parentGroup: string) => void;
  onDragEnd: () => void;
  dragOver: boolean;
}

function ListItem({ item, parentGroup, editItem, onDragStart, onDragEnter, onDragEnd, dragOver }: Props) {
  const [propertiesVisible, setPropertiesVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <li
      className={'list-group-item listItem' + (dragOver ? ' dragOver' : '')}
      onDragStart={() => onDragStart(item, parentGroup)}
      onDragEnter={() => onDragEnter(item, parentGroup)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='itemTop'>
        <div draggable>
          <MdDragHandle />
        </div>
        <div>
          {!editMode && `${item.groupPositions.get(parentGroup) + '. '}${item.name}`}
          {editMode && (
            <input
              value={item.name}
              onChange={(e) => {
                editItem(item, {
                  name: e.currentTarget.value,
                  id: item.id,
                  groups: item.groups,
                  groupPositions: item.groupPositions,
                  properties: item.properties,
                });
              }}
            ></input>
          )}
        </div>
        <div>
          <a
            onClick={() => {
              setPropertiesVisible(!propertiesVisible);
              setEditMode(false);
            }}
          >
            {!propertiesVisible && !editMode && <IoIosArrowDown />}
            {(propertiesVisible || editMode) && <IoIosArrowUp />}
          </a>
        </div>
        <div>
          <a
            onClick={() => {
              setEditMode(!editMode);
              setPropertiesVisible(false);
            }}
          >
            <MdEdit />
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
      <div className={editMode ? '' : 'collapse'}>
        {item.properties.map((property, index) => {
          return (
            <p key={index}>
              {property.name}:{' '}
              <input
                value={property.data}
                onChange={(e) => {
                  const newProperties = item.properties.map((prop, jindex) => {
                    return { name: prop.name, data: jindex === index ? e.currentTarget.value : prop.data };
                  });
                  editItem(item, {
                    name: item.name,
                    id: item.id,
                    groups: item.groups,
                    groupPositions: item.groupPositions,
                    properties: newProperties,
                  });
                }}
              ></input>
            </p>
          );
        })}
      </div>
    </li>
  );
}

export default ListItem;
