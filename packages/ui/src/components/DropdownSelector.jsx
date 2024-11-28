import './DropdownSelector.css';

const DropdownSelector = ({ name, selected, options, onChange }) => {
    return (
    <select name={name} value={selected} className='selector' onChange={onChange}>
        {options.map((option, index) => {
          return (
            <option key={option} value={option}>{option}</option>
          );
        })}
    </select>
    );
}

export default DropdownSelector;