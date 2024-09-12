import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, get } from '../services/apiEndpoint';
import { toast } from 'react-hot-toast';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await get('/api/admin/getuser');
        const response = request.data;
        if (request.status === 200) {
          setUsers(response.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetUsers();
  }, []);

  const handleDelet = async (id) => {
    try {
      const request = await deleteUser(`/api/admin/delet/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter((user) => user._id !== id)); // Update the state to remove the deleted user
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="admin-container p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/3 px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="w-1/3 px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="w-1/3 px-6 py-3 text-center text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.length > 0 ? (
                users.map((elem, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap">{elem.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{elem.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelet(elem._id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
