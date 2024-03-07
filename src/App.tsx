import './App.css';
import { useState } from 'react';
import { ListData } from './interfaces';
import ListPage from './pages/ListPage';
import HomePage from './pages/HomePage';

function App() {
  const initData: ListData = {
    title: 'title',
    items: [
      {
        name: 'first',
        id: 0,
        groups: [0, 1],
        groupPositions: new Map([
          [0, 0],
          [1, 0],
        ]),
        properties: [
          { name: 'notes', data: 'c' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'second',
        id: 1,
        groups: [0, 2],
        groupPositions: new Map([
          [0, 1],
          [2, 0],
        ]),
        properties: [
          { name: 'notes', data: 'a' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'third',
        id: 2,
        groups: [0, 3],
        groupPositions: new Map([
          [0, 2],
          [3, 0],
        ]),
        properties: [
          { name: 'notes', data: 'b' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'fourth',
        id: 3,
        groups: [4],
        groupPositions: new Map([[4, 0]]),
        properties: [
          { name: 'notes', data: '' },
          { name: 'prop', data: '' },
        ],
      },
      {
        name: 'fifth',
        id: 4,
        groups: [5],
        groupPositions: new Map([[5, 0]]),
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
  // const [listData, setListData] = useState({ groups: ['Default'], items: [] } as ListData);
  const [listData, setListData] = useState(initData);

  const [currentPage, setCurrentPage] = useState(0);

  const openList = (index: number) => {
    //get listData from localStorag
    //set listData to new listData

    setCurrentPage(1);
  };

  return (
    <>
      {currentPage === 0 && <HomePage listTitles={[listData.title]} openList={openList}></HomePage>}
      {currentPage === 1 && <ListPage listData={listData} setListData={setListData}></ListPage>}
    </>
  );
}

export default App;
