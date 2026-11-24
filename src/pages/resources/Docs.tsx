import React from 'react';
import {Navigate} from 'react-router-dom';

export const DocsIndex: React.FC = () => {
  return <Navigate to="/resources/docs/quickstart" replace />;
};

export default DocsIndex;
