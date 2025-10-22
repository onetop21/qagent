'use client';

import { useState } from 'react';

interface WebServiceFormProps {
  onSubmit: (data: {
    name: string;
    url: string;
    loginUsername: string;
    loginPassword: string;
  }) => void;
  isLoading?: boolean;
}

export default function WebServiceForm({
  onSubmit,
  isLoading,
}: WebServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    loginUsername: '',
    loginPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.url) newErrors.url = 'URL is required';
    else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = 'Must be a valid URL (http:// or https://)';
    }
    if (!formData.loginUsername) newErrors.loginUsername = 'Username is required';
    if (!formData.loginPassword) newErrors.loginPassword = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          placeholder="My Web Service"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          placeholder="https://example.com"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Login Username
        </label>
        <input
          type="text"
          name="loginUsername"
          value={formData.loginUsername}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          placeholder="username"
        />
        {errors.loginUsername && (
          <p className="mt-1 text-sm text-red-600">{errors.loginUsername}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Login Password
        </label>
        <input
          type="password"
          name="loginPassword"
          value={formData.loginPassword}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          placeholder="••••••••"
        />
        {errors.loginPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.loginPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Saving...' : 'Save Web Service'}
      </button>
    </form>
  );
}
