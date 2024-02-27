import { DragEvent } from 'react';

interface Props {
  item: string;
  parentGroup: string;
  index: number;
}

function ListItem({ item, parentGroup, index }: Props) {
  const onDragStart = (e: DragEvent) => {
    console.log('drag start', index);
  };

  const onDragEnter = (e: DragEvent) => {
    console.log('drag enter', index);
  };

  const onDragEnd = (e: DragEvent) => {
    console.log('drag end');
  };

  return (
    <li className='list-group-item' draggable onDragStart={onDragStart} onDragEnter={onDragEnter} onDragEnd={onDragEnd}>
      <div>{item}</div>
    </li>
  );
}

export default ListItem;
