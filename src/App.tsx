import './App.css';
import { useState } from 'react';
import ListGroup from './components/ListGroup';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import ListData from './interfaces/IListData';

function App() {
  const [listTitle, setListTitle] = useState('title');
  const [listData, setListData] = useState({ groups: ['None'], listItems: [] } as ListData);

  const addGroup = (groupName: string) => {
    let oldGroups = listData.groups;
    oldGroups.push(groupName);
    setListData({ groups: oldGroups, listItems: listData.listItems });
  };

  return (
    <>
      <ListTitle editTitle={setListTitle}>{listTitle}</ListTitle>
      <ListControls addGroup={addGroup}></ListControls>
      <ListGroup listData={[{ name: 'one', id: '1', b: 'a' }, { name: 'two' }]} listGroups={listData.groups}></ListGroup>
    </>
  );
}

export default App;
