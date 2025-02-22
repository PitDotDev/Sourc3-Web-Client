/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import {
  AmountInput, Button, Input, Rate, Section, Title, Window,
} from '@app/shared/components';

import { IconCancel } from '@app/shared/icons';

import { styled } from '@linaria/react';
import LabeledToggle from '@app/shared/components/LabeledToggle';
import { css } from '@linaria/core';
import {
  compact, convertLowAmount, fromGroths, toGroths, truncate,
} from '@core/utils';
import { useFormik } from 'formik';

import {
  AddressLabel, AddressTip, AmountError, ASSET_BLANK, FEE_DEFAULT,
} from '@app/containers/Wallet/constants';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '@app/shared/constants';
import {
  resetSendData,
  sendTransaction,
  setSelectedAssetId,
  validateAmount,
  validateSendAddress,
} from '@app/containers/Wallet/store/actions';
import {
  selectAssetChange,
  selectAssets,
  selectChange,
  selectIsSendReady,
  selectSelectedAssetId,
  selectSendAddressData,
  selectSendFee,
} from '@app/containers/Wallet/store/selectors';
import { AssetTotal, TransactionAmount } from '@app/containers/Wallet/interfaces';
import { AddressData } from '@core/types';
import { FullAddress, SendConfirm } from '@app/containers';

const WarningStyled = styled.div`
  margin: 0px -20px 20px -20px;
  font-style: italic;
  color: var(--color-gray);
`;
const WrapperAvailable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const maxButtonStyle = css`
  position: absolute;
  top: 38px;
  right: 12px;
  border-radius: 4px !important;
}
`;

const formClassName = css`
  padding: 0 24px;
  & > div:not:first-child {
    &div:first-child {
      padding: 0 0 4px 0;
    }
  }
`;
const titleClassName = css`
  margin-bottom: 16px;
`;
const availableClassName = css`
  font-weight: 500;
  font-size: 18px;
`;
const typeClassNames = css`
  margin-bottom: -32px;
`;
const buttonClassName = css`
position absolute;
bottom: 40px;
left:56px;
`;
const warningClassNames = css`
  margin-top: 8px;
  margin-bottom: 40px;
  text-align: left;
  height: auto;
`;

interface SendFormData {
  address: string;
  offline: boolean;
  send_amount: TransactionAmount;
  comment: string;
  misc: {
    beam: AssetTotal;
    selected: AssetTotal;
    fee: number;
    addressData: AddressData;
  };
}

const validate = async (values: SendFormData, setHint: (string) => void) => {
  const errors: any = {};
  const {
    addressData, selected, beam, fee,
  } = values.misc;

  if (!values.address.length) {
    errors.address = '';
  }

  if ((values.address.length && !addressData.is_valid) || addressData.type === 'unknown') {
    errors.address = AddressLabel.ERROR;
  }

  if (values.offline && addressData.type !== 'max_privacy' && addressData.type !== 'public_offline') {
    const warning = addressData.payments > 1
      ? 'transactions left.'
      : 'transaction left. Ask receiver to come online to support more offline transactions.';

    const label = `${AddressLabel.OFFLINE} ${addressData.payments} ${warning}`;
    setHint(label);
  } else if (addressData.type === 'max_privacy' && values.address.length) {
    setHint(AddressLabel.MAX_PRIVACY);
  } else if (addressData.type === 'public_offline' && values.address.length) {
    setHint(AddressLabel.PUBLIC_OFFLINE);
  } else {
    setHint('');
  }

  if (!values.send_amount.amount.length) {
    errors.send_amount = '';
  }

  const { send_amount } = values;
  const { available } = selected;
  const value = toGroths(parseFloat(send_amount.amount));

  const total = value + (send_amount.asset_id === 0 ? fee : 0);

  if (
    Number(send_amount.amount) < 0.00000001
    && Number(send_amount.amount) !== 0
    && send_amount.amount !== ''
    && send_amount.asset_id === 0
  ) {
    errors.send_amount = AmountError.LESS;
  }

  if (beam.available < fee) {
    errors.send_amount = AmountError.FEE;
  }

  if (total > available) {
    const max = fromGroths(available - (send_amount.asset_id === 0 ? fee : 0));
    errors.send_amount = `${AmountError.AMOUNT} ${max} ${truncate(selected.metadata_pairs.UN)}`;
  }

  return errors;
};

