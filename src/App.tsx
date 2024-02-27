import './App.css';
import { useState } from 'react';
import ListGroup from './components/ListGroup';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import ListData from './interfaces/IListData';
import Item from './interfaces/IItem';
import { groupPositionSort } from './utils';

function App() {
  const initData = {
    groups: ['Default', 'a', 'b', 'c'],
    items: [
      {
        name: 'first',
        groups: ['Default', 'a'],
        groupPositions: new Map([
          ['Default', 0],
          ['a', 0],
        ]),
      },
      {
        name: 'second',
        groups: ['Default', 'b'],
        groupPositions: new Map([
          ['Default', 1],
          ['b', 0],
        ]),
      },
      {
        name: 'third',
        groups: ['Default', 'c'],
        groupPositions: new Map([
          ['Default', 2],
          ['c', 0],
        ]),
      },
    ],
  };

  const [listTitle, setListTitle] = useState('title');
  // const [listData, setListData] = useState({ groups: ['Default'], items: [] } as ListData);
  const [listData, setListData] = useState(initData as ListData);

  const addGroup = (groupName: string) => {
    listData.groups.push(groupName);
    setListData({ groups: listData.groups, items: listData.items });
  };

  const addItem = (itemName: string, itemGroups: string[]) => {
    listData.items.push({ name: itemName, groups: itemGroups, groupPositions: new Map(itemGroups.map((group) => [group, 0])), properties: {} });
    setListData({ groups: listData.groups, items: listData.items });
  };

  const editGroupPos = (item: Item, group: string, prevPos: number, newPos: number) => {
    let itemsInGroup = listData.items.filter((item) => item.groups.includes(group));

    itemsInGroup.sort((a, b) => groupPositionSort(a, b, group));

    itemsInGroup.splice(prevPos, 1);
    itemsInGroup.splice(newPos, 0, item);

    for (let i = 0; i < itemsInGroup.length; i++) {
      itemsInGroup[i].groupPositions.set(group, i);
    }

    setListData({ groups: listData.groups, items: listData.items });
  };

  return (
    <>
      <ListTitle editTitle={setListTitle}>{listTitle}</ListTitle>
      <ListControls groups={listData.groups} addGroup={addGroup} addItem={addItem}></ListControls>
      <ListGroup listData={listData} editGroupPos={editGroupPos}></ListGroup>
    </>
  );
}

export default App;
