interface Props {
  item: { [key: string]: string };
}

function ListItem({ item }: Props) {
  return (
    <li className='list-group-item'>
      {Array.from(Object.keys(item)).map((data, index) => {
        return (
          <div key={index}>
            {data}: {item[data]}
          </div>
        );
      })}
    </li>
  );
}

export default ListItem;
