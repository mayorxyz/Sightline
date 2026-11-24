import React from 'react';
import {ProductPageTemplate} from '../../components/product/ProductPageTemplate';
import {RuleBuilder} from '../../components/product/RuleBuilder';
import {PRODUCT_PAGES} from '../../lib/productContent';

const Alerts: React.FC = () => {
  return <ProductPageTemplate data={PRODUCT_PAGES.alerts} demo={<RuleBuilder />} />;
};

export default Alerts;
