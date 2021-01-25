import React from 'react';
import { Helmet } from 'react-helmet-async';

interface IReactHelmetProps {
  title: string;
}

function ReactHelmet({ title }: IReactHelmetProps) {
  return (
    <Helmet>
      <title>{title} | Nuber Eats</title>
    </Helmet>
  );
}

export default ReactHelmet;
