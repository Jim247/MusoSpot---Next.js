import React, { useState, useRef } from 'react';

interface Props {
  value: string;
  onChange: (postcode: string) => void;
  required?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
}

export const PostcodeAutocomplete: React.FC<Props> = ({
  value,
  onChange,
  required = false,
  placeholder = 'e.g. SW1A 1AA',
  id = 'postcode',
  name = 'postcode',
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number>();

  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes?q=${encodeURIComponent(input)}`);
      const data: { result: Array<{ postcode: string }> } = await res.json();
      if (data.result && Array.isArray(data.result)) {
        setSuggestions(data.result.map((item) => item.postcode));
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    onChange(input);
    setShowSuggestions(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => fetchSuggestions(input), 200);
  };

  const handleSelect = (postcode: string) => {
    onChange(postcode);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        className="w-full border rounded px-3 py-2 uppercase"
        type="text"
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        onFocus={() => value.length > 2 && setShowSuggestions(true)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-auto">
          {suggestions.map((postcode) => (
            <li
              key={postcode}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelect(postcode)}
            >
              {postcode}
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="absolute right-2 top-2 text-xs text-gray-400">Loading...</div>}
    </div>
  );
};

export default PostcodeAutocomplete;
