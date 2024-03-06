interface Group {
  name: string;
  id: number;
  subGroups: number[];
  size: number;
  parent: number;
  position: number;
}

export default Group;
