import ListTitle from '../components/list/ListTitle';
import ListControls from '../components/list/ListControls';
import List from '../components/list/List';
import { ListData, Item, ItemProperty, Group, GroupSettings } from '../interfaces';
import {
  getGroupItems,
  getNumParentGroups,
  getParentGroups,
  getSubGroupsAsGroups,
  groupPositionSort,
  itemPositionSort,
  itemPropertySort,
} from '../utils';
import { FaArrowLeft } from 'react-icons/fa';

interface Props {
  listData: ListData;
  setListData: (list: ListData) => void;
  saveMode: (mode: boolean) => void;
  setCurrentPage: (index: number) => void;
}

function ListPage({ listData, setListData, saveMode, setCurrentPage }: Props) {
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

    saveMode(true);
  };

  const addItem = (itemName: string, itemGroups: number[], itemProperties: ItemProperty[]) => {
    const newItem = {
      name: itemName,
      id: listData.items.length,
      groups: itemGroups,
      groupPositions: itemGroups.reduce((a, v) => ({ ...a, [v]: listData.groups[v].size }), {}),
      properties: itemProperties,
    };

    const newItemArr = [...listData.items, newItem];
    const groupItems: Item[][] = [];

    for (let i = 0; i < itemGroups.length; i++) {
      if (listData.groups[itemGroups[i]].settings.autoSort) {
        groupItems.push(
          getGroupItems(newItemArr, itemGroups[i]).sort((a, b) => itemPropertySort(a, b, listData.groups[itemGroups[i]].settings.sortByProperty))
        );

        if (!listData.groups[itemGroups[i]].settings.sortAscending) {
          groupItems[i].reverse();
        }

        for (let j = 0; j < groupItems[i].length; j++) {
          groupItems[i][j].groupPositions = { ...groupItems[i][j].groupPositions, [itemGroups[i]]: j };
        }
      }
    }

    setListData({
      ...listData,
      groups: listData.groups.map((group) => {
        if (itemGroups.includes(group.id)) {
          return { ...group, size: group.size + 1 };
        } else {
          return group;
        }
      }),
      items: newItemArr,
    });

    saveMode(true);
  };

  const addProperty = (propertyName: string) => {
    setListData({
      ...listData,
      properties: [...listData.properties, propertyName],
    });

    saveMode(true);
  };

  const editItemGroupPos = (editItem: Item, groupId: number, prevPos: number, newPos: number) => {
    let itemsInGroup = listData.items.filter((item) => item.groups.includes(groupId));

    itemsInGroup.sort((a, b) => itemPositionSort(a, b, groupId));

    itemsInGroup.splice(prevPos, 1);
    itemsInGroup.splice(newPos, 0, editItem);

    for (let i = 0; i < itemsInGroup.length; i++) {
      itemsInGroup[i].groupPositions = { ...itemsInGroup[i].groupPositions, [groupId]: i };
    }

    setListData({
      ...listData,
      items: listData.items,
    });

    saveMode(true);
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

    saveMode(true);
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

    saveMode(true);
  };

  const editTitle = (title: string) => {
    setListData({ ...listData, title });

    saveMode(true);
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

    saveMode(true);
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

    saveMode(true);
  };

  const sortItems = (groupId: number) => {
    const groupItems = getGroupItems(listData.items, groupId);
    let groupItemsIds: number[] = [];
    groupItems.sort((a, b) => itemPropertySort(a, b, listData.groups[groupId].settings.sortByProperty));

    if (!listData.groups[groupId].settings.sortAscending) {
      groupItems.reverse();
    }

    for (let i = 0; i < groupItems.length; i++) {
      groupItems[i].groupPositions = { ...groupItems[i].groupPositions, [groupId]: i };
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

    saveMode(true);
  };

  //remove item note: keep item.id same as index in listdata.items

  return (
    <>
      <div>
        <a onClick={() => setCurrentPage(0)}>
          <FaArrowLeft />
        </a>
      </div>
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

export default ListPage;
