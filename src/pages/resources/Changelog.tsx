import React from 'react';
import {PageHeader} from '../../components/PageHeader';
import {Timeline} from '../../components/resources/Timeline';
import {NewsletterBand} from '../../components/resources/NewsletterBand';
import {Footer} from '../../components/Footer';

export const Changelog: React.FC = () => {
  return (
    <main className="pb-4">
      <PageHeader
        tag="Changelog"
        lines={[
          <>
            What We <span className="headline-serif-accent">Shipped</span>
          </>,
        ]}
        subtitle="Weekly SDK releases, trace UI speedups, and new eval capabilities."
      />

      <Timeline />
      <NewsletterBand />
      <Footer />
    </main>
  );
};

export default Changelog;
