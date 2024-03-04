import Group from './interfaces/IGroup';
import Item from './interfaces/IItem';

const groupPositionSort = (itemA: Item, itemB: Item, group: number) => {
  const aPos = itemA.groupPositions.get(group);
  const bPos = itemB.groupPositions.get(group);
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

export { groupPositionSort, getGroupItems, getSubGroupsAsGroups };
