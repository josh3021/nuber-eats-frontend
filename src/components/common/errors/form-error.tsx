import React from 'react';

interface IFormErrorProps {
  errorMessage: string;
  title: string;
}

const FormError: React.FC<IFormErrorProps> = ({ errorMessage, title }) => (
  <span className="font-medium text-red-500" role="alert" title={title}>
    {errorMessage}
  </span>
);

export default FormError;
