import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {CASE_STUDIES} from '../lib/companyContent';
import {CaseStudyTemplate} from '../components/company/CaseStudyTemplate';
import {NotFound} from '../components/NotFound';
import {Footer} from '../components/Footer';

export const CustomerDetail: React.FC = () => {
  const {slug} = useParams<{slug: string}>();
  const study = CASE_STUDIES.find((c) => c.slug === slug);

  useEffect(() => {
    if (study) {
      document.title = `${study.company} Case Study — Sightline`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', study.summary);
    }
  }, [study]);

  if (!study) {
    return (
      <>
        <NotFound />
        <Footer />
      </>
    );
  }

  return (
    <main className="pb-4">
      <CaseStudyTemplate study={study} />
      <Footer />
    </main>
  );
};

export default CustomerDetail;
