interface Item {
  name: string;
  groups: string[];
  groupPositions: Map<string, number>;
  properties: { name: string; data: string }[];
}

export default Item;
