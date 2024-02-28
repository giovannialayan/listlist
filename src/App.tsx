import './App.css';
import { useState } from 'react';
import ListGroup from './components/ListGroup';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import ListData from './interfaces/IListData';
import Item from './interfaces/IItem';
import { groupPositionSort } from './utils';

function App() {
  const initData: ListData = {
    groups: ['Default', 'a', 'b', 'c'],
    items: [
      {
        name: 'first',
        groups: ['Default', 'a'],
        groupPositions: new Map([
          ['Default', 0],
          ['a', 0],
        ]),
        properties: [],
      },
      {
        name: 'second',
        groups: ['Default', 'b'],
        groupPositions: new Map([
          ['Default', 1],
          ['b', 0],
        ]),
        properties: [],
      },
      {
        name: 'third',
        groups: ['Default', 'c'],
        groupPositions: new Map([
          ['Default', 2],
          ['c', 0],
        ]),
        properties: [],
      },
    ],
    subGroups: [],
    properties: [],
  };

  const [listTitle, setListTitle] = useState('title');
  // const [listData, setListData] = useState({ groups: ['Default'], items: [] } as ListData);
  const [listData, setListData] = useState(initData);

  const addGroup = (groupName: string) => {
    listData.groups.push(groupName);
    setListData({ groups: listData.groups, items: listData.items, subGroups: listData.subGroups, properties: listData.properties });
  };

  const addItem = (itemName: string, itemGroups: string[]) => {
    listData.items.push({ name: itemName, groups: itemGroups, groupPositions: new Map(itemGroups.map((group) => [group, 0])), properties: [] });
    setListData({ groups: listData.groups, items: listData.items, subGroups: listData.subGroups, properties: listData.properties });
  };

  const addProperty = (propertyName: string) => {
    listData.properties.push(propertyName);
    setListData({ groups: listData.groups, items: listData.items, subGroups: listData.subGroups, properties: listData.properties });
  };

  const editGroupPos = (item: Item, group: string, prevPos: number, newPos: number) => {
    let itemsInGroup = listData.items.filter((item) => item.groups.includes(group));

    itemsInGroup.sort((a, b) => groupPositionSort(a, b, group));

    itemsInGroup.splice(prevPos, 1);
    itemsInGroup.splice(newPos, 0, item);

    for (let i = 0; i < itemsInGroup.length; i++) {
      itemsInGroup[i].groupPositions.set(group, i);
    }

    setListData({ groups: listData.groups, items: listData.items, subGroups: listData.subGroups, properties: listData.properties });
  };

  return (
    <>
      <ListTitle editTitle={setListTitle}>{listTitle}</ListTitle>
      <ListControls groups={listData.groups} addGroup={addGroup} addItem={addItem} addProperty={addProperty}></ListControls>
      <ListGroup listData={listData} editGroupPos={editGroupPos}></ListGroup>
    </>
  );
}

export default App;
