import {
  createEffect, createEvent, createStore, restore,
} from 'effector';

import { ErrorMessage } from '@core/WasmWallet';
import { deleteWallet, getVersion, loadBackgroundLogs } from '@app/core/api';
import React from 'react';

import { ROUTES } from '@app/shared/constants';
import { navigate } from '@app/shared/store/actions';
import store from '../../../../index';

export const deleteWalletFx = createEffect<string, string, ErrorMessage>(deleteWallet);

export const $error = createStore<ErrorMessage>(null);

export const resetError = createEvent();

export const getVersionFx = createEffect(getVersion);

export const $version = restore(
  getVersionFx.doneData.map((data) => data),
  {
    beam_branch_name: '',
    beam_version: '',
  },
);

export const loadLogsFx = createEffect(loadBackgroundLogs);

export const $logs = restore(loadLogsFx.doneData, '');

export const onInput = createEvent<React.ChangeEvent<HTMLInputElement>>();

$error.on(deleteWalletFx.failData, (state, payload) => payload);
$error.reset(deleteWalletFx.done, resetError, onInput);

deleteWalletFx.done.watch(() => {
  store.dispatch(navigate(ROUTES.AUTH.RESTORE));
});
