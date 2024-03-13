import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdDragHandle, MdEdit } from 'react-icons/md';
import { Group, Item, GroupSettings } from '../../interfaces';
import '../../styles/ListGroup.css';
import ListItem from './ListItem';
import ListGroupSettings from './ListGroupSettings';

interface Props {
  subGroup: Group;
  items: Item[];
  properties: string[];
  dropGroup: number;
  dragOverItem: Item;
  groupDragOver: boolean;
  editItem: (item: number, editedItem: Item) => void;
  deleteItem: (itemId: number, groupId: number) => void;
  editGroup: (groupId: number, editedGroup: Group) => void;
  deleteGroup: (groupId: number) => void;
  editGroupSettings: (groupId: number, newSettings: GroupSettings) => void;
  sortItems: (groupId: number) => void;
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
  properties,
  dropGroup,
  dragOverItem,
  groupDragOver,
  editItem,
  deleteItem,
  editGroup,
  deleteGroup,
  editGroupSettings,
  sortItems,
  onItemDragStart,
  onItemDragEnter,
  onItemDragEnd,
  onGroupDragStart,
  onGroupDragEnter,
  onGroupDragEnd,
}: Props) {
  const [editMode, setEditMode] = useState(false);

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
            editGroupSettings(subGroup.id, { ...subGroup.settings, collapse: !subGroup.settings.collapse });
          }}
        >
          {subGroup.settings.collapse && <IoIosArrowDown />}
          {!subGroup.settings.collapse && <IoIosArrowUp />}
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
        <ListGroupSettings
          groupId={subGroup.id}
          settings={subGroup.settings}
          properties={properties}
          editGroupSettings={editGroupSettings}
          sortItems={sortItems}
          deleteGroup={deleteGroup}
        ></ListGroupSettings>
      </div>
      {subGroup.size !== 0 && (
        <ul className={'list-group list-group-flush' + (subGroup.settings.collapse ? ' collapse' : '')}>
          {items.map((item) => {
            return (
              <ListItem
                key={item.id}
                item={item}
                parentGroup={subGroup.id}
                groupSettings={subGroup.settings}
                editItem={editItem}
                deleteItem={deleteItem}
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
