interface Group {
  name: string;
  id: number;
  subGroups: number[];
  size: number;
  parent: number;
}

export default Group;
