interface Item {
  name: string;
  id: number;
  groups: string[];
  groupPositions: Map<string, number>;
  properties: { name: string; data: string }[];
}

export default Item;
