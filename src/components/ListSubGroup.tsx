import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { Group, Item } from '../interfaces';
import '../styles/ListGroup.css';
import ListItem from './ListItem';

interface Props {
  subGroup: Group;
  items: Item[];
  dropGroup: number;
  dragOverItem: Item;
  editItem: (item: Item, editedItem: Item) => void;
  editGroup: (groupId: number, editedGroup: Group) => void;
  onDragStart: (item: Item, parentGroup: number) => void;
  onDragEnter: (item: Item, parentGroup: number) => void;
  onDragEnd: () => void;
}

function ListSubGroup({ subGroup, items, dropGroup, dragOverItem, editItem, editGroup, onDragStart, onDragEnter, onDragEnd }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [showGroup, setShowGroup] = useState(true);

  return (
    <div className='subGroup'>
      <div className='groupTop'>
        {!editMode && <p>{subGroup.name}</p>}
        {editMode && (
          <input
            value={subGroup.name}
            onChange={(e) => {
              editGroup(subGroup.id, { ...subGroup, name: e.currentTarget.value });
            }}
          ></input>
        )}
        <a
          onClick={() => {
            setShowGroup(!showGroup);
          }}
        >
          {!showGroup && <IoIosArrowDown />}
          {showGroup && <IoIosArrowUp />}
        </a>
        <a
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          <MdEdit />
        </a>
      </div>
      <div className={editMode ? '' : 'collapse'}>
        <p>show numbers</p>
        <p>sort by (dropdown property) (dropdown alphabetically) (sort button)</p>
        <p>(checkbox) auto sort</p>
      </div>
      {subGroup.size !== 0 && (
        <ul className={'list-group list-group-flush' + (showGroup ? '' : ' collapse')}>
          {items.map((item) => {
            return (
              <ListItem
                key={item.id}
                item={item}
                parentGroup={subGroup.id}
                editItem={editItem}
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
                onDragEnd={onDragEnd}
                dragOver={subGroup.id === dropGroup && item == dragOverItem}
              ></ListItem>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ListSubGroup;
