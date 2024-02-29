import ItemProperty from './IItemProperty';

interface Item {
  name: string;
  id: number;
  groups: string[];
  groupPositions: Map<string, number>;
  properties: ItemProperty[];
}

export default Item;
