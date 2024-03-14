import './App.css';
import { useEffect, useRef, useState } from 'react';
import { ListData } from './interfaces';
import ListPage from './pages/ListPage';
import HomePage from './pages/HomePage';
import _ from 'lodash';
import { BsLightbulb, BsLightbulbFill } from 'react-icons/bs';

const localStoragePrefix = 'listlist.';
const listsKey = 'lists';

function App() {
  const [listData, setListData] = useState({} as ListData);
  const [listTitles, setListTitles] = useState([] as string[]);
  const [currentPage, setCurrentPage] = useState(0);
  const shouldSave = useRef(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    const lists = localStorage.getItem(localStoragePrefix + listsKey);

    if (lists) {
      const listDatas: ListData[] = JSON.parse(lists);
      setListTitles(
        listDatas.map((list) => {
          return list.title;
        })
      );
    }
  }, []);

  useEffect(() => {
    if (shouldSave.current) {
      saveList();
    }

    shouldSave.current = false;
  }, [listData]);

  const saveList = () => {
    const lists = localStorage.getItem(localStoragePrefix + listsKey);
    if (lists) {
      const listDatas: ListData[] = JSON.parse(lists);
      listDatas[listData.id] = listData;
      localStorage.setItem(localStoragePrefix + listsKey, JSON.stringify(listDatas));
    }
  };

  const saveMode = (mode: boolean) => {
    shouldSave.current = mode;
  };

  const downloadListJSON = () => {
    let content = JSON.stringify(listData);

    const link = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `${listData.title}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const openList = (index: number) => {
    //get listData from localStorage
    //set listData to selected listData
    const lists = localStorage.getItem(localStoragePrefix + listsKey);

    if (lists) {
      const listDatas: ListData[] = JSON.parse(lists);
      setListData(listDatas[index]);
      setCurrentPage(1);
    }
  };

  const newList = (newListData: ListData, index: number) => {
    const lists = localStorage.getItem(localStoragePrefix + listsKey);
    if (lists) {
      const listDatas: ListData[] = JSON.parse(lists);
      if (index === -1) {
        newListData.id = listDatas.length;
        localStorage.setItem(localStoragePrefix + listsKey, JSON.stringify([...listDatas, newListData]));
      } else {
        newListData.id = index;
        listDatas[index] = newListData;
        localStorage.setItem(localStoragePrefix + listsKey, JSON.stringify(listDatas));
      }

      setListData(_.cloneDeep(newListData)); //in case it's default, i don't want default to mutate because if multiple lists are made in the same session default would be different
      setListTitles(
        listDatas.map((list) => {
          return list.title;
        })
      );
    } else {
      localStorage.setItem(localStoragePrefix + listsKey, JSON.stringify([newListData]));

      setListData(_.cloneDeep(newListData));
      setListTitles([newListData.title]);
    }
  };

  const deleteList = (id: number) => {
    const lists = localStorage.getItem(localStoragePrefix + listsKey);
    if (lists) {
      const listDatas: ListData[] = JSON.parse(lists);
      _.remove(listDatas, (list) => {
        return list.id === id;
      });

      for (let i = 0; i < listDatas.length; i++) {
        listDatas[i].id = i;
      }

      localStorage.setItem(localStoragePrefix + listsKey, JSON.stringify(listDatas));
      setListTitles(
        listDatas.map((list) => {
          return list.title;
        })
      );
      setCurrentPage(0);
    }
  };

  const toggleTheme = () => {
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      setCurrentTheme('light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      setCurrentTheme('dark');
    }
  };

  return (
    <>
      <a role='button' onClick={toggleTheme} className={`link-${currentTheme === 'dark' ? 'light' : 'dark'} toggleThemeButton`}>
        {currentTheme === 'dark' && <BsLightbulb />}
        {currentTheme === 'light' && <BsLightbulbFill />}
      </a>
      {currentPage === 0 && <HomePage listTitles={listTitles} openList={openList} newList={newList} setCurrentPage={setCurrentPage}></HomePage>}
      {currentPage === 1 && (
        <ListPage
          listData={listData}
          setListData={setListData}
          saveMode={saveMode}
          setCurrentPage={setCurrentPage}
          downloadList={downloadListJSON}
          deleteList={deleteList}
        ></ListPage>
      )}
    </>
  );
}

export default App;
