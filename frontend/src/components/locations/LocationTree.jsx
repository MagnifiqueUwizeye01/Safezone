import React, { useState, useEffect } from 'react';
import locationService from '../../api/services/locationService';
import Spinner from '../common/Spinner';

const LocationTree = ({ onLocationSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Error loading provinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const loadChildren = async (location, parentElement) => {
    if (location.children) return; // Already loaded

    try {
      const children = await locationService.getChildrenByParentCode(location.code);
      location.children = children;
      parentElement.forceUpdate();
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };

  const renderLocation = (location, level = 0) => {
    const hasChildren = location.type !== 'VILLAGE';
    const isExpanded = expandedNodes.has(location.id);

    return (
      <div key={location.id} className="location-tree-node" style={{ paddingLeft: `${level * 20}px` }}>
        <div className="location-tree-item">
          {hasChildren && (
            <button
              className="location-tree-toggle"
              onClick={() => {
                toggleNode(location.id);
                if (!isExpanded && !location.children) {
                  loadChildren(location, this);
                }
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          <span
            className="location-tree-label"
            onClick={() => onLocationSelect && onLocationSelect(location)}
          >
            {location.name} ({location.code})
          </span>
        </div>
        {isExpanded && location.children && (
          <div className="location-tree-children">
            {location.children.map((child) => renderLocation(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="location-tree">
      {provinces.map((province) => renderLocation(province))}
    </div>
  );
};

export default LocationTree;

