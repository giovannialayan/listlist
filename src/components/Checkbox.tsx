interface Props {
  checked: boolean;
  children: string;
  onChange: (event?: React.ChangeEvent) => void;
}

function Checkbox({ checked, children, onChange }: Props) {
  return (
    <div className='d-flex flex-row gap-1'>
      <input type='checkbox' checked={checked} onChange={onChange}></input>
      <label>{children}</label>
    </div>
  );
}

export default Checkbox;
