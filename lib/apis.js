"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApis = exports.WonscoreApi = exports.DvpApi = exports.EcommerceApi = exports.UnifiedAccountApi = exports.BillingApi = exports.AuthApi = void 0;
const auth_1 = require("../src/generated/auth");
Object.defineProperty(exports, "AuthApi", { enumerable: true, get: function () { return auth_1.Api; } });
const billing_1 = require("../src/generated/billing");
Object.defineProperty(exports, "BillingApi", { enumerable: true, get: function () { return billing_1.Api; } });
const unifiedAccount_1 = require("../src/generated/unifiedAccount");
Object.defineProperty(exports, "UnifiedAccountApi", { enumerable: true, get: function () { return unifiedAccount_1.Api; } });
const ecommerce_1 = require("../src/generated/ecommerce");
Object.defineProperty(exports, "EcommerceApi", { enumerable: true, get: function () { return ecommerce_1.Api; } });
const dvp_1 = require("../src/generated/dvp");
Object.defineProperty(exports, "DvpApi", { enumerable: true, get: function () { return dvp_1.Api; } });
const wonscore_1 = require("../src/generated/wonscore");
Object.defineProperty(exports, "WonscoreApi", { enumerable: true, get: function () { return wonscore_1.Api; } });
const wnd_security_1 = require("wnd-security");
function getApis(env) {
    const oAuthClient = new wnd_security_1.OAuthClient(env.get('AUTH_URL'), env.get('API_WONDERLIC_QA_AUTH_ID'), env.get('API_WONDERLIC_QA_AUTH_SECRET'));
    const billingApi = new billing_1.Api(env.get('API_BILLING_URL'), {
        getAuthToken() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield oAuthClient.requestToken('billing.system')).access_token;
            });
        },
    });
    const unifiedAccountApi = new unifiedAccount_1.Api(env.get('API_UNIFIED_ACCOUNT_URL'), {
        getAuthToken() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield oAuthClient.requestToken('unified-account.system')).access_token;
            });
        },
    });
    const dvpApi = new dvp_1.Api(env.get('API_DVP_URL'), {
        getAuthToken() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield oAuthClient.requestToken('dvp.system')).access_token;
            });
        },
    });
    const wonscoreApi = new wonscore_1.Api(env.get('API_WONSCORE_URL'), {
        getAuthToken() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield oAuthClient.requestToken('wonscore.system')).access_token;
            });
        },
    });
    const ecommerceApi = new ecommerce_1.Api(env.get('API_ECOMMERCE_URL'), {
        getAuthToken() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield oAuthClient.requestToken('ecommerce.system')).access_token;
            });
        },
    });
    const authApi = new auth_1.Api(env.get('API_AUTH_URL'), {
        getAuthToken() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield oAuthClient.requestToken('auth.system')).access_token;
            });
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
exports.getApis = getApis;
