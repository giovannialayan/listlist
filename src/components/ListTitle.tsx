import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import '../styles/ListTitle.css';

interface Props {
  children: string;
  editTitle: (title: string) => void;
}

function ListTitle({ children, editTitle }: Props) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className='titleContainer'>
      {!editMode && <p>{children}</p>}
      {editMode && (
        <input
          type='text'
          value={children}
          onChange={(e) => editTitle(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditMode(false);
            }
          }}
        ></input>
      )}
      <a onClick={() => setEditMode(!editMode)}>
        <MdEdit />
      </a>
    </div>
  );
}

export default ListTitle;
