import React from 'react';
import {ProductPageTemplate} from '../../components/product/ProductPageTemplate';
import {RedactionDemo} from '../../components/product/RedactionDemo';
import {PRODUCT_PAGES} from '../../lib/productContent';

const Security: React.FC = () => {
  return <ProductPageTemplate data={PRODUCT_PAGES.security} demo={<RedactionDemo />} />;
};

export default Security;
