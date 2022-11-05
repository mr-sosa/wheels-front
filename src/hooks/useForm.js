import { useState } from 'react';

export const useForm = (fields) => {
  const [formData, setFormData] = useState(fields || {});
  const reset = () => {
    setFormData({});
  };
  const handleFormData = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return [formData, handleFormData, reset];
};
