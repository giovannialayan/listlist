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
  allGroups: Group[];
  dropGroup: number;
  dragOverItem: Item;
  groupDragOver: boolean;
  editItem: (item: number, editedItem: Item) => void;
  deleteItem: (itemId: number, groupId: number) => void;
  addItemToGroup: (itemId: number, groupId: number) => void;
  editItemGroupPos: (editItem: Item, groupId: number, prevPos: number, newPos: number) => void;
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
  setSidebar: (item: Item, parentGroup: number) => void;
}

function ListSubGroup({
  subGroup,
  items,
  properties,
  allGroups,
  dropGroup,
  dragOverItem,
  groupDragOver,
  editItem,
  deleteItem,
  addItemToGroup,
  editItemGroupPos,
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
  setSidebar,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div
      className={'subGroup flex-grow-1' + (groupDragOver ? ' groupDragOver' : '')}
      onDragStart={(e) => onGroupDragStart(subGroup.id, subGroup.parent, e)}
      onDragEnter={(e) => onGroupDragEnter(subGroup.id, subGroup.parent, e)}
      onDragEnd={onGroupDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='groupTop'>
        <div role='button' draggable className={subGroup.settings.numbered ? 'dragHandleLarge' : ''}>
          <MdDragHandle size={'1.5em'} />
        </div>
        {!editMode && <p className='fs-5 fw-bold mb-0'>{subGroup.name}</p>}
        {editMode && (
          <input
            value={subGroup.name}
            onChange={(e) => {
              editGroup(subGroup.id, { ...subGroup, name: e.currentTarget.value });
            }}
          ></input>
        )}
        <div className='d-flex flex-row gap-1'>
          <a
            role='button'
            onClick={() => {
              editGroupSettings(subGroup.id, { ...subGroup.settings, collapse: !subGroup.settings.collapse });
            }}
          >
            {subGroup.settings.collapse && <IoIosArrowDown size={'1.25em'} />}
            {!subGroup.settings.collapse && <IoIosArrowUp size={'1.25em'} />}
          </a>
          <a
            role='button'
            onClick={() => {
              setEditMode(!editMode);
            }}
          >
            <MdEdit size={'1.25em'} />
          </a>
        </div>
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
                allGroups={allGroups}
                editItem={editItem}
                deleteItem={deleteItem}
                addItemToGroup={addItemToGroup}
                editItemGroupPos={editItemGroupPos}
                onDragStart={onItemDragStart}
                onDragEnter={onItemDragEnter}
                onDragEnd={onItemDragEnd}
                setSidebar={setSidebar}
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
