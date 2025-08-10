import { useState, useEffect } from 'react';

const defaultForm = {
  ww_bill_code: '',
  received_date: '',
  invoice_no: '',
  sanctioned_amount: '',
  cash_value: '',
  profit: '',
};

const RecordForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm(defaultForm);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="ww_bill_code" placeholder="WW Bill Code" value={form.ww_bill_code} onChange={handleChange} />
      <input name="received_date" type="date" value={form.received_date} onChange={handleChange} />
      <input name="invoice_no" placeholder="Invoice No" value={form.invoice_no} onChange={handleChange} />
      <input name="sanctioned_amount" placeholder="Sanctioned" value={form.sanctioned_amount} onChange={handleChange} />
      <input name="cash_value" placeholder="Cash Value" value={form.cash_value} onChange={handleChange} />
      <input name="profit" placeholder="Profit" value={form.profit} onChange={handleChange} />
      <button type="submit">{initialData ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default RecordForm;
