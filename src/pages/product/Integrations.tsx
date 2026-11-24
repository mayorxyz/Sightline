import React, {useState} from 'react';
import {ProductPageTemplate} from '../../components/product/ProductPageTemplate';
import {IntegrationDrawer} from '../../components/product/IntegrationDrawer';
import {
  DETAILED_INTEGRATIONS,
  DetailedIntegration,
  IntegrationCategory,
  PRODUCT_PAGES,
} from '../../lib/productContent';

const CATEGORIES: IntegrationCategory[] = ['All', 'Models', 'Frameworks', 'Alerts', 'Data'];

const IntegrationsDemo: React.FC = () => {
  const [category, setCategory] = useState<IntegrationCategory>('All');
  const [selected, setSelected] = useState<DetailedIntegration | null>(null);

  const items = DETAILED_INTEGRATIONS.filter(
    (item) => category === 'All' || item.category === category
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/15">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-2.5 sm:px-3 py-1 rounded-[3px] font-mono text-[10px] sm:text-[11.5px] cursor-pointer ${
                category === cat
                  ? 'bg-[#D9C4A8] text-[#0A1F6B] font-semibold'
                  : 'bg-white/10 text-white/75 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="font-mono text-[10px] sm:text-[11px] text-white/65">
          Click any tile for setup guide
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setSelected(item)}
            className="text-left rounded-[6px] bg-white/8 hover:bg-white/15 border border-white/15 p-3 sm:p-4 flex flex-col gap-2 sm:gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-[3px] bg-[#0B2FA8] text-white font-mono text-[10px] sm:text-[11px] font-semibold">
                {item.abbr}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-[#D9C4A8]">{item.category}</span>
            </div>
            <div className="text-[13px] sm:text-[15px] font-medium text-white">{item.name}</div>
          </button>
        ))}
      </div>

      <IntegrationDrawer integration={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

const Integrations: React.FC = () => {
  return <ProductPageTemplate data={PRODUCT_PAGES.integrations} demo={<IntegrationsDemo />} />;
};

export default Integrations;