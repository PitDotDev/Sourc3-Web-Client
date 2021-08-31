import React from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';

import { Input, Section, Select } from '@uikit';
import { GROTHS_IN_BEAM } from '@app/state/shared';
import Title from '@app/uikit/Title';
import { useStore } from 'effector-react';
import {
  $amount, $asset, $options, $selected, onAmountInput, setSelected,
} from './model';

const selectClassName = css`
  align-self: center;
`;

const RowStyled = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 20px;
`;

const containerStyle = css`
  flex-grow: 1;
`;

const AmountInput: React.FC = () => {
  const amount = useStore($amount);
  const selected = useStore($selected);
  const options = useStore($options);
  const asset = useStore($asset);
  const total = asset.available / GROTHS_IN_BEAM;

  return (
    <Section title="Amount" variant="gray">
      <RowStyled>
        <Input variant="send" value={amount} maxLength={17} className={containerStyle} onInput={onAmountInput} />
        <Select
          options={options}
          selected={selected}
          className={selectClassName}
          onSelect={(value) => setSelected(value)}
        />
      </RowStyled>
      <Title variant="subtitle">Available</Title>
      {`${total} ${asset.name}`}
    </Section>
  );
};

export default AmountInput;