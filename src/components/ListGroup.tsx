import { useState } from 'react';
import ListItem from './ListItem';
import Item from '../interfaces/IItem';
import Group from '../interfaces/IGroup';
import { MdEdit } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import '../styles/ListGroup.css';

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

  const [editModes, setEditModes] = useState(Array(subGroups.length + 1).fill(false));
  const [showGroup, setShowGroup] = useState(Array(subGroups.length + 1).fill(true));

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
      <div className='groupTop'>
        <h5>{group.name}</h5>
        <a
          onClick={() => {
            setShowGroup(
              showGroup.map((show, index) => {
                if (index === 0) {
                  return !show;
                } else {
                  return show;
                }
              })
            );
          }}
        >
          {!showGroup[0] && <IoIosArrowDown />}
          {showGroup[0] && <IoIosArrowUp />}
        </a>
        <a
          onClick={() => {
            setEditModes(
              editModes.map((mode, index) => {
                if (index === 0) {
                  return !mode;
                } else {
                  mode;
                }
              })
            );
          }}
        >
          <MdEdit />
        </a>
      </div>
      <div className={editModes[0] ? '' : 'collapse'}>
        <p>show numbers</p>
        <p>sort by (dropdown property) (dropdown alphabetically) (sort button)</p>
        <p>(checkbox) auto sort</p>
      </div>
      {/* start group list */}
      {group.size !== 0 && (
        <ul className={'list-group list-group-flush' + (showGroup[0] ? '' : ' collapse')}>
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
            <div className='groupTop'>
              <p>{subGroup.name}</p>
              <a
                onClick={() => {
                  setShowGroup(
                    showGroup.map((show, jindex) => {
                      if (jindex === index + 1) {
                        return !show;
                      } else {
                        return show;
                      }
                    })
                  );
                }}
              >
                {!showGroup[index + 1] && <IoIosArrowDown />}
                {showGroup[index + 1] && <IoIosArrowUp />}
              </a>
              <a
                onClick={() => {
                  setEditModes(
                    editModes.map((mode, jindex) => {
                      if (jindex === index + 1) {
                        return !mode;
                      } else {
                        mode;
                      }
                    })
                  );
                }}
              >
                <MdEdit />
              </a>
            </div>
            <div className={editModes[index + 1] ? '' : 'collapse'}>
              <p>show numbers</p>
              <p>sort by (dropdown property) (dropdown alphabetically) (sort button)</p>
              <p>(checkbox) auto sort</p>
            </div>
            {subGroup.size !== 0 && (
              <ul className={'list-group list-group-flush' + (showGroup[index + 1] ? '' : ' collapse')}>
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
