import React from 'react';
import {LegalLayout} from '../../components/legal/LegalLayout';
import {LEGAL_DOCUMENTS} from '../../lib/legalContent';

export const Security: React.FC = () => <LegalLayout doc={LEGAL_DOCUMENTS.security} />;

export default Security;
