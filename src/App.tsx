import './App.css';
import { useState } from 'react';
import List from './components/List';
import ListControls from './components/ListControls';
import ListTitle from './components/ListTitle';
import { ListData, Item, ItemProperty, Group, GroupSettings } from './interfaces';
import {
  getGroupItems,
  getNumParentGroups,
  getParentGroups,
  getSubGroupsAsGroups,
  groupPositionSort,
  itemPositionSort,
  itemPropertySort,
} from './utils';

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
          { name: 'notes', data: 'c' },
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
          { name: 'notes', data: 'a' },
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
          { name: 'notes', data: 'b' },
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
      {
        name: 'Default',
        id: 0,
        subGroups: [],
        size: 3,
        parent: -1,
        position: 0,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'a',
        id: 1,
        subGroups: [2, 4, 5],
        size: 1,
        parent: -1,
        position: 1,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'b',
        id: 2,
        subGroups: [],
        size: 1,
        parent: 1,
        position: 0,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'c',
        id: 3,
        subGroups: [],
        size: 1,
        parent: -1,
        position: 2,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'b2',
        id: 4,
        subGroups: [],
        size: 1,
        parent: 1,
        position: 1,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'b3',
        id: 5,
        subGroups: [],
        size: 1,
        parent: 1,
        position: 2,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
    ],
  };
  // const [listData, setListData] = useState({ groups: ['Default'], items: [] } as ListData);
  const [listData, setListData] = useState(initData);

  const addGroup = (groupName: string, parentGroup: number) => {
    const newGroup: Group = {
      name: groupName,
      id: listData.groups.length,
      subGroups: [],
      size: 0,
      parent: parentGroup,
      position: getNumParentGroups(listData.groups),
      settings: { numbered: false, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
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

    const newItemArr = [...listData.items, newItem];
    const groupItems: Item[][] = [];

    for (let i = 0; i < itemGroups.length; i++) {
      groupItems.push(
        getGroupItems(newItemArr, itemGroups[i]).sort((a, b) => itemPropertySort(a, b, listData.groups[itemGroups[i]].settings.sortByProperty))
      );

      if (!listData.groups[itemGroups[i]].settings.sortAscending) {
        groupItems[i].reverse();
      }

      for (let j = 0; j < groupItems[i].length; j++) {
        groupItems[i][j].groupPositions.set(itemGroups[i], j);
      }
    }

    setListData({
      ...listData,
      items: newItemArr,
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

  const editGroupSettings = (groupId: number, newSettings: GroupSettings) => {
    setListData({
      ...listData,
      groups: listData.groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, settings: newSettings };
        } else {
          return group;
        }
      }),
    });
  };

  const sortItems = (groupId: number) => {
    const groupItems = getGroupItems(listData.items, groupId);
    let groupItemsIds: number[] = [];
    groupItems.sort((a, b) => itemPropertySort(a, b, listData.groups[groupId].settings.sortByProperty));

    if (!listData.groups[groupId].settings.sortAscending) {
      groupItems.reverse();
    }

    for (let i = 0; i < groupItems.length; i++) {
      groupItems[i].groupPositions.set(groupId, i);
      groupItemsIds.push(groupItems[i].id);
    }

    setListData({
      ...listData,
      items: listData.items.map((item) => {
        if (groupItemsIds.includes(item.id)) {
          return { ...item, groupPositions: groupItems[groupItemsIds.indexOf(item.id)].groupPositions };
        } else {
          return item;
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
      <List
        listData={listData}
        editItemGroupPos={editItemGroupPos}
        editItem={editItem}
        editGroup={editGroup}
        editGroupPos={editGroupPos}
        editGroupSettings={editGroupSettings}
        sortItems={sortItems}
      ></List>
    </>
  );
}

export default App;
