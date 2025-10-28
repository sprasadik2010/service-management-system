import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { serviceRequestAPI } from '../services/api';

export default function ServiceRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadRequestDetails();
  }, [id]);

  const loadRequestDetails = async () => {
    try {
      const [requestResponse, activitiesResponse] = await Promise.all([
        serviceRequestAPI.getById(id),
        serviceRequestAPI.getActivities(id)
      ]);
      
      setRequest(requestResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error loading request details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await serviceRequestAPI.update(id, {
        status: newStatus,
        user_id: 2 // In real app, get from auth context
      });
      await loadRequestDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const updatePriority = async (newPriority) => {
    setUpdating(true);
    try {
      await serviceRequestAPI.update(id, {
        priority: newPriority,
        user_id: 2 // In real app, get from auth context
      });
      await loadRequestDetails();
    } catch (error) {
      console.error('Error updating priority:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!request) {
    return <div className="text-center text-red-600">Service request not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
          <div className="flex space-x-2">
            <select
              value={request.priority}
              onChange={(e) => updatePriority(e.target.value)}
              disabled={updating}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
            
            <select
              value={request.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="font-medium">Department:</span> {request.department?.name}
          </div>
          <div>
            <span className="font-medium">Created by:</span> {request.user?.name}
          </div>
          <div>
            <span className="font-medium">Created:</span> {new Date(request.created_at).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(request.updated_at).toLocaleString()}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{request.description}</p>
        </div>

        {request.screenshot_path && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Screenshot</h3>
            <img 
              src={`http://localhost:8000/${request.screenshot_path}`} 
              alt="Screenshot" 
              className="max-w-md border rounded"
            />
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Log</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <p className="text-gray-800">{activity.description}</p>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {new Date(activity.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">By: {activity.user?.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};