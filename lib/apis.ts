import {Api as AuthApi} from '../src/generated/auth';
import {Api as BillingApi} from '../src/generated/billing';
import {Api as UnifiedAccountApi} from '../src/generated/unifiedAccount';
import {Api as EcommerceApi} from '../src/generated/ecommerce';
import {Api as DvpApi} from '../src/generated/dvp';
import {Api as WonscoreApi} from '../src/generated/wonscore';
import {OAuthClient} from 'wnd-security';
import {Env} from './env';

export {AuthApi, BillingApi, UnifiedAccountApi, EcommerceApi, DvpApi, WonscoreApi};

export interface Apis {
  unifiedAccountApi: UnifiedAccountApi;
  billingApi: BillingApi;
  ecommerceApi: EcommerceApi;
  dvpApi: DvpApi;
  wonscoreApi: WonscoreApi;
  authApi: AuthApi;
}

export function getApis(env: Env): Apis {
  const oAuthClient = new OAuthClient(
    env.get('AUTH_URL'),
    env.get('API_WONDERLIC_QA_AUTH_ID'),
    env.get('API_WONDERLIC_QA_AUTH_SECRET')
  );

  const billingApi = new BillingApi(env.get('API_BILLING_URL'), {
    async getAuthToken() {
      return (await oAuthClient.requestToken('billing.system')).access_token;
    },
  });

  const unifiedAccountApi = new UnifiedAccountApi(env.get('API_UNIFIED_ACCOUNT_URL'), {
    async getAuthToken() {
      return (await oAuthClient.requestToken('unified-account.system')).access_token;
    },
  });

  const dvpApi = new DvpApi(env.get('API_DVP_URL'), {
    async getAuthToken() {
      return (await oAuthClient.requestToken('dvp.system')).access_token;
    },
  });

  const wonscoreApi = new WonscoreApi(env.get('API_WONSCORE_URL'), {
    async getAuthToken() {
      return (await oAuthClient.requestToken('wonscore.system')).access_token;
    },
  });

  const ecommerceApi = new EcommerceApi(env.get('API_ECOMMERCE_URL'), {
    async getAuthToken() {
      return (await oAuthClient.requestToken('ecommerce.system')).access_token;
    },
  });

  const authApi = new AuthApi(env.get('API_AUTH_URL'), {
    async getAuthToken() {
      return (await oAuthClient.requestToken('auth.system')).access_token;
    },
  });

  return {
    billingApi,
    unifiedAccountApi,
    dvpApi,
    wonscoreApi,
    ecommerceApi,
    authApi,
  };
}
