import {Env} from 'wnd-env/lib/env';
import path from 'path';
import fs from 'fs';

const ENV_ROOT_DIR = path.resolve(__dirname, '../../');

export type {Env};

export function getEnv(environmentName: string): Env {
  let envBasePath: string;
  const lowerEnv = environmentName.toLowerCase();
  let isFeatureEnv = true;

  if (lowerEnv === 'alpha') {
    isFeatureEnv = false;
    envBasePath = path.resolve(ENV_ROOT_DIR, 'env-alpha');
  } else if (lowerEnv === 'beta') {
    isFeatureEnv = false;
    envBasePath = path.resolve(ENV_ROOT_DIR, 'env-beta');
  } else {
    // Find local env
    envBasePath = path.resolve(ENV_ROOT_DIR, 'env-local');
    if (!fs.existsSync(envBasePath)) {
      envBasePath = path.resolve(ENV_ROOT_DIR, 'env');
    }
  }

  if (lowerEnv === 'local') {
    isFeatureEnv = false;
  }

  const envRulesPath = path.resolve(__dirname, '../env-rules.js');
  const env = new Env(envBasePath, envRulesPath);

  if (isFeatureEnv) {
    const PROTOCOL = 'http://';
    const HOSTNAME = `${lowerEnv}.wonderlicdevelop.com`;
    const APIS_HOSTNAME = `apis.${HOSTNAME}`;

    process.env['API_BILLING_URL'] = `${PROTOCOL}${APIS_HOSTNAME}/billing/v1`;
    process.env['API_WONSCORE_URL'] = `${PROTOCOL}${APIS_HOSTNAME}/wonscore/v1`;
    process.env['API_DVP_URL'] = `${PROTOCOL}${APIS_HOSTNAME}/dvp/v1`;
    process.env['API_UNIFIED_ACCOUNT_URL'] = `${PROTOCOL}${APIS_HOSTNAME}/unified-account/v1`;
    process.env['API_ECOMMERCE_URL'] = `${PROTOCOL}${APIS_HOSTNAME}/ecommerce/v1`;
    process.env['API_AUTH_URL'] = `${PROTOCOL}${APIS_HOSTNAME}/auth/v1`;
    process.env['AUTH_URL'] = `${PROTOCOL}${APIS_HOSTNAME}/auth/v1`;

    process.env['WONSCORE_WEBUI_URL'] = `${PROTOCOL}selection.${HOSTNAME}`;
    process.env['AUTH_URL'] = `${PROTOCOL}auth.${HOSTNAME}`;
  }

  return env;
}
