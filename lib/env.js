"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const env_1 = require("wnd-env/lib/env");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ENV_ROOT_DIR = path_1.default.resolve(__dirname, '../../');
function getEnv(environmentName) {
    let envBasePath;
    const lowerEnv = environmentName.toLowerCase();
    let isFeatureEnv = true;
    if (lowerEnv === 'alpha') {
        isFeatureEnv = false;
        envBasePath = path_1.default.resolve(ENV_ROOT_DIR, 'env-alpha');
    }
    else if (lowerEnv === 'beta') {
        isFeatureEnv = false;
        envBasePath = path_1.default.resolve(ENV_ROOT_DIR, 'env-beta');
    }
    else {
        // Find local env
        envBasePath = path_1.default.resolve(ENV_ROOT_DIR, 'env-local');
        if (!fs_1.default.existsSync(envBasePath)) {
            envBasePath = path_1.default.resolve(ENV_ROOT_DIR, 'env');
        }
    }
    if (lowerEnv === 'local') {
        isFeatureEnv = false;
    }
    const envRulesPath = path_1.default.resolve(__dirname, '../env-rules.js');
    const env = new env_1.Env(envBasePath, envRulesPath);
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
exports.getEnv = getEnv;
