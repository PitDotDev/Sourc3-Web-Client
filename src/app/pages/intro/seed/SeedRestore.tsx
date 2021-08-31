import React, { useState } from 'react';

import WasmWallet from '@core/WasmWallet';

import { Button, Footer } from 'app/uikit';
import SeedList from './SeedList';

const SEED_PHRASE_COUNT = 12;

interface SeedInputProps {
  onSubmit: React.FormEventHandler;
}

const SeedRestore: React.FC<SeedInputProps> = ({ onSubmit }) => {
  const [errors, setErrors] = useState(new Array(SEED_PHRASE_COUNT).fill(null));
  const valid = errors.every((value) => value === false);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    const index = parseInt(name, 10);
    const result = !WasmWallet.isAllowedWord(value);
    if (errors[index] !== result) {
      const next = errors.slice();
      next[index] = result;

      setErrors(next);
    }
  };

  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <SeedList data={errors} onInput={handleInput} />
      <Footer>
        <Button type="submit" disabled={!valid}>
          Submit
        </Button>
      </Footer>
    </form>
  );
};

export default SeedRestore;