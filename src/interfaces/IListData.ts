import Group from './IGroup';
import Item from './IItem';

interface ListData {
  items: Item[];
  properties: string[];
  groups: Group[];
}

export default ListData;
