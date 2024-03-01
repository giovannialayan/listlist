import { Dropdown, DropdownButton } from 'react-bootstrap';
import ListItem from './ListItem';
import { useState } from 'react';
import ListData from '../interfaces/IListData';
import Item from '../interfaces/IItem';
import { groupPositionSort } from '../utils';
import '../styles/ListGroup.css';

interface Props {
  listData: ListData;
  editGroupPos: (item: Item, group: number, prevPos: number, newPos: number) => void;
  editItem: (item: Item, editedItem: Item) => void;
}

function ListGroup({ listData, editGroupPos, editItem }: Props) {
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
          {listData.groups.map((group, index) => {
            return (
              group.parent === -1 && (
                <Dropdown.Item key={index} onClick={() => setCurrentGroup(group.name)}>
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
              <div key={group.id} className='group'>
                <h5>{group.name}</h5>
                {/* start group list */}
                {group.size !== 0 && (
                  <ul className='list-group list-group-flush'>
                    {[...listData.items]
                      .sort((a, b) => groupPositionSort(a, b, group.id))
                      .map((item) => {
                        return (
                          item.groups.includes(group.id) && (
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
                          )
                        );
                      })}
                  </ul>
                )}
                {/* end group list */}
                {/* start sub group list */}
                {group.subGroups.map((subGroupId) => {
                  return (
                    <div key={group.name + listData.groups[subGroupId]} className='subGroup'>
                      <p>{listData.groups[subGroupId].name}</p>
                      <ul className='list-group list-group-flush'>
                        {[...listData.items]
                          .sort((a, b) => groupPositionSort(a, b, subGroupId))
                          .map((item) => {
                            return (
                              item.groups.includes(subGroupId) && (
                                <ListItem
                                  key={item.id}
                                  item={item}
                                  parentGroup={subGroupId}
                                  editItem={editItem}
                                  onDragStart={onDragStart}
                                  onDragEnter={onDragEnter}
                                  onDragEnd={onDragEnd}
                                  dragOver={subGroupId === dropGroup && item == dragOverItem}
                                ></ListItem>
                              )
                            );
                          })}
                      </ul>
                    </div>
                  );
                })}
                {/* end sub group list */}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default ListGroup;
