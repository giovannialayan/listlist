import './App.css';
import { useEffect, useRef, useState } from 'react';
import { ListData } from './interfaces';
import ListPage from './pages/ListPage';
import HomePage from './pages/HomePage';
import _ from 'lodash';

const localStoragePrefix = 'listlist.';
const listsKey = 'lists';

const defaultList: ListData = { title: 'List', items: [], groups: [], properties: [], id: 0 };

function App() {
  const initData: ListData = {
    title: 'title',
    id: 0,
    items: [
      {
        name: 'first',
        id: 0,
        groups: [0, 1],
        groupPositions: { 0: 0, 1: 0 },
        properties: [
          { name: 'notes', data: 'c' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'second',
        id: 1,
        groups: [0, 2],
        groupPositions: { 0: 1, 2: 0 },
        properties: [
          { name: 'notes', data: 'a' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'third',
        id: 2,
        groups: [0, 3],
        groupPositions: { 0: 2, 3: 0 },
        properties: [
          { name: 'notes', data: 'b' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'fourth',
        id: 3,
        groups: [4],
        groupPositions: { 4: 0 },
        properties: [
          { name: 'notes', data: '' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'fifth',
        id: 4,
        groups: [5],
        groupPositions: { 5: 0 },
        properties: [
          { name: 'notes', data: '' },
          { name: 'prop', data: '' },
        ],
      },
    ],
    properties: ['notes', 'prop'],
    groups: [
      {
        name: 'Default',
        id: 0,
        subGroups: [],
        size: 3,
        parent: -1,
        position: 0,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'a',
        id: 1,
        subGroups: [2, 4, 5],
        size: 1,
        parent: -1,
        position: 1,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'b',
        id: 2,
        subGroups: [],
        size: 1,
        parent: 1,
        position: 0,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'c',
        id: 3,
        subGroups: [],
        size: 1,
        parent: -1,
        position: 2,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'b2',
        id: 4,
        subGroups: [],
        size: 1,
        parent: 1,
        position: 1,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
      {
        name: 'b3',
        id: 5,
        subGroups: [],
        size: 1,
        parent: 1,
        position: 2,
        settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
      },
    ],
  };
  const [listData, setListData] = useState({} as ListData);
  const [listTitles, setListTitles] = useState([] as string[]);
  const [currentPage, setCurrentPage] = useState(0);
  const shouldSave = useRef(false);

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

  const newList = () => {
    const lists = localStorage.getItem(localStoragePrefix + listsKey);
    if (lists) {
      const listDatas: ListData[] = JSON.parse(lists);
      const newListData = { ...defaultList, id: listDatas.length };
      localStorage.setItem(localStoragePrefix + listsKey, JSON.stringify([...listDatas, newListData]));
      setListData(newListData);
    } else {
      localStorage.setItem(localStoragePrefix + listsKey, JSON.stringify([defaultList]));
      setListData(_.cloneDeep(defaultList));
    }

    setCurrentPage(1);
  };

  return (
    <>
      {currentPage === 0 && <HomePage listTitles={listTitles} openList={openList} newList={newList}></HomePage>}
      {currentPage === 1 && <ListPage listData={listData} setListData={setListData} saveMode={saveMode} setCurrentPage={setCurrentPage}></ListPage>}
    </>
  );
}

export default App;
