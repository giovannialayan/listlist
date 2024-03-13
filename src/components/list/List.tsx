import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import { ListData, Item, Group, GroupSettings } from '../../interfaces';
import { getGroupItems, getParentGroups, getSubGroupsAsGroups, groupPositionSort, itemPositionSort } from '../../utils';
import '../../styles/ListGroup.css';
import ListGroup from './ListGroup';

interface Props {
  listData: ListData;
  editItemGroupPos: (item: Item, group: number, prevPos: number, newPos: number) => void;
  editItem: (item: number, editedItem: Item) => void;
  deleteItem: (itemId: number, groupId: number) => void;
  editGroup: (groupId: number, editedGroup: Group) => void;
  deleteGroup: (groupId: number) => void;
  editGroupPos: (groupId: number, prevPos: number, newPos: number) => void;
  editGroupSettings: (groupId: number, newSettings: GroupSettings) => void;
  sortItems: (groupId: number) => void;
}

function List({ listData, editItemGroupPos, editItem, deleteItem, editGroup, deleteGroup, editGroupPos, editGroupSettings, sortItems }: Props) {
  const [currentGroup, setCurrentGroup] = useState('');

  const [dropGroup, setDropGroup] = useState(-1);
  const [draggingItem, setDraggingItem] = useState({} as Item);
  const [dragOverItem, setDragOverItem] = useState({} as Item);

  const [subGroupDropParent, setSubGroupDropParent] = useState(-1);
  const [draggingGroup, setDraggingGroup] = useState(-1);
  const [dragOverGroup, setDragOverGroup] = useState(-1);

  const onItemDragStart = (item: Item, parentGroup: number, event: React.DragEvent) => {
    setDraggingItem(item);
    setDropGroup(parentGroup);

    event.stopPropagation();
  };

  const onItemDragEnter = (item: Item, parentGroup: number, event: React.DragEvent) => {
    if (parentGroup === dropGroup) {
      setDragOverItem(item);
    }

    event.stopPropagation();
  };

  const onItemDragEnd = (event: React.DragEvent) => {
    const dropPos = dragOverItem.groupPositions[dropGroup];
    const dragPos = draggingItem.groupPositions[dropGroup];

    if (dropPos !== undefined && dragPos !== undefined) {
      editItemGroupPos(draggingItem, dropGroup, dragPos, dropPos);
      setDragOverItem({} as Item);
      setDropGroup(-1);
    }

    event.stopPropagation();
  };

  const onGroupDragStart = (groupId: number, parentGroup: number, event: React.DragEvent) => {
    setDraggingGroup(groupId);
    setSubGroupDropParent(parentGroup);

    event.stopPropagation();
  };

  const onGroupDragEnter = (groupId: number, parentGroup: number, event: React.DragEvent) => {
    if (parentGroup === subGroupDropParent && draggingGroup !== -1) {
      setDragOverGroup(groupId);
    }

    event.stopPropagation();
  };

  const onGroupDragEnd = (event: React.DragEvent) => {
    const dropPos = listData.groups[dragOverGroup].position;
    const dragPos = listData.groups[draggingGroup].position;

    editGroupPos(draggingGroup, dragPos, dropPos);
    setDragOverGroup(-1);
    setDraggingGroup(-1);

    event.stopPropagation();
  };

  return (
    <div>
      <div>
        <DropdownButton title={`Group: ${currentGroup === '' ? 'All Groups' : currentGroup}`}>
          <Dropdown.Item onClick={() => setCurrentGroup('')}>All Groups</Dropdown.Item>
          {listData.groups.map((group) => {
            return (
              group.parent === -1 && (
                <Dropdown.Item key={group.id} onClick={() => setCurrentGroup(group.name)}>
                  {group.name}
                </Dropdown.Item>
              )
            );
          })}
        </DropdownButton>
      </div>
      <div>
        {getParentGroups(listData.groups)
          .sort((a, b) => groupPositionSort(a, b))
          .map((group) => {
            return (
              (group.name === currentGroup || currentGroup === '') && (
                <ListGroup
                  key={group.id}
                  group={group}
                  subGroups={getSubGroupsAsGroups(listData.groups, group.subGroups).sort((a, b) => groupPositionSort(a, b))}
                  items={getGroupItems(listData.items, group.id).sort((a, b) => itemPositionSort(a, b, group.id))}
                  subGroupItems={group.subGroups.reduce((acc, cur) => {
                    return { ...acc, [cur]: getGroupItems(listData.items, cur).sort((a, b) => itemPositionSort(a, b, cur)) };
                  }, {})}
                  properties={listData.properties}
                  editItem={editItem}
                  deleteItem={deleteItem}
                  editGroup={editGroup}
                  deleteGroup={deleteGroup}
                  editGroupSettings={editGroupSettings}
                  sortItems={sortItems}
                  onItemDragStart={onItemDragStart}
                  onItemDragEnter={onItemDragEnter}
                  onItemDragEnd={onItemDragEnd}
                  dropGroup={dropGroup}
                  dragOverItem={dragOverItem}
                  onGroupDragStart={onGroupDragStart}
                  onGroupDragEnter={onGroupDragEnter}
                  onGroupDragEnd={onGroupDragEnd}
                  groupDropParent={subGroupDropParent}
                  dragOverGroup={dragOverGroup}
                ></ListGroup>
              )
            );
          })}
      </div>
    </div>
  );
}

export default List;
