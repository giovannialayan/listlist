import { useState } from 'react';
import { MdEdit } from 'react-icons/md';

interface Props {
  children: string;
  editTitle: (title: string) => void;
}

function ListTitle({ children, editTitle }: Props) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className='d-flex flex-row align-items-center gap-1'>
      {!editMode && <p className='fs-3 mb-0 ms-2 fw-bold'>{children}</p>}
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
      <a role='button' onClick={() => setEditMode(!editMode)}>
        <MdEdit />
      </a>
    </div>
  );
}

export default ListTitle;
