import React from 'react';
import '../../assets/style/inventory/batchesTable.css';

interface Batch {
  id: string;
  batchNo?: string;
  supplier?: string;
  expiry_date?: string;
  expiryDate?: string;
  quantity?: number;
  qty?: number;
  remaining?: number;
  purchase_date?: string;
  purchaseDate?: string;
  expirationStatus?: 'expired' | 'expiring_soon' | 'ok';
  expirationMessage?: string;
  daysUntilExpiry?: number;
}

interface BatchesTableProps {
  batches: Batch[];
  onDetailClick: (batchId: string) => void;
}

const BatchesTable: React.FC<BatchesTableProps> = ({ batches, onDetailClick }) => {
  return (
    <div className="batches-table-wrapper">
      <table className="batches-table">
        <thead>
          <tr>
            <th>Batch No</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Qty</th>
            <th>Remaining</th>
            <th>Purchase Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, index) => {
            const expiryDate = batch.expiry_date || batch.expiryDate || '';
            const qty = batch.quantity || batch.qty || 0;
            const remaining = batch.remaining || qty;
            const purchaseDate = batch.purchase_date || batch.purchaseDate || '';
            const batchNo = batch.batchNo || `BATCH-${batch.id.slice(-6)}`;
            const status = batch.expirationStatus || 'ok';
            const statusMessage = batch.expirationMessage || '';
            
            // Format date for display
            const formatDate = (dateStr: string) => {
              if (!dateStr) return '-';
              try {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
              } catch {
                return dateStr;
              }
            };

            // Get status styling
            const getStatusClass = () => {
              if (status === 'expired') return 'status-expired';
              if (status === 'expiring_soon') return 'status-expiring-soon';
              return 'status-ok';
            };

            return (
              <tr key={batch.id} className={`${index % 2 === 0 ? 'even-row' : 'odd-row'} ${getStatusClass()}`}>
                <td className="batch-no">{batchNo}</td>
                <td className="expiry-date">{formatDate(expiryDate)}</td>
                <td className="expiry-status">
                  <span className={`status-badge ${getStatusClass()}`}>
                    {status === 'expired' && '⚠️ Expired'}
                    {status === 'expiring_soon' && '⚠️ Expiring Soon'}
                    {status === 'ok' && '✓ OK'}
                  </span>
                  {statusMessage && (
                    <span className="status-message" title={statusMessage}>
                      {statusMessage}
                    </span>
                  )}
                </td>
                <td className="qty">{qty}</td>
                <td className="remaining">{remaining}</td>
                <td className="purchase-date">{formatDate(purchaseDate)}</td>
              <td className="detail-cell">
                <button
                  className="detail-link"
                  onClick={() => onDetailClick(batch.id)}
                >
                  Detail....
                </button> 
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BatchesTable;