const SendForm = () => {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [focus, setFocus] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [validateInterval, setValidateInterval] = useState<null | NodeJS.Timer>(null);
  const [validateAmountInterval, setValidateAmountInterval] = useState<null | NodeJS.Timer>(null);
  const addressData = useSelector(selectSendAddressData());

  const [warning, setWarning] = useState('');
  const [hint, setHint] = useState('');
  const [selected, setSelected] = useState(ASSET_BLANK);

  const assets = useSelector(selectAssets());

  const fee = useSelector(selectSendFee());
  const change = useSelector(selectChange());
  const asset_change = useSelector(selectAssetChange());
  const is_send_ready = useSelector(selectIsSendReady());
  const selected_asset_id = useSelector(selectSelectedAssetId());

  const beam = useMemo(() => assets.find((a) => a.asset_id === 0), [assets]);

  const formik = useFormik<SendFormData>({
    initialValues: {
      address: '',
      offline: false,
      send_amount: {
        amount: '',
        asset_id: 0,
      },
      comment: '',
      misc: {
        addressData,
        fee,
        beam,
        selected,
      },
    },
    isInitialValid: false,
    validate: (e) => validate(e, setHint),
    onSubmit: (values) => {
      setShowConfirm(true);
    },
  });

  const {
    values, setFieldValue, errors, submitForm,
  } = formik;

  const { type: addressType } = addressData;

  const compactAddress = compact(values.address, 15);

  useEffect(() => {
    if (selected_asset_id !== 0) {
      const current_asset = assets.find((a) => a.asset_id === selected_asset_id);

      setSelected(current_asset);
      setFieldValue('send_amount', { amount: 0, asset_id: selected_asset_id }, true);
      setFieldValue('misc.selected', current_asset, true);
    }
  }, [selected_asset_id, setFieldValue, assets, dispatch]);

  useEffect(
    () => () => {
      dispatch(resetSendData());
      dispatch(setSelectedAssetId(0));
    },
    [dispatch],
  );

  useEffect(() => {
    const currentSelected = JSON.stringify(selected);
    const defaultStateSelected = JSON.stringify(ASSET_BLANK);
    if (currentSelected === defaultStateSelected) {
      setSelected(beam);
      setFieldValue('misc.selected', beam, true);
    }
  }, [selected, beam, setFieldValue]);

  const validateAmountHandler = (total: TransactionAmount, offline: boolean) => {
    const { amount, asset_id } = total;

    if (amount === '0' || !amount) {
      setFieldValue('send_amount', total, true);
      return;
    }

    const value = toGroths(parseFloat(amount));

    const ttl = value + fee;

    setFieldValue('send_amount', total, true);

    if (validateAmountInterval) {
      clearTimeout(validateAmountInterval);
      setValidateAmountInterval(null);
    }
    const i = setTimeout(() => {
      dispatch(
        validateAmount.request({
          amount: toGroths(+amount),
          asset_id,
          is_push_transaction: offline,
        }),
      );
    }, 200);
    setValidateAmountInterval(i);
  };

  useEffect(() => {
    if (values.address.length) {
      setFieldValue('misc.addressData', addressData, true);
      if (addressData.amount && addressData.asset_id) {
        setFieldValue('send_amount', { amount: addressData.amount, asset_id: addressData.asset_id }, true);
      }

      if (addressData.type === 'max_privacy') {
        setWarning(AddressTip.MAX_PRIVACY);
        setHint(AddressLabel.MAX_PRIVACY);

        validateAmountHandler(values.send_amount, true);
        return;
      }
      if (addressData.type === 'public_offline') {
        setWarning(AddressTip.OFFLINE);
        setHint(AddressLabel.OFFLINE);
        setFieldValue('offline', true, false);
        validateAmountHandler(values.send_amount, true);
        return;
      }
      if (addressData.type === 'regular') {
        setWarning(AddressTip.REGULAR);
        setHint(AddressLabel.REGULAR);
        setFieldValue('offline', false, true);
        validateAmountHandler(values.send_amount, false);
        return;
      }

      validateAmountHandler(values.send_amount, values.offline);

      if (values.offline) {
        setWarning(AddressTip.OFFLINE);
        return;
      }
      if (addressData.is_valid) {
        setWarning(AddressTip.REGULAR);
      }
    }
  }, [addressData, values, fee, setFieldValue]);

  const groths = fromGroths(selected.available);

  const validateAddressHandler = (address: string) => {
    if (validateInterval) {
      clearTimeout(validateInterval);
      setValidateInterval(null);
    }
    const i = setTimeout(() => {
      dispatch(validateSendAddress.request(address));
    }, 200);
    setValidateInterval(i);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFieldValue('address', value, true);
    if (value.length) validateAddressHandler(value);
  };

  const handleAssetChange = (e: TransactionAmount) => {
    const isMaxPrivacy = addressData.type === 'max_privacy';

    setFieldValue('send_amount', e, true);
    const asset = assets.find(({ asset_id: id }) => id === e.asset_id) ?? ASSET_BLANK;
    setSelected(asset);
    setFieldValue('misc.selected', asset, true);
    validateAmountHandler(e, values.offline || isMaxPrivacy);
  };

  const handleMaxAmount = (offline?: boolean) => {
    const { available } = selected;
    const { send_amount } = values;
    const isMaxPrivacy = addressData.type === 'max_privacy';
    let currentFee = values.offline || isMaxPrivacy || offline ? 1100000 : fee;

    if (typeof offline !== 'undefined') {
      currentFee = offline ? 1100000 : FEE_DEFAULT;
    }
    const total = send_amount.asset_id === 0 ? Math.max(available - currentFee, 0) : available;
    const new_amount = fromGroths(total).toString();

    const amount = {
      asset_id: send_amount.asset_id,
      amount: new_amount,
    };

    setFieldValue('send_amount', amount, true);

    validateAmountHandler(amount, values.offline || isMaxPrivacy || offline);
  };

  const handleOffline = (e: boolean) => {
    setFieldValue('offline', e, true);
    const { send_amount } = values;
    const { amount, asset_id } = send_amount;
    if (amount === '0') {
      validateAmountHandler(values.send_amount, e);
    } else if (asset_id === 0) {
      const { available } = selected;
      const value = Number(amount);
      const val = available - toGroths(value);

      if (fromGroths(val) < 1) {
        handleMaxAmount(e);
      }
    }
  };

  const getAddressHint = () => {
    if (!values.address.length) return '';
    if (!is_send_ready && values.address.length && errors.address) return '';
    if (errors.address) return errors.address;
    if (hint) return hint;
    if (values.address.length) return AddressLabel.REGULAR;
    return '';
  };

  const submitSend = useCallback(() => {
    const {
      send_amount, address, offline, comment,
    } = values;
    const isMaxPrivacy = addressData.type === 'max_privacy';
    const value = send_amount.amount === '' ? 0 : toGroths(parseFloat(send_amount.amount));

    const transactionPayload = {
      fee,
      value,
      address,
      comment,
      asset_id: send_amount.asset_id,
      offline: offline || isMaxPrivacy,
    };

    dispatch(sendTransaction.request(transactionPayload));
  }, [values, fee, addressData, dispatch]);

  const handlePrevious: React.MouseEventHandler = () => {
    setShowConfirm(false);
  };

  const isFormDisabled = () => {
    if (!is_send_ready) return !is_send_ready;
    if (!formik.isValid) return !formik.isValid;
    return false;
  };

  const isAddressValid = () => {
    if (!values.address.length) return true;

    return !(is_send_ready && errors.address);
  };

  return (
    <Window title="Send" onPrevious={showConfirm ? handlePrevious : undefined}>
      {!showConfirm ? (
        <form className={formClassName} onSubmit={submitForm}>
          <Section title="Send to" variant="gray">
            <Input
              variant="gray"
              label={getAddressHint()}
              valid={isAddressValid()}
              placeholder="Paste the recipient address"
              value={focus ? values.address : compactAddress}
              onInput={handleAddressChange}
              className="send-input"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
            {values.address && <IconCancel className="cancel-button" onClick={() => setFieldValue('address', '')} />}
          </Section>
          <Section title="Amount" variant="gray">
            <AmountInput
              value={values.send_amount.amount}
              asset_id={values.send_amount.asset_id}
              error={errors.send_amount?.toString()}
              onChange={(e) => handleAssetChange(e)}
              pallete="black"
            />
          </Section>
          {values.address && addressType === 'offline' && (
            <Section title="Transaction type" variant="gray" className={typeClassNames}>
              <LabeledToggle left="online" right="offline" value={values.offline} onChange={(e) => handleOffline(e)} />
            </Section>
          )}
          <Section variant="send">
            <Title variant="regular" className={titleClassName}>
              Available
            </Title>
            <WrapperAvailable>
              <div className={availableClassName}>
                {`${convertLowAmount(groths)} ${truncate(selected.metadata_pairs.N)}`}
              </div>
              {selected.asset_id === 0 && !errors.send_amount && <Rate value={groths} />}
              {groths > 0 && (
                <Button variant="max" pallete="orange" className={maxButtonStyle} onClick={() => handleMaxAmount()}>
                  max
                </Button>
              )}
            </WrapperAvailable>
          </Section>
          {/* <Section title="Comment" variant="gray" collapse>
          <Input
            variant="gray"
            value={comment}
            onInput={onCommentChange}
          />
        </Section> */}
          {warning && (
            <Section variant="warning" className={warningClassNames}>
              {warning}
            </Section>
          )}
          <Button
            className={!warning ? `${buttonClassName}` : ''}
            pallete="orange"
            type="submit"
            disabled={isFormDisabled()}
          >
            Next
          </Button>
        </form>
      ) : (
        <SendConfirm
          beam={beam}
          address={values.address}
          addressData={addressData}
          offline={values.offline}
          send_amount={values.send_amount}
          selected={selected}
          fee={fee}
          change={change}
          asset_change={asset_change}
          submitSend={submitSend}
        />
      )}
    </Window>
  );
};

export default SendForm;
