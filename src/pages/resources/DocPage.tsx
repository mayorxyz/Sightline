import React, {useEffect, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {DOC_PAGES} from '../../lib/resourcesContent';
import {DocsLayout} from '../../components/resources/DocsLayout';
import {DocPageView} from '../../components/resources/DocPage';
import {NotFound} from '../../components/NotFound';

export const DocPage: React.FC = () => {
  const {slug} = useParams<{slug: string}>();
  const doc = DOC_PAGES.find((d) => d.slug === slug);

  useEffect(() => {
    if (doc) {
      document.title = `${doc.title} — Sightline Docs`;
    }
  }, [doc]);

  const headings = useMemo(
    () => (doc ? doc.sections.map((s) => ({id: s.id, label: s.heading})) : []),
    [doc]
  );

  if (!doc) {
    return <NotFound />;
  }

  return (
    <DocsLayout tocHeadings={headings}>
      <DocPageView doc={doc} />
    </DocsLayout>
  );
};

export default DocPage;
