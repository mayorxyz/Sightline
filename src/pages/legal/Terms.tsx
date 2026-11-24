import React from 'react';
import {LegalLayout} from '../../components/legal/LegalLayout';
import {LEGAL_DOCUMENTS} from '../../lib/legalContent';

export const Terms: React.FC = () => <LegalLayout doc={LEGAL_DOCUMENTS.terms} />;

export default Terms;
