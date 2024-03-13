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
import { MdOutlineSave } from 'react-icons/md';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import _ from 'lodash';

interface Props {
  listData: ListData;
  setListData: (list: ListData) => void;
  saveMode: (mode: boolean) => void;
  setCurrentPage: (index: number) => void;
  downloadList: () => void;
  deleteList: (id: number) => void;
}

function ListPage({ listData, setListData, saveMode, setCurrentPage, downloadList, deleteList }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      items: listData.items.map((item) => {
        return { ...item, properties: [...item.properties, { name: propertyName, data: '' }] };
      }),
      properties: [...listData.properties, propertyName],
    });

    saveMode(true);
  };

  const editItemGroupPos = (editItem: Item, groupId: number, prevPos: number, newPos: number) => {
    let itemsInGroup = getGroupItems(listData.items, groupId);

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
  const deleteItem = (itemId: number, groupId: number) => {
    const nextItems = listData.items.slice();
    const nextGroups = listData.groups.slice();

    if (groupId === -1) {
      //remove from all groups
      const removedFromGroups = nextItems[itemId].groups;
      _.remove(nextItems, (item) => {
        return item.id === itemId;
      });

      for (let i = 0; i < nextItems.length; i++) {
        nextItems[i].id = i;
      }

      for (let i = 0; i < removedFromGroups.length; i++) {
        nextGroups[removedFromGroups[i]].size -= 1;
        const groupItems = getGroupItems(nextItems, removedFromGroups[i]).sort((a, b) => itemPositionSort(a, b, removedFromGroups[i]));

        for (let j = 0; j < groupItems.length; j++) {
          nextItems[groupItems[j].id].groupPositions = { ...nextItems[groupItems[j].id].groupPositions, [removedFromGroups[i]]: j };
        }
      }
    } else {
      //remove from selected group
      nextItems[itemId].groups = nextItems[itemId].groups.filter((group) => {
        return group !== groupId;
      });

      delete nextItems[itemId].groupPositions[groupId];

      nextGroups[groupId].size -= 1;

      const groupItems = getGroupItems(nextItems, groupId).sort((a, b) => itemPositionSort(a, b, groupId));

      for (let i = 0; i < groupItems.length; i++) {
        nextItems[groupItems[i].id].groupPositions = { ...nextItems[groupItems[i].id].groupPositions, [groupId]: i };
      }
    }

    setListData({
      ...listData,
      groups: nextGroups,
      items: nextItems,
    });

    saveMode(true);
  };

  const deleteGroup = (groupId: number) => {
    const nextItems = listData.items.slice();
    const nextGroups = listData.groups.slice();
    const parentId = nextGroups[groupId].parent;
    const childrenIds = nextGroups[groupId].subGroups;

    //if it is a child, remove it from parent
    if (parentId !== -1) {
      _.remove(nextGroups[parentId].subGroups, (subGroup) => subGroup === groupId);
    }

    //remove group and its children
    _.remove(nextGroups, (group) => group.id === groupId || group.parent === groupId);

    //remove group and its children from item groups and group positions
    for (let i = 0; i < nextItems.length; i++) {
      _.remove(nextItems[i].groups, (group) => group === groupId || childrenIds.includes(group));

      delete nextItems[i].groupPositions[groupId];
      for (let j = 0; j < childrenIds.length; j++) {
        delete nextItems[i].groupPositions[childrenIds[j]];
      }
    }

    //remove items with no groups
    _.remove(nextItems, (item) => item.groups.length === 0);

    //reset item ids
    for (let i = 0; i < nextItems.length; i++) {
      nextItems[i].id = i;
    }

    //change group id and all references to it for all groups on and after the removal
    for (let i = groupId; i < nextGroups.length; i++) {
      //get prev and new ids
      const prevId = nextGroups[i].id;
      const newId = i;
      nextGroups[i].id = newId;

      //if this group has a parent, replace prev id with new id in parent's sub group array
      const parentLocation = nextGroups.findIndex((group) => group.id === nextGroups[i].parent);

      if (parentLocation !== -1) {
        const subGroupPos = nextGroups[parentLocation].subGroups.indexOf(prevId);
        nextGroups[parentLocation].subGroups[subGroupPos] = newId;
      }

      //change parent property for all sub groups to new id
      for (let j = 0; j < nextGroups[i].subGroups.length; j++) {
        const subGroupLocation = nextGroups.findIndex((group) => group.id === nextGroups[i].subGroups[j]);
        nextGroups[subGroupLocation].parent = newId;
      }

      //replace prev id with new id in item group array and group positions object
      const groupItems = getGroupItems(nextItems, prevId);

      for (let j = 0; j < groupItems.length; j++) {
        const groupIndex = nextItems[groupItems[j].id].groups.indexOf(prevId);
        nextItems[groupItems[j].id].groups[groupIndex] = newId; //replace id in group arr

        const groupPos = nextItems[groupItems[j].id].groupPositions[prevId]; //get group pos
        delete nextItems[groupItems[j].id].groupPositions[prevId]; //delete old group id key
        nextItems[groupItems[j].id].groupPositions = { ...nextItems[groupItems[j].id].groupPositions, [newId]: groupPos }; //add new group id key with its pos
      }
    }

    setListData({ ...listData, groups: nextGroups, items: nextItems });

    saveMode(true);
  };

  const deleteProperties = (names: string[]) => {
    setListData({
      ...listData,
      properties: listData.properties.filter((prop) => !names.includes(prop)),
      items: listData.items.map((item) => {
        return { ...item, properties: item.properties.filter((itemProp) => !names.includes(itemProp.name)) };
      }),
    });

    saveMode(true);
  };

  return (
    <>
      <div>
        <a onClick={() => setCurrentPage(0)}>
          <FaArrowLeft />
        </a>
        <a onClick={downloadList}>
          <MdOutlineSave />
        </a>
        <Button onClick={() => setShowDeleteConfirm(true)}>Delete List</Button>
      </div>
      <ListTitle editTitle={editTitle}>{listData.title}</ListTitle>
      <ListControls
        groups={listData.groups}
        addGroup={addGroup}
        properties={listData.properties}
        addItem={addItem}
        addProperty={addProperty}
        deleteProperties={deleteProperties}
      ></ListControls>
      <List
        listData={listData}
        editItemGroupPos={editItemGroupPos}
        editItem={editItem}
        deleteItem={deleteItem}
        editGroup={editGroup}
        deleteGroup={deleteGroup}
        editGroupPos={editGroupPos}
        editGroupSettings={editGroupSettings}
        sortItems={sortItems}
      ></List>
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Body>Are you sure you want to delete {listData.title}?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteConfirm(false)}>No, don't delete</Button>
          <Button onClick={() => deleteList(listData.id)}>Yes, delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ListPage;
