import './App.css';
import { useState } from 'react';
import List from './components/List';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import { ListData, Item, ItemProperty, Group } from './interfaces';
import { groupPositionSort } from './utils';

function App() {
  const initData: ListData = {
    title: 'title',
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
  // const [listData, setListData] = useState({ groups: ['Default'], items: [] } as ListData);
  const [listData, setListData] = useState(initData);

  const addGroup = (groupName: string, parentGroup: number) => {
    const nextGroups = [...listData.groups, { name: groupName, id: listData.groups.length, subGroups: [], size: 0, parent: parentGroup }];

    if (parentGroup !== -1) {
      nextGroups[parentGroup].subGroups.push(nextGroups.length - 1);
    }

    setListData({
      ...listData,
      groups: nextGroups,
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
      ...listData,
      items: listData.items,
    });
  };

  const addProperty = (propertyName: string) => {
    listData.properties.push(propertyName);
    setListData({
      ...listData,
      properties: listData.properties,
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
      ...listData,
      items: listData.items,
    });
  };

  const editItem = (item: Item, editedItem: Item) => {
    const itemIndex = listData.items.indexOf(item);
    listData.items[itemIndex] = editedItem;

    setListData({
      ...listData,
      items: listData.items,
    });
  };

  const editGroup = (groupId: number, editedGroup: Group) => {
    setListData({
      ...listData,
      groups: listData.groups.map((group) => {
        if (group.id === groupId) {
          return editedGroup;
        } else {
          return group;
        }
      }),
    });
  };

  const editTitle = (title: string) => {
    setListData({ ...listData, title });
  };

  //remove item note: keep item.id same as index in listdata.items

  return (
    <>
      <ListTitle editTitle={editTitle}>{listData.title}</ListTitle>
      <ListControls
        groups={listData.groups}
        addGroup={addGroup}
        properties={listData.properties}
        addItem={addItem}
        addProperty={addProperty}
      ></ListControls>
      <List listData={listData} editGroupPos={editGroupPos} editItem={editItem} editGroup={editGroup}></List>
    </>
  );
}

export default App;
