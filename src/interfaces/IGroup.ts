import GroupSettings from './IGroupSettings';

interface Group {
  name: string;
  id: number;
  subGroups: number[];
  size: number;
  parent: number;
  position: number;
  settings: GroupSettings;
}

export default Group;
