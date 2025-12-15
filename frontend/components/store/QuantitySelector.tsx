import React, { useState } from 'react';

interface QuantitySelectorProps {
  units: Array<{ unit: string; multiplier: number; isDefault: boolean }>;
  onQuantityChange: (quantity: number, unit: string) => void;
}

export default function QuantitySelector({ units, onQuantityChange }: QuantitySelectorProps) {
  const defaultUnit = units.find(u => u.isDefault) || units[0];
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>(defaultUnit?.unit || 'kg');

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      onQuantityChange(newQuantity, selectedUnit);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    onQuantityChange(quantity, newUnit);
  };

  return (
    <div style={styles.container}>
      <div style={styles.quantityControl}>
        <button 
          style={styles.button}
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
          style={styles.input}
          min="0"
          step="0.1"
        />
        <button 
          style={styles.button}
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </button>
      </div>
      
      {units.length > 1 && (
        <select 
          value={selectedUnit}
          onChange={(e) => handleUnitChange(e.target.value)}
          style={styles.select}
        >
          {units.map((unit) => (
            <option key={unit.unit} value={unit.unit}>
              {unit.unit}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
  },
  button: {
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: 'var(--color-bg-light)',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  input: {
    width: '80px',
    height: '40px',
    border: 'none',
    borderLeft: '1px solid var(--color-border)',
    borderRight: '1px solid var(--color-border)',
    textAlign: 'center',
    fontSize: '16px',
    outline: 'none',
  },
  select: {
    padding: '10px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: 'white',
    outline: 'none',
  },
};
