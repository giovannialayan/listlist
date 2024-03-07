import { Button } from 'react-bootstrap';

interface Props {
  listTitles: string[];
  openList: (index: number) => void;
}

function HomePage({ listTitles, openList }: Props) {
  return (
    <div>
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
