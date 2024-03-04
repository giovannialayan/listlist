import { useState } from 'react';
import ListItem from './ListItem';
import Item from '../interfaces/IItem';
import Group from '../interfaces/IGroup';

interface Props {
  group: Group;
  subGroups: Group[];
  items: Item[];
  subGroupItems: Item[][];
  editItem: (item: Item, editedItem: Item) => void;
  editGroupPos: (item: Item, group: number, prevPos: number, newPos: number) => void;
}

function ListGroup({ group, subGroups, items, subGroupItems, editItem, editGroupPos }: Props) {
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
    <div className='group'>
      <h5>{group.name}</h5>
      {/* start group list */}
      {group.size !== 0 && (
        <ul className='list-group list-group-flush'>
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
      {/* end group list */}
      {/* start sub group list */}
      {subGroups.map((subGroup, index) => {
        return (
          <div key={subGroup.id} className='subGroup'>
            <p>{subGroup.name}</p>
            {subGroup.size !== 0 && (
              <ul className='list-group list-group-flush'>
                {subGroupItems[index].map((item) => {
                  return (
                    <ListItem
                      key={item.id}
                      item={item}
                      parentGroup={subGroup.id}
                      editItem={editItem}
                      onDragStart={onDragStart}
                      onDragEnter={onDragEnter}
                      onDragEnd={onDragEnd}
                      dragOver={subGroup.id === dropGroup && item == dragOverItem}
                    ></ListItem>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
      {/* end sub group list */}
    </div>
  );
}

export default ListGroup;
