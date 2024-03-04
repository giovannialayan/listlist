import { MdDragHandle } from 'react-icons/md';
import { Item } from '../interfaces';
import '../styles/ListItem.css';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';

interface Props {
  item: Item;
  parentGroup: number;
  editItem: (item: Item, editedItem: Item) => void;
  onDragStart: (item: Item, parentGroup: number) => void;
  onDragEnter: (item: Item, parentGroup: number) => void;
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
                  ...item,
                  name: e.currentTarget.value,
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
                  editItem(item, {
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
    </li>
  );
}

export default ListItem;
