import React from 'react';
import {LegalLayout} from '../../components/legal/LegalLayout';
import {LEGAL_DOCUMENTS} from '../../lib/legalContent';

export const Privacy: React.FC = () => <LegalLayout doc={LEGAL_DOCUMENTS.privacy} />;

export default Privacy;
