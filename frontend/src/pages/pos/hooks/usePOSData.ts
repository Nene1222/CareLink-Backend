import { useState, useEffect } from 'react';
import type{ Medicine, Service } from '../types';

export const usePOSData = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medicinesRes, servicesRes] = await Promise.all([
          fetch('/data/medicines.json'),
          fetch('/data/services.json'),
        ]);

        if (!medicinesRes.ok || !servicesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const medicinesData = await medicinesRes.json();
        const servicesData = await servicesRes.json();

        setMedicines(medicinesData);
        setServices(servicesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { medicines, services, loading, error };
};
