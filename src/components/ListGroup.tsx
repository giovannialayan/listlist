import { Dropdown, DropdownButton } from 'react-bootstrap';
import ListItem from './ListItem';
import { useState } from 'react';

interface Props {
  listData: { [key: string]: string }[];
  listGroups: string[];
}

function ListGroup({ listData, listGroups }: Props) {
  const [currentGroup, setCurrentGroup] = useState('None');

  return (
    <div>
      <div>
        <DropdownButton title={`Group: ${currentGroup}`}>
          {listGroups.map((group, index) => {
            return (
              <Dropdown.Item key={index} onClick={() => setCurrentGroup(group)}>
                {group}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
      <ul className='list-group list-group-flush'>
        {listData.map((data, index) => {
          return <ListItem key={index} item={data}></ListItem>;
        })}
      </ul>
    </div>
  );
}

export default ListGroup;
