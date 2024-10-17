import ListTitle from '../components/list/ListTitle';
import ListControls from '../components/list/ListControls';
import List from '../components/list/List';
import '../styles/ListPage.css';
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
import { MdDelete, MdOutlineSave } from 'react-icons/md';
import { Button, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import SideBar from '../components/SideBar/SideBar';

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
  const [scrollTarget, setScrollTarget] = useState('');
  const [sidebarItem, setSidebarItem] = useState({} as Item);
  const [sidebarParentGroup, setSidebarParentGroup] = useState(-1);

  useEffect(() => {
    const scrollElement = document.getElementById(scrollTarget);

    if (scrollElement) {
      const rect = scrollElement.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      const elementNotInView = rect.bottom < 0 || rect.top - viewHeight >= 0;

      if (elementNotInView) {
        scrollElement.scrollIntoView();
      }
    }
  }, [scrollTarget]);

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

    for (let i = 0; i < itemGroups.length; i++) {
      if (listData.groups[itemGroups[i]].settings.autoSort) {
        const groupItems = getGroupItems(newItemArr, itemGroups[i]).sort((a, b) =>
          itemPropertySort(a, b, listData.groups[itemGroups[i]].settings.sortByProperty)
        );

        if (!listData.groups[itemGroups[i]].settings.sortAscending) {
          groupItems.reverse();
        }

        for (let j = 0; j < groupItems.length; j++) {
          groupItems[j].groupPositions = { ...groupItems[j].groupPositions, [itemGroups[i]]: j };
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
    //not allowed
    if (newPos < 0 || newPos >= listData.groups[groupId].size) {
      return;
    }

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

    setScrollTarget(`i${editItem.id}-g${groupId}`);
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

  const addItemToGroup = (itemId: number, groupId: number) => {
    const nextItems = listData.items.slice();

    nextItems[itemId].groups.push(groupId);
    nextItems[itemId].groupPositions = { ...nextItems[itemId].groupPositions, [groupId]: listData.groups[groupId].size };

    if (listData.groups[groupId].settings.autoSort) {
      const groupItems = getGroupItems(nextItems, groupId).sort((a, b) => itemPropertySort(a, b, listData.groups[groupId].settings.sortByProperty));
      if (!listData.groups[groupId].settings.sortAscending) {
        groupItems.reverse();
      }

      for (let i = 0; i < groupItems.length; i++) {
        groupItems[i].groupPositions = { ...groupItems[i].groupPositions, [groupId]: i };
      }
    }

    setListData({
      ...listData,
      groups: listData.groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, size: group.size + 1 };
        } else {
          return group;
        }
      }),
      items: nextItems,
    });

    saveMode(true);
  };

  const setSidebar = (item: Item, parentGroup: number) => {
    setSidebarItem(item);
    setSidebarParentGroup(parentGroup);
  };

  return (
    <div className='listPageContainer d-flex flex-column align-items-center gap-3'>
      <div className='d-flex flex-row align-items-center gap-4 position-fixed top-0 start-0 ps-4 pt-3'>
        <a role='button' onClick={() => setCurrentPage(0)}>
          <FaArrowLeft size={'1.75em'} />
        </a>
        <a role='button' onClick={downloadList}>
          <MdOutlineSave size={'1.75em'} />
        </a>
        <a role='button' onClick={() => setShowDeleteConfirm(true)}>
          <MdDelete size={'1.75em'} />
        </a>
      </div>
      {sidebarItem.id !== undefined && <SideBar item={sidebarItem} parentGroup={sidebarParentGroup}></SideBar>}
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
        addItemToGroup={addItemToGroup}
        editGroup={editGroup}
        deleteGroup={deleteGroup}
        editGroupPos={editGroupPos}
        editGroupSettings={editGroupSettings}
        sortItems={sortItems}
        setSidebar={setSidebar}
      ></List>
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Body>Are you sure you want to delete {listData.title}?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteConfirm(false)}>
            No, don't delete
          </Button>
          <Button variant='secondary' onClick={() => deleteList(listData.id)}>
            Yes, delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListPage;
