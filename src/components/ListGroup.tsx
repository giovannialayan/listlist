import { Dropdown, DropdownButton } from 'react-bootstrap';
import ListItem from './ListItem';
import { useState } from 'react';
import ListData from '../interfaces/IListData';
import Item from '../interfaces/IItem';

interface Props {
  listData: ListData;
  editGroupPos: (item: Item, group: string, newPos: number) => void;
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
  console.log(listData);
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
                <p>{group}</p>
                <ul className='list-group list-group-flush'>
                  {[...listData.items]
                    .sort((a, b) => groupPositionSort(a, b, group))
                    .map((item) => {
                      return (
                        item.groups.includes(group) && (
                          <ListItem
                            key={item.name}
                            item={item.name}
                            parentGroup={group}
                            index={item.groupPositions.get(group) !== undefined ? (item.groupPositions.get(group) as number) : -1}
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
