import { call, put, takeLatest } from 'redux-saga/effects';
import {
  getWalletStatus,
  createAddress,
  validateAddress,
  calculateChange,
  sendTransaction,
  convertTokenToJson,
} from '@core/api';
import { AddressData, ChangeData, AssetsEvent } from '@core/types';
import { RateResponse } from '@app/containers/Wallet/interfaces';
import { resetSendData } from '@app/containers/Wallet/store/actions';
import { navigate } from '@app/shared/store/actions';
import { ROUTES } from '@app/shared/constants';
import store from '../../../../index';
import { actions } from '.';

const FETCH_INTERVAL = 310000;

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const RATE_PARAMS = 'ids=beam&vs_currencies=usd';

export function* handleTotals() {
  const { totals } = yield call(getWalletStatus);

  yield put(actions.setTotals(totals));
}

export function* handleAssets(payload: AssetsEvent) {
  yield put(actions.setAssets(payload.assets));
}

async function loadRatesApiCall() {
  const response = await fetch(`${API_URL}?${RATE_PARAMS}`);
  const promise: RateResponse = await response.json();
  return promise.beam.usd;
}

export function* loadRate() {
  try {
    const result: number = yield call(loadRatesApiCall);

    yield put(actions.loadRate.success(result));
    setTimeout(() => store.dispatch(actions.loadRate.request()), FETCH_INTERVAL);
  } catch (e) {
    yield put(actions.loadRate.failure(e));
  }
}

export function* generateAddress(action: ReturnType<typeof actions.generateAddress.request>): Generator {
  try {
    const result: string = (yield call(createAddress, action.payload) as unknown) as string;
    const sbbs: AddressData = (yield call(convertTokenToJson, result) as unknown) as AddressData;

    yield put(actions.generateAddress.success(result));
    yield put(actions.setSbbs(sbbs.peer_id));
  } catch (e) {
    yield put(actions.generateAddress.failure(e));
  }
}

export function* validateSendAddress(action: ReturnType<typeof actions.validateSendAddress.request>): Generator {
  try {
    yield put(actions.setSendTransactionState(false));
    const result: AddressData = (yield call(validateAddress, action.payload) as unknown) as AddressData;

    yield put(actions.validateSendAddress.success(result));
    yield put(actions.setSbbs(result.peer_id));
    yield put(actions.setSendTransactionState(true));
  } catch (e) {
    yield put(actions.validateSendAddress.failure(e));
  }
}

export function* validateAmount(action: ReturnType<typeof actions.validateAmount.request>): Generator {
  try {
    yield put(actions.setSendTransactionState(false));
    const result: ChangeData = (yield call(calculateChange, action.payload) as unknown) as ChangeData;

    yield put(actions.validateAmount.success(result));
    yield put(actions.setSendTransactionState(true));
  } catch (e) {
    yield put(actions.validateAmount.failure(e));
  }
}
export function* sendTransactionSaga(action: ReturnType<typeof actions.sendTransaction.request>): Generator {
  try {
    yield call(sendTransaction, action.payload);
    yield put(actions.sendTransaction.success());
    yield put(resetSendData());
    yield put(navigate(ROUTES.WALLET.PROFILE));
  } catch (e) {
    yield put(actions.sendTransaction.failure(e));
  }
}

function* walletSaga() {
  yield takeLatest(actions.loadRate.request, loadRate);
  yield takeLatest(actions.generateAddress.request, generateAddress);
  yield takeLatest(actions.validateSendAddress.request, validateSendAddress);
  yield takeLatest(actions.validateAmount.request, validateAmount);
  yield takeLatest(actions.sendTransaction.request, sendTransactionSaga);
}

export default walletSaga;
