import Item from './IItem';

interface ListData {
  groups: string[];
  items: Item[];
  subGroups: { group: string; subGroup: string }[];
  properties: string[];
  groupSizes: number[];
}

export default ListData;
