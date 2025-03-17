import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { dropdownStyles } from '../styles/dropdownStyles';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  icon,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 关闭下拉菜单的点击外部事件处理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 获取当前选中项的标签
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`${dropdownStyles.container} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={dropdownStyles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && <span className={dropdownStyles.icon}>{icon}</span>}
          <span className="truncate">{displayText}</span>
        </div>
        <FiChevronDown
          className={`${dropdownStyles.chevron} ${
            isOpen ? dropdownStyles.chevronOpen : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className={dropdownStyles.menu}>
          <ul className={dropdownStyles.list} role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className={`${dropdownStyles.option} ${dropdownStyles.optionHover} ${
                  value === option.value
                    ? dropdownStyles.optionSelected
                    : dropdownStyles.optionUnselected
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={value === option.value}
              >
                <div className="flex items-center">
                  <span className="font-normal block truncate">{option.label}</span>
                </div>
                {value === option.value && (
                  <span className={dropdownStyles.checkIcon}>
                    <FiCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 