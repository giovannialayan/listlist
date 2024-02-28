import { Dropdown, DropdownButton } from 'react-bootstrap';
import ListItem from './ListItem';
import { useState } from 'react';
import ListData from '../interfaces/IListData';
import Item from '../interfaces/IItem';

interface Props {
  listData: ListData;
  editGroupPos: (item: Item, group: string, prevPos: number, newPos: number) => void;
}

const groupPositionSort = (itemA: Item, itemB: Item, group: string) => {
  const aPos = itemA.groupPositions.get(group);
  const bPos = itemB.groupPositions.get(group);
  if (aPos !== undefined && bPos !== undefined) {
    return aPos - bPos;
  } else {
    return 0;
  }
};

function ListGroup({ listData, editGroupPos }: Props) {
  const [currentGroup, setCurrentGroup] = useState('');
  const [dropGroup, setDropGroup] = useState('');
  const [draggingItem, setDraggingItem] = useState({} as Item);
  const [dragOverItem, setDragOverItem] = useState({} as Item);

  const onDragStart = (item: Item, parentGroup: string) => {
    setDraggingItem(item);
    setDropGroup(parentGroup);
  };

  const onDragEnter = (item: Item, parentGroup: string) => {
    if (parentGroup === dropGroup) {
      setDragOverItem(item);
    }
  };

  const onDragEnd = () => {
    const dropPos = dragOverItem.groupPositions.get(dropGroup);
    const dragPos = draggingItem.groupPositions.get(dropGroup);
    console.log(draggingItem, dragOverItem, dropPos);
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
              <Dropdown.Item key={index} onClick={() => setCurrentGroup(group)}>
                {group}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
      <div>
        {listData.groups.map((group, index) => {
          return (
            (group === currentGroup || currentGroup === '') && (
              <div key={index}>
                <h5>{group}</h5>
                <ul className='list-group list-group-flush'>
                  {[...listData.items]
                    .sort((a, b) => groupPositionSort(a, b, group))
                    .map((item) => {
                      return (
                        item.groups.includes(group) && (
                          <ListItem
                            key={item.name}
                            item={item}
                            parentGroup={group}
                            onDragStart={onDragStart}
                            onDragEnter={onDragEnter}
                            onDragEnd={onDragEnd}
                            dragOver={group === dropGroup && item == dragOverItem}
                          ></ListItem>
                        )
                      );
                    })}
                </ul>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default ListGroup;
