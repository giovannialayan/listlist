interface Item {
  name: string;
  groups: string[];
  groupPositions: Map<string, number>;
  properties: { [key: string]: string };
}

export default Item;
