import { Link } from 'react-router-dom';
import { Mail, Phone, Building2, UserPlus } from 'lucide-react';
import type { DealDetail } from '../../../../shared/types/deal';

interface Props {
  deal: DealDetail;
}

export default function LinkedContactCard({ deal }: Props) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Contacts</p>

      {deal.personName ? (
        <div className="flex items-start gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
            style={{ backgroundColor: deal.ownerColor }}
          >
            {deal.personName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <Link
              to={`/contacts/${deal.personId}`}
              className="text-sm font-medium hover:underline truncate block"
              style={{ color: '#6F6EE8' }}
            >
              {deal.personName}
            </Link>
            {deal.personJobTitle && <p className="text-xs text-gray-400 truncate">{deal.personJobTitle}</p>}
            {deal.personEmail && (
              <a href={`mailto:${deal.personEmail}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 mt-0.5 truncate">
                <Mail size={10} /> {deal.personEmail}
              </a>
            )}
            {deal.personPhone && (
              <a href={`tel:${deal.personPhone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 truncate">
                <Phone size={10} /> {deal.personPhone}
              </a>
            )}
          </div>
        </div>
      ) : (
        <Link to="#" className="flex items-center gap-1 text-xs mb-3" style={{ color: '#6F6EE8' }}>
          <UserPlus size={12} /> Add person
        </Link>
      )}

      {deal.orgName && (
        <div className="flex items-start gap-2">
          <Building2 size={14} className="text-gray-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <Link
              to={`/organizations/${deal.orgId}`}
              className="text-sm font-medium hover:underline truncate block"
              style={{ color: '#6F6EE8' }}
            >
              {deal.orgName}
            </Link>
            {deal.orgAddress && <p className="text-xs text-gray-400 truncate">{deal.orgAddress}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
