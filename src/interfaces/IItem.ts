import ItemProperty from './IItemProperty';

interface Item {
  name: string;
  id: number;
  groups: number[];
  groupPositions: { [key: number]: number };
  properties: ItemProperty[];
}

export default Item;
