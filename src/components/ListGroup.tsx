import { useState } from 'react';
import ListItem from './ListItem';
import { Item, Group } from '../interfaces';
import { MdEdit } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import '../styles/ListGroup.css';
import ListSubGroup from './ListSubGroup';

interface Props {
  group: Group;
  subGroups: Group[];
  items: Item[];
  subGroupItems: Item[][];
  dropGroup: number;
  dragOverItem: Item;
  editItem: (item: Item, editedItem: Item) => void;
  editGroup: (groupId: number, editedGroup: Group) => void;
  onDragStart: (item: Item, parentGroup: number) => void;
  onDragEnter: (item: Item, parentGroup: number) => void;
  onDragEnd: () => void;
}

function ListGroup({
  group,
  subGroups,
  items,
  subGroupItems,
  dropGroup,
  dragOverItem,
  editItem,
  editGroup,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [showGroup, setShowGroup] = useState(true);

  return (
    <div className='group'>
      <div className='groupTop'>
        {!editMode && <h5>{group.name}</h5>}
        {editMode && (
          <input
            value={group.name}
            onChange={(e) => {
              editGroup(group.id, { ...group, name: e.currentTarget.value });
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
      {group.size !== 0 && (
        <ul className={'list-group list-group-flush' + (showGroup ? '' : ' collapse')}>
          {items.map((item) => {
            return (
              <ListItem
                key={item.id}
                item={item}
                parentGroup={group.id}
                editItem={editItem}
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
                onDragEnd={onDragEnd}
                dragOver={group.id === dropGroup && item == dragOverItem}
              ></ListItem>
            );
          })}
        </ul>
      )}
      {subGroups.map((subGroup, index) => {
        return (
          <ListSubGroup
            key={subGroup.id}
            subGroup={subGroup}
            items={subGroupItems[index]}
            dropGroup={dropGroup}
            dragOverItem={dragOverItem}
            editGroup={editGroup}
            editItem={editItem}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
          ></ListSubGroup>
        );
      })}
    </div>
  );
}

export default ListGroup;
