import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDragHandle, MdEdit } from 'react-icons/md';
import { Group, Item } from '../interfaces';
import '../styles/ListGroup.css';
import ListItem from './ListItem';

interface Props {
  subGroup: Group;
  items: Item[];
  dropGroup: number;
  dragOverItem: Item;
  groupDragOver: boolean;
  editItem: (item: number, editedItem: Item) => void;
  editGroup: (groupId: number, editedGroup: Group) => void;
  onItemDragStart: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onItemDragEnter: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onItemDragEnd: (event: React.DragEvent) => void;
  onGroupDragStart: (groupId: number, parentGroup: number, event: React.DragEvent) => void;
  onGroupDragEnter: (groupId: number, parentGroup: number, event: React.DragEvent) => void;
  onGroupDragEnd: (event: React.DragEvent) => void;
}

function ListSubGroup({
  subGroup,
  items,
  dropGroup,
  dragOverItem,
  groupDragOver,
  editItem,
  editGroup,
  onItemDragStart,
  onItemDragEnter,
  onItemDragEnd,
  onGroupDragStart,
  onGroupDragEnter,
  onGroupDragEnd,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [showGroup, setShowGroup] = useState(true);

  return (
    <div
      className={'subGroup' + (groupDragOver ? ' groupDragOver' : '')}
      onDragStart={(e) => onGroupDragStart(subGroup.id, subGroup.parent, e)}
      onDragEnter={(e) => onGroupDragEnter(subGroup.id, subGroup.parent, e)}
      onDragEnd={onGroupDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='groupTop'>
        <div draggable>
          <MdDragHandle />
        </div>
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
                groupSettings={subGroup.settings}
                editItem={editItem}
                onDragStart={onItemDragStart}
                onDragEnter={onItemDragEnter}
                onDragEnd={onItemDragEnd}
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
