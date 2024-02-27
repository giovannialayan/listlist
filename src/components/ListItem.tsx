import { MdDragHandle } from 'react-icons/md';
import Item from '../interfaces/IItem';
import '../styles/ListItem.css';

interface Props {
  item: Item;
  parentGroup: string;
  onDragStart: (item: Item, parentGroup: string) => void;
  onDragEnter: (item: Item, parentGroup: string) => void;
  onDragEnd: () => void;
  dragOver: boolean;
}

function ListItem({ item, parentGroup, onDragStart, onDragEnter, onDragEnd, dragOver }: Props) {
  return (
    <li
      className={'list-group-item listItem' + (dragOver ? ' dragOver' : '')}
      draggable
      onDragStart={() => onDragStart(item, parentGroup)}
      onDragEnter={() => onDragEnter(item, parentGroup)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div>
        <MdDragHandle />
      </div>
      <div>{item.name}</div>
    </li>
  );
}

export default ListItem;
