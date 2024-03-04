import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useState } from 'react';
import ListData from '../interfaces/IListData';
import Item from '../interfaces/IItem';
import { getGroupItems, getSubGroupsAsGroups, groupPositionSort } from '../utils';
import '../styles/ListGroup.css';
import ListGroup from './ListGroup';

interface Props {
  listData: ListData;
  editGroupPos: (item: Item, group: number, prevPos: number, newPos: number) => void;
  editItem: (item: Item, editedItem: Item) => void;
}

function List({ listData, editGroupPos, editItem }: Props) {
  const [currentGroup, setCurrentGroup] = useState('');

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
                editGroupPos={editGroupPos}
              ></ListGroup>
            )
          );
        })}
      </div>
    </div>
  );
}

export default List;
