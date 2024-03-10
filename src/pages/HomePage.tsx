import { useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { MdCancel } from 'react-icons/md';
import { ListData } from '../interfaces';
import Checkbox from '../components/Checkbox';

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
        console.log(fileListData);
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
    <div>
      <Button
        onClick={() => {
          newList(defaultList, -1);
          setCurrentPage(1);
        }}
      >
        New List
      </Button>
      {!uploadMode && (
        <div>
          <Button onClick={() => setUploadMode(true)}>Upload List</Button>
        </div>
      )}
      {uploadMode && (
        <div>
          <a onClick={() => setUploadMode(false)}>
            <MdCancel />
          </a>
          <input type='file' accept='json' onChange={handleFileInput}></input>
          <Button onClick={() => loadListJSON(-1)}>Create New List</Button>
          <Checkbox checked={replaceMode} onChange={() => setReplaceMode(!replaceMode)}>
            Replace Existing List
          </Checkbox>
          {replaceMode && (
            <div>
              <DropdownButton title={'Select Existing List'}>
                {listTitles.map((title, index) => {
                  return (
                    <Dropdown.Item key={index} onClick={() => setListToReplace(index)}>
                      {title}
                    </Dropdown.Item>
                  );
                })}
              </DropdownButton>
              <Button
                onClick={() => {
                  loadListJSON(listToReplace);
                }}
              >
                Replace {listTitles[listToReplace]}
              </Button>
            </div>
          )}
        </div>
      )}
      {listTitles.map((title, index) => {
        return (
          <div key={index}>
            <Button onClick={() => openList(index)}>{title}</Button>
          </div>
        );
      })}
    </div>
  );
}

export default HomePage;
