import { useState } from 'react';
import ListItem from './ListItem';
import { Item, Group, GroupSettings } from '../../interfaces';
import { MdDragHandle, MdEdit } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import '../../styles/ListGroup.css';
import ListSubGroup from './ListSubGroup';
import ListGroupSettings from './ListGroupSettings';

interface Props {
  group: Group;
  subGroups: Group[];
  items: Item[];
  subGroupItems: { [key: string]: Item[] };
  properties: string[];
  allGroups: Group[];
  dropGroup: number;
  dragOverItem: Item;
  dragOverGroup: number;
  groupDropParent: number;
  editItem: (item: number, editedItem: Item) => void;
  deleteItem: (itemId: number, groupId: number) => void;
  addItemToGroup: (itemId: number, groupId: number) => void;
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

function ListGroup({
  group,
  subGroups,
  items,
  subGroupItems,
  properties,
  allGroups,
  dropGroup,
  dragOverItem,
  dragOverGroup,
  groupDropParent,
  editItem,
  deleteItem,
  addItemToGroup,
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
        {!editMode && <p className='fs-3 fw-bold mb-0'>{group.name}</p>}
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
            editGroupSettings(group.id, { ...group.settings, collapse: !group.settings.collapse });
          }}
        >
          {group.settings.collapse && <IoIosArrowDown />}
          {!group.settings.collapse && <IoIosArrowUp />}
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
          groupId={group.id}
          settings={group.settings}
          properties={properties}
          editGroupSettings={editGroupSettings}
          sortItems={sortItems}
          deleteGroup={(id) => {
            deleteGroup(id);
            setEditMode(false);
          }}
        ></ListGroupSettings>
      </div>
      <div className={' flex-column align-items-center' + (group.settings.collapse ? ' collapse' : 'd-flex')}>
        {group.size !== 0 && (
          <ul className={'list-group list-group-flush'}>
            {items.map((item) => {
              return (
                <ListItem
                  key={item.id}
                  item={item}
                  parentGroup={group.id}
                  groupSettings={group.settings}
                  allGroups={allGroups}
                  editItem={editItem}
                  deleteItem={deleteItem}
                  addItemToGroup={addItemToGroup}
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
              properties={properties}
              allGroups={allGroups}
              dropGroup={dropGroup}
              dragOverItem={dragOverItem}
              editItem={editItem}
              deleteItem={deleteItem}
              addItemToGroup={addItemToGroup}
              deleteGroup={deleteGroup}
              editGroup={editGroup}
              editGroupSettings={editGroupSettings}
              sortItems={sortItems}
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
