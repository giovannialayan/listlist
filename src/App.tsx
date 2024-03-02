import './App.css';
import { useState } from 'react';
import ListGroup from './components/ListGroup';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import ListData from './interfaces/IListData';
import Item from './interfaces/IItem';
import ItemProperty from './interfaces/IItemProperty';
import { groupPositionSort } from './utils';

function App() {
  const initData: ListData = {
    items: [
      {
        name: 'first',
        id: 0,
        groups: [0, 1],
        groupPositions: new Map([
          [0, 0],
          [1, 0],
        ]),
        properties: [
          { name: 'notes', data: 'no' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'second',
        id: 1,
        groups: [0, 2],
        groupPositions: new Map([
          [0, 1],
          [2, 0],
        ]),
        properties: [
          { name: 'notes', data: '' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'third',
        id: 2,
        groups: [0, 3],
        groupPositions: new Map([
          [0, 2],
          [3, 0],
        ]),
        properties: [
          { name: 'notes', data: '' },
          { name: 'prop', data: '' },
        ],
      },
    ],
    properties: ['notes', 'prop'],
    groups: [
      { name: 'Default', id: 0, subGroups: [], size: 3, parent: -1 },
      { name: 'a', id: 1, subGroups: [2], size: 1, parent: -1 },
      { name: 'b', id: 2, subGroups: [], size: 1, parent: 1 },
      { name: 'c', id: 3, subGroups: [], size: 1, parent: -1 },
    ],
  };

  const [listTitle, setListTitle] = useState('title');
  // const [listData, setListData] = useState({ groups: ['Default'], items: [] } as ListData);
  const [listData, setListData] = useState(initData);

  const addGroup = (groupName: string, parentGroup: number) => {
    listData.groups.push({ name: groupName, id: listData.groups.length, subGroups: [], size: 0, parent: parentGroup });

    if (parentGroup !== -1) {
      listData.groups[parentGroup].subGroups.push(listData.groups.length - 1);
    }

    setListData({
      items: listData.items,
      properties: listData.properties,
      groups: listData.groups,
    });
  };

  const addItem = (itemName: string, itemGroups: number[], itemProperties: ItemProperty[]) => {
    listData.items.push({
      name: itemName,
      id: listData.items.length,
      groups: itemGroups,
      groupPositions: new Map(
        itemGroups.map((itemGroup) => {
          // const groupIndex = listData.groups.findIndex((group) => group.name === itemGroup);
          const lastIndex = listData.groups[itemGroup].size;
          listData.groups[itemGroup].size++;
          return [itemGroup, lastIndex];
        })
      ),
      properties: itemProperties,
    });
    setListData({
      items: listData.items,
      properties: listData.properties,
      groups: listData.groups,
    });
  };

  const addProperty = (propertyName: string) => {
    listData.properties.push(propertyName);
    setListData({
      items: listData.items,
      properties: listData.properties,
      groups: listData.groups,
    });
  };

  const editGroupPos = (item: Item, groupId: number, prevPos: number, newPos: number) => {
    let itemsInGroup = listData.items.filter((item) => item.groups.includes(groupId));

    itemsInGroup.sort((a, b) => groupPositionSort(a, b, groupId));

    itemsInGroup.splice(prevPos, 1);
    itemsInGroup.splice(newPos, 0, item);

    for (let i = 0; i < itemsInGroup.length; i++) {
      itemsInGroup[i].groupPositions.set(groupId, i);
    }

    setListData({
      items: listData.items,
      properties: listData.properties,
      groups: listData.groups,
    });
  };

  const editItem = (item: Item, editedItem: Item) => {
    const itemIndex = listData.items.indexOf(item);
    listData.items[itemIndex] = editedItem;

    setListData({
      items: listData.items,
      properties: listData.properties,
      groups: listData.groups,
    });
  };

  //remove item note: keep item.id same as index in listdata.items

  return (
    <>
      <ListTitle editTitle={setListTitle}>{listTitle}</ListTitle>
      <ListControls
        groups={listData.groups}
        addGroup={addGroup}
        properties={listData.properties}
        addItem={addItem}
        addProperty={addProperty}
      ></ListControls>
      <ListGroup listData={listData} editGroupPos={editGroupPos} editItem={editItem}></ListGroup>
    </>
  );
}

export default App;
