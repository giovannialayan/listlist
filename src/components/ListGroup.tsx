import { Dropdown, DropdownButton } from 'react-bootstrap';
import ListItem from './ListItem';
import { useState } from 'react';
import ListData from '../interfaces/IListData';

interface Props {
  listData: ListData;
}

function ListGroup({ listData }: Props) {
  const [currentGroup, setCurrentGroup] = useState('None');

  return (
    <div>
      <div>
        <DropdownButton title={`Group: ${currentGroup}`}>
          {listData.groups.map((group, index) => {
            return (
              <Dropdown.Item key={index} onClick={() => setCurrentGroup(group)}>
                {group}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
      <ul className='list-group list-group-flush'>
        {listData.items.map((data, index) => {
          return <ListItem key={index} item={data.name}></ListItem>;
        })}
      </ul>
    </div>
  );
}

export default ListGroup;
