import React, { useState, useEffect } from 'react';
import Select from '../common/Select';
import { useLocation } from '../../context/LocationContext';
import locationService from '../../api/services/locationService';

const LocationSelector = ({ value, onChange, label = 'Location', required = false, error = null }) => {
  const { provinces } = useLocation();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [cells, setCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState('');
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      loadSectors(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSector) {
      loadCells(selectedSector);
    }
  }, [selectedSector]);

  useEffect(() => {
    if (selectedCell) {
      loadVillages(selectedCell);
    }
  }, [selectedCell]);

  const loadDistricts = async (provinceCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(provinceCode);
      setDistricts(data);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const loadSectors = async (districtCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(districtCode);
      setSectors(data);
    } catch (error) {
      console.error('Error loading sectors:', error);
    }
  };

  const loadCells = async (sectorCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(sectorCode);
      setCells(data);
    } catch (error) {
      console.error('Error loading cells:', error);
    }
  };

  const loadVillages = async (cellCode) => {
    try {
      const data = await locationService.getChildrenByParentCode(cellCode);
      setVillages(data);
      if (data.length > 0 && onChange) {
        onChange(data[0].id);
      }
    } catch (error) {
      console.error('Error loading villages:', error);
    }
  };

  const provinceOptions = provinces.map((p) => ({
    value: p.code,
    label: p.name,
  }));

  return (
    <div className="location-selector">
      <Select
        label={label}
        name="province"
        value={selectedProvince}
        onChange={(e) => {
          setSelectedProvince(e.target.value);
          setSelectedDistrict('');
          setSelectedSector('');
          setSelectedCell('');
          setDistricts([]);
          setSectors([]);
          setCells([]);
          setVillages([]);
        }}
        options={[{ value: '', label: 'Select Province' }, ...provinceOptions]}
        required={required}
        error={error}
      />
      {selectedProvince && districts.length > 0 && (
        <Select
          label="District"
          name="district"
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedSector('');
            setSelectedCell('');
            setSectors([]);
            setCells([]);
            setVillages([]);
          }}
          options={[{ value: '', label: 'Select District' }, ...districts.map(d => ({ value: d.code, label: d.name }))]}
        />
      )}
      {selectedDistrict && sectors.length > 0 && (
        <Select
          label="Sector"
          name="sector"
          value={selectedSector}
          onChange={(e) => {
            setSelectedSector(e.target.value);
            setSelectedCell('');
            setCells([]);
            setVillages([]);
          }}
          options={[{ value: '', label: 'Select Sector' }, ...sectors.map(s => ({ value: s.code, label: s.name }))]}
        />
      )}
      {selectedSector && cells.length > 0 && (
        <Select
          label="Cell"
          name="cell"
          value={selectedCell}
          onChange={(e) => {
            setSelectedCell(e.target.value);
            setVillages([]);
          }}
          options={[{ value: '', label: 'Select Cell' }, ...cells.map(c => ({ value: c.code, label: c.name }))]}
        />
      )}
      {selectedCell && villages.length > 0 && (
        <Select
          label="Village"
          name="village"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          options={[{ value: '', label: 'Select Village' }, ...villages.map(v => ({ value: v.id, label: v.name }))]}
          required={required}
        />
      )}
    </div>
  );
};

export default LocationSelector;

