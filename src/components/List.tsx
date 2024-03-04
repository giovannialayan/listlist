import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import { ListData, Item, Group } from '../interfaces';
import { getGroupItems, getSubGroupsAsGroups, groupPositionSort } from '../utils';
import '../styles/ListGroup.css';
import ListGroup from './ListGroup';

interface Props {
  listData: ListData;
  editGroupPos: (item: Item, group: number, prevPos: number, newPos: number) => void;
  editItem: (item: Item, editedItem: Item) => void;
  editGroup: (groupId: number, editedGroup: Group) => void;
}

function List({ listData, editGroupPos, editItem, editGroup }: Props) {
  const [currentGroup, setCurrentGroup] = useState('');

  const [dropGroup, setDropGroup] = useState(-1);
  const [draggingItem, setDraggingItem] = useState({} as Item);
  const [dragOverItem, setDragOverItem] = useState({} as Item);

  const onDragStart = (item: Item, parentGroup: number) => {
    setDraggingItem(item);
    setDropGroup(parentGroup);
  };

  const onDragEnter = (item: Item, parentGroup: number) => {
    if (parentGroup === dropGroup) {
      setDragOverItem(item);
    }
  };

  const onDragEnd = () => {
    const dropPos = dragOverItem.groupPositions.get(dropGroup);
    const dragPos = draggingItem.groupPositions.get(dropGroup);

    if (dropPos !== undefined && dragPos !== undefined) {
      editGroupPos(draggingItem, dropGroup, dragPos, dropPos);
      setDragOverItem({} as Item);
    }
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
        {listData.groups.map((group) => {
          return (
            (group.name === currentGroup || currentGroup === '') &&
            group.parent == -1 && (
              <ListGroup
                key={group.id}
                group={group}
                subGroups={getSubGroupsAsGroups(listData.groups, group.subGroups)}
                items={getGroupItems(listData.items, group.id).sort((a, b) => groupPositionSort(a, b, group.id))}
                subGroupItems={group.subGroups.map((subGroupId) => {
                  return getGroupItems(listData.items, subGroupId).sort((a, b) => groupPositionSort(a, b, subGroupId));
                })}
                editItem={editItem}
                editGroup={editGroup}
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
                onDragEnd={onDragEnd}
                dropGroup={dropGroup}
                dragOverItem={dragOverItem}
              ></ListGroup>
            )
          );
        })}
      </div>
    </div>
  );
}

export default List;
