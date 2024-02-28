import { MdDragHandle } from 'react-icons/md';
import Item from '../interfaces/IItem';
import '../styles/ListItem.css';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface Props {
  item: Item;
  parentGroup: string;
  onDragStart: (item: Item, parentGroup: string) => void;
  onDragEnter: (item: Item, parentGroup: string) => void;
  onDragEnd: () => void;
  dragOver: boolean;
}

function ListItem({ item, parentGroup, onDragStart, onDragEnter, onDragEnd, dragOver }: Props) {
  const [propertiesVisible, setPropertiesVisible] = useState(false);

  return (
    <li
      className={'list-group-item listItem' + (dragOver ? ' dragOver' : '')}
      draggable
      onDragStart={() => onDragStart(item, parentGroup)}
      onDragEnter={() => onDragEnter(item, parentGroup)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className='itemTop'>
        <div>
          <MdDragHandle />
        </div>
        <div>{item.name}</div>
        <div>
          <a onClick={() => setPropertiesVisible(!propertiesVisible)}>
            {!propertiesVisible && <IoIosArrowDown />}
            {propertiesVisible && <IoIosArrowUp />}
          </a>
        </div>
      </div>
      <div className={propertiesVisible ? '' : 'collapse'}>
        {item.properties.map((property, index) => {
          return (
            <p key={index}>
              {property.name}: {property.data}
            </p>
          );
        })}
      </div>
    </li>
  );
}

export default ListItem;
