import { useState } from 'react';
import { MdDragHandle } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import './NewList.css';

interface Props {}

function NewList({}: Props) {
  let list = [
    {
      name: 'alphabetically',
      id: 'g0',
      subGroups: [],
      size: 30,
      parent: -1,
      position: 0,
      settings: { numbered: false, autoSort: true, sortByProperty: '', sortAscending: true, collapse: true },
    },
    {
      name: '100-man no inochi no ue ni ore wa tatteiru',
      id: 'i0',
      groups: [0, 3, 12, 20],
      // groupPositions: { '0': 0, '3': 34, '12': 0, '20': 0 },
      groupPosition: 0,
      properties: [
        { name: 'last watched', data: '' },
        { name: 'japanese title', data: '100万の命の上に俺は立っている' },
        { name: 'english title', data: "i'm standing on 1,000,000 lives" },
        { name: 'notes', data: '' },
      ],
    },
    {
      name: '5-toubun no hanayome',
      id: 'i1',
      groups: [0, 2, 13, 15, 20],
      // groupPositions: { '0': 1, '2': 97, '13': 0, '15': 0, '20': 1 },
      groupPosition: 1,
      properties: [
        { name: 'last watched', data: '11/28/2023' },
        { name: 'japanese title', data: '五等分の花嫁' },
        { name: 'english title', data: 'the quintessential quintuplets' },
        { name: 'notes', data: '' },
      ],
    },
    {
      name: '86',
      id: 'i2',
      groups: [0, 2, 12, 16, 21],
      // groupPositions: { '0': 2, '2': 40, '12': 1, '16': 0, '21': 0 },
      groupPosition: 2,
      properties: [
        { name: 'last watched', data: '2/8/2023' },
        { name: 'japanese title', data: '86―エイティシックス―' },
        { name: 'english title', data: '' },
        { name: 'notes', data: '' },
      ],
    },
    {
      name: 'absolute duo',
      id: 'i3',
      groups: [0, 4, 10, 21],
      // groupPositions: { '0': 3, '4': 39, '10': 0, '21': 1 },
      groupPosition: 3,
      properties: [
        { name: 'last watched', data: '' },
        { name: 'japanese title', data: 'アブソリュート・デュオ' },
        { name: 'english title', data: '' },
        { name: 'notes', data: '' },
      ],
    },
    {
      name: 'afro samurai',
      id: 'i4',
      groups: [0, 4, 8, 12, 20],
      // groupPositions: { '0': 4, '4': 70, '8': 0, '12': 2, '20': 2 },
      groupPosition: 4,
      properties: [
        { name: 'last watched', data: '' },
        { name: 'japanese title', data: 'アフロサムライ' },
        { name: 'english title', data: '' },
        { name: 'notes', data: '' },
      ],
    },
    {
      name: 'rank',
      id: 'g1',
      subGroups: [2, 3, 4, 5, 6],
      size: 0,
      parent: -1,
      position: 1,
      settings: { numbered: false, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
    },
    {
      name: 'rank 10',
      id: 'g2',
      subGroups: [],
      size: 119,
      parent: 1,
      position: 0,
      settings: { numbered: true, autoSort: false, sortByProperty: '', sortAscending: true, collapse: false },
    },
    {
      name: 'kumo desu ga, nani ka?',
      id: 'i110',
      groups: [0, 2, 8, 9, 12, 21],
      // groupPositions: { '0': 118, '2': 0, '8': 23, '9': 37, '12': 60, '21': 61 },
      groupPosition: 0,
      properties: [
        { name: 'last watched', data: '12/29/2022' },
        { name: 'japanese title', data: '蜘蛛ですが、なにか？' },
        { name: 'english title', data: 'so im a spider, so what?' },
        { name: 'notes', data: '' },
      ],
    },
    {
      name: 'overlord',
      id: 'i157',
      groups: [0, 2, 9, 11, 12, 21],
      // groupPositions: { '0': 171, '2': 1, '9': 51, '11': 18, '12': 85, '21': 95 },
      groupPosition: 1,
      properties: [
        { name: 'last watched', data: '9/30/2022' },
        { name: 'japanese title', data: 'オーバーロード' },
        { name: 'english title', data: '' },
        { name: 'notes', data: '' },
      ],
    },
    {
      name: 'tsuki ga michibiku isekai douchuu',
      id: 'i230',
      groups: [0, 2, 8, 9, 21],
      // groupPositions: { '0': 251, '2': 2, '8': 45, '9': 81, '21': 142 },
      groupPosition: 2,
      properties: [
        { name: 'last watched', data: '7/1/2024' },
        { name: 'japanese title', data: '月が導く異世界道中' },
        { name: 'english title', data: 'tsukimichi: moonlit fantasy' },
        { name: 'notes', data: '' },
      ],
    },
  ];

  const initialPropVis: { [key: string]: boolean } = {};
  const [propertiesVisible, setPropertiesVisible] = useState(() =>
    list.reduce((acc, item) => {
      return { ...acc, [item.id]: false };
    }, initialPropVis)
  );

  let dragOver = false;

  return (
    <ul className='list-group list-group-flush'>
      {list.map((item) => {
        return (
          <li key={item.id} className={'listGroupItem d-flex flex-column gap-2' + (dragOver ? ' dragOver' : '')}>
            <div className='d-flex flex-row justify-content-between align-items-center gap-3'>
              <div className='d-flex flex-row gap-2'>
                <div role='button' draggable>
                  <MdDragHandle size={'1.5em'} />
                </div>
                {item.groupPosition !== undefined && <p className='mb-0'>{item.groupPosition + 1 + '. '}</p>}
              </div>
              <p className={'mb-0 ' + (item.parent === undefined ? '' : item.parent === -1 ? 'fs-3 fw-bold' : 'fs-5 fw-bold')}>{item.name}</p>
              <a
                role='button'
                onClick={() => {
                  setPropertiesVisible({ ...propertiesVisible, [item.id]: !propertiesVisible[item.id] });
                }}
              >
                {!propertiesVisible[item.id] && <IoIosArrowDown size={'1.25em'} />}
                {propertiesVisible[item.id] && <IoIosArrowUp size={'1.25em'} />}
              </a>
            </div>
            {item.properties !== undefined && (
              <div className={propertiesVisible[item.id] ? '' : 'collapse'}>
                {item.properties.map((property, index) => {
                  return (
                    property.data && (
                      <p key={index}>
                        {property.name}: {property.data}
                      </p>
                    )
                  );
                })}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default NewList;
