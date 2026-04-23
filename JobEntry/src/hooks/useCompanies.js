import { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';

/**
 * Hook to fetch all companies
 */
export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    const response = await companyAPI.getAllCompanies();
    setLoading(false);

    if (response.success) {
      setCompanies(response.data || []);
    } else {
      setError(response.error);
    }
  };

  return { companies, loading, error, refetch: fetchCompanies };
};

/**
 * Hook to fetch single company by ID
 */
export const useCompanyById = (companyId) => {
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchReviews();
    }
  }, [companyId]);

  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    const response = await companyAPI.getCompanyById(companyId);
    setLoading(false);

    if (response.success) {
      setCompany(response.data);
    } else {
      setError(response.error);
    }
  };

  const fetchReviews = async () => {
    const response = await companyAPI.getCompanyReviews(companyId);
    if (response.success) {
      setReviews(response.data || []);
    }
  };

  return { company, reviews, loading, error, refetch: fetchCompany };
};
