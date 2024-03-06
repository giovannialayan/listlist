import './App.css';
import { useState } from 'react';
import List from './components/List';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import { ListData, Item, ItemProperty, Group } from './interfaces';
import { getNumParentGroups, getParentGroups, getSubGroupsAsGroups, groupPositionSort, itemPositionSort } from './utils';

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
      {
        name: 'fourth',
        id: 3,
        groups: [4],
        groupPositions: new Map([[4, 0]]),
        properties: [
          { name: 'notes', data: '' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'fifth',
        id: 4,
        groups: [5],
        groupPositions: new Map([[5, 0]]),
        properties: [
          { name: 'notes', data: '' },
          { name: 'prop', data: '' },
        ],
      },
    ],
    properties: ['notes', 'prop'],
    groups: [
      { name: 'Default', id: 0, subGroups: [], size: 3, parent: -1, position: 0 },
      { name: 'a', id: 1, subGroups: [2, 4, 5], size: 1, parent: -1, position: 1 },
      { name: 'b', id: 2, subGroups: [], size: 1, parent: 1, position: 0 },
      { name: 'c', id: 3, subGroups: [], size: 1, parent: -1, position: 2 },
      { name: 'b2', id: 4, subGroups: [], size: 1, parent: 1, position: 1 },
      { name: 'b3', id: 5, subGroups: [], size: 1, parent: 1, position: 2 },
    ],
  };
  // const [listData, setListData] = useState({ groups: ['Default'], items: [] } as ListData);
  const [listData, setListData] = useState(initData);

  const addGroup = (groupName: string, parentGroup: number) => {
    const newGroup = {
      name: groupName,
      id: listData.groups.length,
      subGroups: [],
      size: 0,
      parent: parentGroup,
      position: getNumParentGroups(listData.groups),
    };

    const nextGroups = [...listData.groups, newGroup];

    if (parentGroup !== -1) {
      nextGroups[parentGroup].subGroups.push(newGroup.id);
      nextGroups[newGroup.id].position = nextGroups[parentGroup].subGroups.length - 1;
    }

    setListData({
      ...listData,
      groups: nextGroups,
    });
  };

  const addItem = (itemName: string, itemGroups: number[], itemProperties: ItemProperty[]) => {
    const newItem = {
      name: itemName,
      id: listData.items.length,
      groups: itemGroups,
      groupPositions: new Map(
        itemGroups.map((itemGroup) => {
          const lastIndex = listData.groups[itemGroup].size;
          listData.groups[itemGroup].size++;
          return [itemGroup, lastIndex];
        })
      ),
      properties: itemProperties,
    };

    setListData({
      ...listData,
      items: [...listData.items, newItem],
    });
  };

  const addProperty = (propertyName: string) => {
    setListData({
      ...listData,
      properties: [...listData.properties, propertyName],
    });
  };

  const editItemGroupPos = (editItem: Item, groupId: number, prevPos: number, newPos: number) => {
    let itemsInGroup = listData.items.filter((item) => item.groups.includes(groupId));

    itemsInGroup.sort((a, b) => itemPositionSort(a, b, groupId));

    itemsInGroup.splice(prevPos, 1);
    itemsInGroup.splice(newPos, 0, editItem);

    for (let i = 0; i < itemsInGroup.length; i++) {
      itemsInGroup[i].groupPositions.set(groupId, i);
    }

    setListData({
      ...listData,
      items: listData.items,
    });
  };

  const editItem = (itemId: number, editedItem: Item) => {
    setListData({
      ...listData,
      items: listData.items.map((item) => {
        if (item.id === itemId) {
          return editedItem;
        } else {
          return item;
        }
      }),
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

  const editGroupPos = (groupId: number, prevPos: number, newPos: number) => {
    let groupsToChange: Group[] = [];
    let groupsToChangeIds: number[] = [];
    const parentGroup = listData.groups[groupId].parent;

    if (parentGroup !== -1) {
      groupsToChange = getSubGroupsAsGroups(listData.groups, listData.groups[parentGroup].subGroups);
    } else {
      groupsToChange = getParentGroups(listData.groups);
    }

    groupsToChange.sort((a, b) => groupPositionSort(a, b));

    const movedGroup = groupsToChange.splice(prevPos, 1);
    groupsToChange.splice(newPos, 0, movedGroup[0]);

    for (let i = 0; i < groupsToChange.length; i++) {
      groupsToChange[i].position = i;
      groupsToChangeIds.push(groupsToChange[i].id);
    }

    setListData({
      ...listData,
      groups: listData.groups.map((group) => {
        if (groupsToChangeIds.includes(group.id)) {
          const changeArrIndex = groupsToChangeIds.indexOf(group.id);
          return { ...group, position: groupsToChange[changeArrIndex].position };
        } else {
          return group;
        }
      }),
    });
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
      <List listData={listData} editItemGroupPos={editItemGroupPos} editItem={editItem} editGroup={editGroup} editGroupPos={editGroupPos}></List>
    </>
  );
}

export default App;
