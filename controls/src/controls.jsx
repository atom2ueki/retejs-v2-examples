import React from 'react';
import { ClassicPreset } from 'rete';

export class TextControl extends ClassicPreset.InputControl {
  constructor(key, config) {
    super(key, { ...config, type: 'text' });
  }
}

export class NumberControl extends ClassicPreset.InputControl {
  constructor(key, config) {
    super(key, { ...config, type: 'number' });
  }
}

export class CustomControl extends ClassicPreset.Control {
  constructor(key, initial) {
    super(key);
    this.value = initial.initial || '';
  }

  setValue(value) {
    this.value = value;
    this.trigger('change', this.value);
  }

  // The render function that will be used by the React plugin
  component({ value, onChange }) {
    return (
      <div style={{ padding: '8px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>
          Custom control:
        </label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%'
            }}
          />
          <button
            onClick={() => onChange('reset')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
}