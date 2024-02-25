import './App.css';
import { useState } from 'react';
import ListGroup from './components/ListGroup';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import ListData from './interfaces/IListData';

function App() {
  const [listTitle, setListTitle] = useState('title');
  const [listData, setListData] = useState({ groups: ['None'], items: [] } as ListData);

  const addGroup = (groupName: string) => {
    let oldGroups = listData.groups;
    oldGroups.push(groupName);
    setListData({ groups: oldGroups, items: listData.items });
  };

  const addItem = (itemName: string, itemGroups: string[]) => {
    let oldItems = listData.items;
    oldItems.push({ name: itemName, groups: itemGroups, groupPositions: [] });
    setListData({ groups: listData.groups, items: listData.items });
  };

  return (
    <>
      <ListTitle editTitle={setListTitle}>{listTitle}</ListTitle>
      <ListControls groups={listData.groups} addGroup={addGroup} addItem={addItem}></ListControls>
      <ListGroup listData={listData}></ListGroup>
    </>
  );
}

export default App;
