interface Props {
  item: string;
}

function ListItem({ item }: Props) {
  return (
    <li className='list-group-item'>
      <div>{item}</div>
    </li>
  );
}

export default ListItem;
