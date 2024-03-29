import { useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import { ListData } from '../interfaces';
import Checkbox from '../components/Checkbox';
import '../styles/ControlMenu.css';

interface Props {
  listTitles: string[];
  openList: (index: number) => void;
  newList: (newListData: ListData, index: number) => void;
  setCurrentPage: (index: number) => void;
}

const defaultList: ListData = { title: 'List', items: [], groups: [], properties: [], id: 0 };

function HomePage({ listTitles, openList, newList, setCurrentPage }: Props) {
  const [listFile, setListFile] = useState(null as any);
  const [uploadMode, setUploadMode] = useState(false);
  const [replaceMode, setReplaceMode] = useState(false);
  const [listToReplace, setListToReplace] = useState(0);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setListFile(e.target.files[0]);
    }
  };

  const loadListJSON = (index: number) => {
    let fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result) {
        const fileListData = JSON.parse(fileReader.result as string);

        if (fileListData) {
          newList(fileListData, index);
          if (replaceMode) {
            setReplaceMode(false);
          }
        }
      }
    };

    if (listFile) {
      fileReader.readAsText(listFile);
    }
  };

  return (
    <div className='d-flex flex-column gap-2'>
      <div className='d-flex flex-row gap-2 mb-4'>
        {!uploadMode && (
          <Button
            variant='secondary'
            onClick={() => {
              newList(defaultList, -1);
              setCurrentPage(1);
            }}
          >
            New List
          </Button>
        )}
        {!uploadMode && (
          <Button variant='secondary' onClick={() => setUploadMode(true)}>
            Upload List
          </Button>
        )}
        {uploadMode && (
          <div className='controlMenu gap-2'>
            <a onClick={() => setUploadMode(false)}>
              <MdClose />
            </a>
            <input className='border border-1 border-secondary-subtle rounded-1' type='file' accept='json' onChange={handleFileInput}></input>
            <Button variant='secondary' onClick={() => loadListJSON(-1)}>
              Create New List
            </Button>
            <Checkbox checked={replaceMode} onChange={() => setReplaceMode(!replaceMode)}>
              Replace Existing List
            </Checkbox>
            {replaceMode && (
              <>
                <DropdownButton variant='secondary' title={'Select Existing List'}>
                  {listTitles.map((title, index) => {
                    return (
                      <Dropdown.Item key={index} onClick={() => setListToReplace(index)}>
                        {title}
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>
                <Button
                  variant='secondary'
                  onClick={() => {
                    loadListJSON(listToReplace);
                  }}
                >
                  Replace {listTitles[listToReplace]}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      <div className='d-flex flex-column align-items-center gap-2'>
        {listTitles.map((title, index) => {
          return (
            <Button key={index} variant='secondary' onClick={() => openList(index)}>
              {title}
            </Button>
          );
        })}
        {listTitles.length === 0 && <p className='fs-3'>No lists yet</p>}
      </div>
    </div>
  );
}

export default HomePage;
