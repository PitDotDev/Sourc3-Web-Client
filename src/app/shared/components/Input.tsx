import React, { useState } from 'react';
import { styled } from '@linaria/react';
import Button from '@app/shared/components/Button';
import { EyeIcon, IconEye } from '../icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valid?: boolean;
  variant?: 'regular' | 'gray' | 'amount' | 'send' | 'ghost';
  pallete?: 'purple' | 'blue' | 'corn-flower-blue' | 'black';
  margin?: 'none' | number;
  password?: boolean;
  length?: number;
}

const ContainerStyled = styled.div<InputProps>`
  position: relative;
  height: auto;
  margin-bottom: ${({ margin }) => (margin === 'none' ? 0 : margin)}px;
  .eye {
    display: none !important;
  }
  &:focus-within > .eye {
    display: inline-block !important;
  }
`;

const InputStyled = styled.input<InputProps>`
  width: 100%;
  height: 44px;
  line-height: 20px;
  font-weight: 400;
  background-color: ${({ valid }) => (valid ? 'rgba(0,0,0,0.03)' : 'rgba(234,0,0,0.03)')};
  border: 1px solid ${({ length }) => (length > 0 ? 'rgba(0,0,0,0.05)' : 'transparent')};
  font-size: 16px;
  color: ${({ valid }) => (valid ? 'rgba(0,0,0)' : 'var(--color-red)')};
  border-radius: 8px;
  caret-color: orange;
  padding: 0 41px 0 10px;
  &[type='password'] {
    letter-spacing: 4px !important;
  }

  &::placeholder {
    font-family: PublicSans;
    color: rgba(0, 0, 0, 0.3);
    font-size: 16px;
    transform: translateX(1px);
    letter-spacing: 0;
    font-weight: 400;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus {
    border-color: ${({ valid }) => (valid ? ' rgba(0, 0, 0)' : 'var(--color-red)')};
  }
`;

const InputRegularStyled = styled(InputStyled)`
  &:focus {
    border-color: ${({ valid }) => (valid ? ' rgba(0, 0, 0)' : 'var(--color-red)')};
  }
`;

const InputGrayStyled = styled(InputStyled)`
  width:327px
  border-width: 1px;
  border-color: ${({ valid }) => (valid ? 'rgba(255,255,255,0.3)' : 'var(--color-red)')};
  &:focus{
    border-color: ${({ valid }) => (valid ? ' rgba(0, 0, 0)' : 'var(--color-red)')};
  }
  
`;
const InputGhostStyled = styled(InputStyled)`
  width:327px
  border-width: 1px;
  border: none;
  background-color: #fff;
`;

const InputAmountStyled = styled(InputGrayStyled)<{ pallete: string }>`
  font-size: 20px;
  font-weight: 400;
  line-height: 29px;
  color: ${({ pallete }) => `var(--color-${pallete})`};
  &::placeholder {
    font-family: VisbyCF;
    color: rgba(0, 0, 0, 0.5);
    font-size: 20px;
    transform: translateX(1px);
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const LabelStyled = styled.div<InputProps>`
  color: ${({ valid }) => (valid ? 'rgba(0,0,0, 0.5)' : 'var(--color-red)')};
  padding: 4px 10px 0 10px;
  text-align: left;
  font-weight: 600;
`;
const LabelSendStyled = styled.div<InputProps>`
  margin-top: 4px;
  color: ${({ valid }) => (valid ? 'rgba(0,0,0, 0.5)' : 'var(--color-red)')};
  width: 327px;
  padding: 12px
  background: rgba(255, 121, 31, 0.1);
  border: 1px solid rgba(255, 121, 31, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label, valid = true, variant = 'regular', margin = 'none', pallete, className, password, length = 0, ...rest
    },
    ref,
  ) => {
    const InputComponent = {
      regular: InputRegularStyled,
      gray: InputGrayStyled,
      amount: InputAmountStyled,
      send: LabelSendStyled,
      ghost: InputGhostStyled,
    }[variant];
    const [passwordShown, setPasswordShown] = useState(false);
    const handleShowPassword: React.MouseEventHandler = () => {
      setPasswordShown(!passwordShown);
    };

    // const [inputVisible, setInputVisible] = useState(false);
    // const [inputValue, setInputValue] = useState(rest.value ?? '');

    // const inputHandler = (e) => {
    //   if (rest?.onChange) rest?.onChange(e);
    //   setInputValue(e.target.value);
    // };

    return (
      <ContainerStyled className={className} margin={margin}>
        {password ? (
          <>
            <InputComponent
              ref={ref}
              valid={valid}
              pallete={pallete}
              {...rest}
              type={passwordShown ? 'text' : 'password'}
              length={length}
            />
            {!!ref && <LabelStyled valid={valid}>{label}</LabelStyled>}
            <Button
              type="button"
              className="eye"
              variant="eye"
              icon={passwordShown ? EyeIcon : IconEye}
              onClick={handleShowPassword}
            />
          </>
        ) : (
          <>
            <InputComponent ref={ref} valid={valid} pallete={pallete} {...rest} />
            {!!label && <LabelStyled valid={valid}>{label}</LabelStyled>}
          </>
        )}
      </ContainerStyled>
    );
  },
);

export default Input;
