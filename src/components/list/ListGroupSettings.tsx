import { DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { GroupSettings } from '../../interfaces';
import Checkbox from '../Checkbox';

interface Props {
  groupId: number;
  settings: GroupSettings;
  properties: string[];
  editGroupSettings: (groupId: number, newSettings: GroupSettings) => void;
  sortItems: (groupId: number) => void;
  deleteGroup: (groupId: number) => void;
}

function ListGroupSettings({ groupId, settings, properties, editGroupSettings, sortItems, deleteGroup }: Props) {
  return (
    <div className='d-flex flex-column align-items-center gap-2 mt-1'>
      <Checkbox
        checked={settings.numbered}
        onChange={() => {
          editGroupSettings(groupId, { ...settings, numbered: !settings.numbered });
        }}
      >
        numbered
      </Checkbox>
      <div className='d-flex flex-column align-items-center gap-2'>
        <DropdownButton variant='secondary' title={'Sort items by: ' + (settings.sortByProperty === '' ? 'Item Name' : settings.sortByProperty)}>
          <Dropdown.Item onClick={() => editGroupSettings(groupId, { ...settings, sortByProperty: '' })}>Item Name</Dropdown.Item>
          {properties.map((property, index) => {
            return (
              <Dropdown.Item key={index} onClick={() => editGroupSettings(groupId, { ...settings, sortByProperty: property })}>
                {property}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
        <Button
          variant='secondary'
          onClick={() => {
            editGroupSettings(groupId, { ...settings, sortAscending: !settings.sortAscending });
          }}
        >
          Sort mode: {settings.sortAscending ? 'Ascending' : 'Descending'}
        </Button>
        <Button variant='secondary' onClick={() => sortItems(groupId)}>
          Sort
        </Button>
        <Checkbox
          checked={settings.autoSort}
          onChange={() => {
            editGroupSettings(groupId, { ...settings, autoSort: !settings.autoSort });
          }}
        >
          sort when adding item
        </Checkbox>
      </div>
      <Button variant='secondary' onClick={() => deleteGroup(groupId)}>
        Delete Group
      </Button>
    </div>
  );
}

export default ListGroupSettings;
