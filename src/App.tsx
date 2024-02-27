import './App.css';
import { useState } from 'react';
import ListGroup from './components/ListGroup';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import ListData from './interfaces/IListData';
import Item from './interfaces/IItem';

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
    let oldGroups = listData.groups;
    oldGroups.push(groupName);
    setListData({ groups: oldGroups, items: listData.items });
  };

  const addItem = (itemName: string, itemGroups: string[]) => {
    let oldItems = listData.items;
    oldItems.push({ name: itemName, groups: itemGroups, groupPositions: new Map(itemGroups.map((group) => [group, 0])), properties: {} });
    setListData({ groups: listData.groups, items: listData.items });
  };

  const editGroupPos = (item: Item, group: string, newPos: number) => {
    let oldItems = listData.items;
    const changedItemIndex = oldItems.indexOf(item);

    oldItems[changedItemIndex].groupPositions.set(group, newPos);

    for (let i = 0; i < oldItems.length; i++) {
      const groupPos = oldItems[i].groupPositions.get(group);
      if (oldItems[i].groups.includes(group) && groupPos !== undefined && groupPos >= newPos && i !== changedItemIndex) {
        oldItems[i].groupPositions.set(group, groupPos + 1);
      }
    }
    setListData({ groups: listData.groups, items: oldItems });
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
