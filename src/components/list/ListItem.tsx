import { MdDragHandle } from 'react-icons/md';
import { GroupSettings, Item } from '../../interfaces';
import '../../styles/ListItem.css';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';

interface Props {
  item: Item;
  parentGroup: number;
  groupSettings: GroupSettings;
  editItem: (item: number, editedItem: Item) => void;
  onDragStart: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onDragEnter: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onDragEnd: (event: React.DragEvent) => void;
  dragOver: boolean;
}

function ListItem({ item, parentGroup, groupSettings, editItem, onDragStart, onDragEnter, onDragEnd, dragOver }: Props) {
  const [propertiesVisible, setPropertiesVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <li
      className={'list-group-item listItem' + (dragOver ? ' dragOver' : '')}
      onDragStart={(e) => {
        onDragStart(item, parentGroup, e);
      }}
      onDragEnter={(e) => {
        onDragEnter(item, parentGroup, e);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='itemTop'>
        <div draggable>
          <MdDragHandle />
        </div>
        <div>
          {!editMode && `${groupSettings.numbered ? item.groupPositions.get(parentGroup)! + 1 + '. ' : ''}${item.name}`}
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
    </li>
  );
}

export default ListItem;
