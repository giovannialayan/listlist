import { useState } from 'react';
import ListItem from './ListItem';
import { Item, Group } from '../interfaces';
import { MdDragHandle, MdEdit } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import '../styles/ListGroup.css';
import ListSubGroup from './ListSubGroup';

interface Props {
  group: Group;
  subGroups: Group[];
  items: Item[];
  subGroupItems: { [key: string]: Item[] };
  dropGroup: number;
  dragOverItem: Item;
  dragOverGroup: number;
  groupDropParent: number;
  editItem: (item: number, editedItem: Item) => void;
  editGroup: (groupId: number, editedGroup: Group) => void;
  onItemDragStart: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onItemDragEnter: (item: Item, parentGroup: number, event: React.DragEvent) => void;
  onItemDragEnd: (event: React.DragEvent) => void;
  onGroupDragStart: (groupId: number, parentGroup: number, event: React.DragEvent) => void;
  onGroupDragEnter: (groupId: number, parentGroup: number, event: React.DragEvent) => void;
  onGroupDragEnd: (event: React.DragEvent) => void;
}

function ListGroup({
  group,
  subGroups,
  items,
  subGroupItems,
  dropGroup,
  dragOverItem,
  dragOverGroup,
  groupDropParent,
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
      className={'group' + (dragOverGroup === group.id ? ' groupDragOver' : '')}
      onDragStart={(e) => onGroupDragStart(group.id, group.parent, e)}
      onDragEnter={(e) => onGroupDragEnter(group.id, group.parent, e)}
      onDragEnd={onGroupDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='groupTop'>
        <div draggable>
          <MdDragHandle />
        </div>
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
      <div className={showGroup ? '' : ' collapse'}>
        {group.size !== 0 && (
          <ul className={'list-group list-group-flush'}>
            {items.map((item) => {
              return (
                <ListItem
                  key={item.id}
                  item={item}
                  parentGroup={group.id}
                  editItem={editItem}
                  onDragStart={onItemDragStart}
                  onDragEnter={onItemDragEnter}
                  onDragEnd={onItemDragEnd}
                  dragOver={group.id === dropGroup && item == dragOverItem}
                ></ListItem>
              );
            })}
          </ul>
        )}
        {subGroups.map((subGroup) => {
          return (
            <ListSubGroup
              key={subGroup.id}
              subGroup={subGroup}
              items={subGroupItems[subGroup.id]}
              dropGroup={dropGroup}
              dragOverItem={dragOverItem}
              editGroup={editGroup}
              editItem={editItem}
              onItemDragStart={onItemDragStart}
              onItemDragEnter={onItemDragEnter}
              onItemDragEnd={onItemDragEnd}
              onGroupDragStart={onGroupDragStart}
              onGroupDragEnter={onGroupDragEnter}
              onGroupDragEnd={onGroupDragEnd}
              groupDragOver={groupDropParent === subGroup.parent && dragOverGroup === subGroup.id}
            ></ListSubGroup>
          );
        })}
      </div>
    </div>
  );
}

export default ListGroup;
