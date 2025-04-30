import React, { useState } from 'react';

interface Faculty {
  name: string;
  dean: string;
  year: string;
  location: string;
  phone: string;
  email: string;
}

const Facultets = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [form, setForm] = useState<Faculty>({
    name: '',
    dean: '',
    year: '',
    location: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFaculties([...faculties, form]);
    setForm({
      name: '',
      dean: '',
      year: '',
      location: '',
      phone: '',
      email: '',
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Fakultet Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Fakultet nomi', name: 'name' },
          { label: 'Dekan ismi', name: 'dean' },
          { label: 'Ochilgan yili', name: 'year' },
          { label: 'Joylashuvi', name: 'location' },
          { label: 'Telefon raqam', name: 'phone' },
          { label: 'Email manzili', name: 'email', type: 'email' },
        ].map((field) => (
          <div key={field.name} className="w-full">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={form[field.name as keyof Faculty]}
              onChange={handleChange}
              placeholder={field.label}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Saqlash
          </button>
        </div>
      </form>

      {/* Jadval */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Kiritilgan fakultetlar</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nomi</th>
                <th className="px-4 py-2 text-left">Dekan</th>
                <th className="px-4 py-2 text-left">Yil</th>
                <th className="px-4 py-2 text-left">Joylashuv</th>
                <th className="px-4 py-2 text-left">Telefon</th>
                <th className="px-4 py-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {faculties.map((f, idx) => (
                <tr key={idx} className="text-sm text-gray-800 dark:text-white">
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2">{f.dean}</td>
                  <td className="px-4 py-2">{f.year}</td>
                  <td className="px-4 py-2">{f.location}</td>
                  <td className="px-4 py-2">{f.phone}</td>
                  <td className="px-4 py-2">{f.email}</td>
                </tr>
              ))}
              {faculties.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Hozircha ma'lumot yo‘q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Facultets;
