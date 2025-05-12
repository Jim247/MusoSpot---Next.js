import React, { useState } from 'react';
import type { UserDashboard } from '@constants/users';

interface EquipmentSectionEditableProps {
  profile: UserDashboard;
  onUpdateEquipment: (equipment: { transport: boolean; paSystem: boolean; lighting: boolean }) => void | Promise<void>;
}

const EquipmentSectionEditable: React.FC<EquipmentSectionEditableProps> = ({ profile, onUpdateEquipment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [equipment, setEquipment] = useState({
    transport: !!profile.transport,
    paSystem: !!profile.paSystem,
    lighting: !!profile.lighting,
  });
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    setEquipment({
      transport: !!profile.transport,
      paSystem: !!profile.paSystem,
      lighting: !!profile.lighting,
    });
  }, [profile.transport, profile.paSystem, profile.lighting]);

  const handleChange = (field: keyof typeof equipment, value: boolean) => {
    setEquipment((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await onUpdateEquipment(equipment);
    setMessage('Equipment updated successfully');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setEquipment({
      transport: !!profile.transport,
      paSystem: !!profile.paSystem,
      lighting: !!profile.lighting,
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="bg-white rounded-lg p-6 relative" >
        {!isEditing && (
    <button
      className="btn-primary absolute bottom-3 right-3"
      onClick={() => setIsEditing(true)}
    >
      Edit
    </button>
  )}
      <div className="mb-6 flex flex-col relative">
      <div className="mb-2 relative">
        
  <h3 className="text-gray-700 font-semibold">Equipment</h3>
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <span>Own Transport?</span>
              <select
                value={equipment.transport ? 'true' : 'false'}
                onChange={e => handleChange('transport', e.target.value === 'true')}
                className="border rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own PA System?</span>
              <select
                value={equipment.paSystem ? 'true' : 'false'}
                onChange={e => handleChange('paSystem', e.target.value === 'true')}
                className="border rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own Lighting?</span>
              <select
                value={equipment.lighting ? 'true' : 'false'}
                onChange={e => handleChange('lighting', e.target.value === 'true')}
                className="border rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <div className="flex gap-2 mt-2">
              <button className="btn-primary" onClick={handleSave}>Save</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <ul className="text-gray-600 space-y-2">
            <li>
              Own Transport: <span className="font-semibold">{profile.transport ? 'Yes' : 'No'}</span>
            </li>
            <li>
              Own PA System: <span className="font-semibold">{profile.paSystem ? 'Yes' : 'No'}</span>
            </li>
            <li>
              Own Lighting: <span className="font-semibold">{profile.lighting ? 'Yes' : 'No'}</span>
            </li>
          </ul>
        )}
        {message && <p className="text-green-500 text-sm mt-1">{message}</p>}
      </div>
    </div>
  );
};

export default EquipmentSectionEditable;
