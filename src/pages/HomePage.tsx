import { Button } from 'react-bootstrap';

interface Props {
  listTitles: string[];
  openList: (index: number) => void;
  newList: () => void;
}

function HomePage({ listTitles, openList, newList }: Props) {
  return (
    <div>
      <Button onClick={newList}>New List</Button>
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
