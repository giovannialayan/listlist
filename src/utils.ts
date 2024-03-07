import Group from './interfaces/IGroup';
import Item from './interfaces/IItem';

const itemPositionSort = (itemA: Item, itemB: Item, group: number) => {
  const aPos = itemA.groupPositions[group];
  const bPos = itemB.groupPositions[group];
  if (aPos !== undefined && bPos !== undefined) {
    return aPos - bPos;
  } else {
    return 0;
  }
};

const getGroupItems = (items: Item[], groupId: number): Item[] => {
  return items.filter((item) => item.groups.includes(groupId));
};

const getSubGroupsAsGroups = (groups: Group[], subGroupIds: number[]) => {
  const subGroups: Group[] = [];

  for (let i = 0; i < subGroupIds.length; i++) {
    subGroups.push(groups[subGroupIds[i]]);
  }

  return subGroups;
};

const getNumParentGroups = (groups: Group[]) => {
  let numGroups = 0;
  groups.map((group) => {
    if (group.parent === -1) {
      numGroups++;
    }
  });
  return numGroups;
};

const getParentGroups = (groups: Group[]) => {
  const parentGroups: Group[] = [];
  groups.map((group) => {
    if (group.parent === -1) {
      parentGroups.push(group);
    }
  });
  return parentGroups;
};

const groupPositionSort = (groupA: Group, groupB: Group) => {
  return groupA.position - groupB.position;
};

const itemPropertySort = (itemA: Item, itemB: Item, property: string) => {
  if (property === '') {
    if (itemA.name < itemB.name) {
      return -1;
    } else if (itemA.name > itemB.name) {
      return 1;
    } else {
      return 0;
    }
  } else {
    const itemAProp = itemA.properties.find((prop) => prop.name === property)?.data;
    const itemBProp = itemB.properties.find((prop) => prop.name === property)?.data;
    if (itemAProp === undefined || itemBProp === undefined) {
      return 0;
    }
    if (itemAProp < itemBProp) {
      return -1;
    } else if (itemAProp > itemBProp) {
      return 1;
    } else {
      return 0;
    }
  }
};

export { itemPositionSort, getGroupItems, getSubGroupsAsGroups, getNumParentGroups, getParentGroups, groupPositionSort, itemPropertySort };
