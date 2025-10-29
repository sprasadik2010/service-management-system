import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceRequestAPI } from '../services/api';

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  important: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const ServiceRequestListCard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await serviceRequestAPI.getAll();
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto text-center"
          >
            Create New Request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No service requests found.</p>
            <p className="text-gray-400 mt-2">Create your first service request to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              >
                <div className="p-6">
                  {/* Header with title and status */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-2">
                      {request.title}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[request.status]} shrink-0 ml-2`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {request.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-3">
                    {/* Priority */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 font-medium w-20">Priority:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[request.priority]}`}>
                        {request.priority}
                      </span>
                    </div>

                    {/* Department */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 font-medium w-20">Department:</span>
                      <span className="text-sm text-gray-700">
                        {request.department?.name || 'N/A'}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 font-medium w-20">Created:</span>
                      <span className="text-sm text-gray-700">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link
                      to={`/request/${request.id}`}
                      className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors py-2 px-4 rounded-md text-sm font-medium text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestListCard;