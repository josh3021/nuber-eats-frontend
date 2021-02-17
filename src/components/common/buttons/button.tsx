import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  name: string;
  className?: string;
}

const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  name,
}) => (
  <button
    className={`text-lg font-medium focus:outline-none text-white py-4 transition-colors ${
      canClick
        ? 'bg-lime-500 hover:bg-lime-600'
        : 'bg-gray-300 pointer-events-none'
    } px-5`}
    name={name}>
    {loading ? 'Loading...' : actionText}
  </button>
);

export default Button;
