import Item from './interfaces/IItem';

const groupPositionSort = (itemA: Item, itemB: Item, group: string) => {
  const aPos = itemA.groupPositions.get(group);
  const bPos = itemB.groupPositions.get(group);
  if (aPos !== undefined && bPos !== undefined) {
    return aPos - bPos;
  } else {
    return 0;
  }
};

export { groupPositionSort };
