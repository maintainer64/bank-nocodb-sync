/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AccountCollection,
  AccountDetail,
  Balance,
  BalanceCollection,
  BalanceSheet,
  Budget,
  BudgetCategory,
  BudgetCategoryCollection,
  BudgetCollection,
  CategoryCollection,
  CategoryCreateRequest,
  CategoryDetail,
  ChatCollection,
  ChatDetail,
  DeleteResponse,
  ErrorResponse,
  ErrorResponseWithImportId,
  FamilyExportCollection,
  FamilyExportResponse,
  FamilySettings,
  Holding,
  HoldingCollection,
  ImportCollection,
  ImportPreflightResponse,
  ImportResponse,
  ImportRowDiagnosticCollection,
  MerchantDetail,
  MessageResponse,
  MfaRequiredResponse,
  ProviderConnectionCollection,
  RecurringTransaction,
  RecurringTransactionCollection,
  RejectedTransfer,
  RejectedTransferCollection,
  ResetInitiatedResponse,
  ResetStatusResponse,
  RetryResponse,
  RuleCollection,
  RuleResponse,
  RuleRunCollection,
  RuleRunResponse,
  Security,
  SecurityCollection,
  SecurityPrice,
  SecurityPriceCollection,
  SuccessMessage,
  SyncCollection,
  SyncResponse,
  TagCollection,
  TagDetail,
  Trade,
  TradeCollection,
  Transaction,
  TransactionCollection,
  TransferDecision,
  TransferDecisionCollection,
  Valuation,
  ValuationCollection,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Accounts
   * @name V1AccountsList
   * @summary List accounts
   * @request GET:/api/v1/accounts
   * @secure
   */
  v1AccountsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Include disabled accounts in the response. Defaults to false. */
      include_disabled?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<AccountCollection, any>({
      path: `/api/v1/accounts`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Accounts
   * @name V1AccountsDetail
   * @summary Retrieve an account
   * @request GET:/api/v1/accounts/{id}
   * @secure
   */
  v1AccountsDetail = (
    id: string,
    query?: {
      /** Allow retrieving a disabled account. Defaults to false. */
      include_disabled?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<AccountDetail, ErrorResponse>({
      path: `/api/v1/accounts/${id}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name V1AuthSignupCreate
   * @summary Sign up a new user
   * @request POST:/api/v1/auth/signup
   */
  v1AuthSignupCreate = (
    data: {
      user: {
        /**
         * User email address
         * @format email
         */
        email: string;
        /** Password (min 8 chars, mixed case, number, special char) */
        password: string;
        first_name?: string;
        last_name?: string;
      };
      device: {
        /** Unique device identifier */
        device_id: string;
        /** Human-readable device name */
        device_name: string;
        /** Device type (e.g. ios, android) */
        device_type: string;
        os_version: string;
        app_version: string;
      };
      /** Invite code (required when invites are enforced) */
      invite_code?: string | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        access_token?: string;
        refresh_token?: string;
        token_type?: string;
        expires_in?: number;
        created_at?: number;
        user?: {
          /** @format uuid */
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          ui_layout?: "dashboard" | "intro";
          ai_enabled?: boolean;
        };
      },
      ErrorResponse
    >({
      path: `/api/v1/auth/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name V1AuthLoginCreate
   * @summary Log in with email and password
   * @request POST:/api/v1/auth/login
   */
  v1AuthLoginCreate = (
    data: {
      /** @format email */
      email: string;
      password: string;
      /** TOTP code if MFA is enabled */
      otp_code?: string | null;
      device: {
        device_id: string;
        device_name: string;
        device_type: string;
        os_version: string;
        app_version: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        access_token?: string;
        refresh_token?: string;
        token_type?: string;
        expires_in?: number;
        created_at?: number;
        user?: {
          /** @format uuid */
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          ui_layout?: "dashboard" | "intro";
          ai_enabled?: boolean;
        };
      },
      ErrorResponse
    >({
      path: `/api/v1/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Exchanges a one-time authorization code (received via deep link after mobile SSO) for OAuth tokens. The code is single-use and expires after 5 minutes.
   *
   * @tags Auth
   * @name V1AuthSsoExchangeCreate
   * @summary Exchange mobile SSO authorization code for tokens
   * @request POST:/api/v1/auth/sso_exchange
   */
  v1AuthSsoExchangeCreate = (
    data: {
      /** One-time authorization code from mobile SSO callback */
      code: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        access_token?: string;
        refresh_token?: string;
        token_type?: string;
        expires_in?: number;
        created_at?: number;
        user?: {
          /** @format uuid */
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          ui_layout?: "dashboard" | "intro";
          ai_enabled?: boolean;
        };
      },
      ErrorResponse
    >({
      path: `/api/v1/auth/sso_exchange`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name V1AuthRefreshCreate
   * @summary Refresh an access token
   * @request POST:/api/v1/auth/refresh
   */
  v1AuthRefreshCreate = (
    data: {
      /** The refresh token from a previous login or refresh */
      refresh_token: string;
      device: {
        device_id: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        access_token?: string;
        refresh_token?: string;
        token_type?: string;
        expires_in?: number;
        created_at?: number;
      },
      ErrorResponse
    >({
      path: `/api/v1/auth/refresh`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Authenticates with email/password and links the SSO identity from a previously issued linking code. Creates an OidcIdentity, logs the link via SsoAuditLog, and issues mobile OAuth tokens.
   *
   * @tags Auth
   * @name V1AuthSsoLinkCreate
   * @summary Link an existing account via SSO
   * @request POST:/api/v1/auth/sso_link
   */
  v1AuthSsoLinkCreate = (
    data: {
      /** One-time linking code from mobile SSO onboarding redirect */
      linking_code: string;
      /**
       * Email of the existing account to link
       * @format email
       */
      email: string;
      /** Password for the existing account */
      password: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        access_token?: string;
        refresh_token?: string;
        token_type?: string;
        expires_in?: number;
        created_at?: number;
        user?: {
          /** @format uuid */
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          ui_layout?: "dashboard" | "intro";
          ai_enabled?: boolean;
        };
      },
      ErrorResponse | (ErrorResponse | MfaRequiredResponse)
    >({
      path: `/api/v1/auth/sso_link`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a new user and family from a previously issued linking code. Links the SSO identity via OidcIdentity, logs the JIT account creation via SsoAuditLog, and issues mobile OAuth tokens. The linking code must have allow_account_creation enabled.
   *
   * @tags Auth
   * @name V1AuthSsoCreateAccountCreate
   * @summary Create a new account via SSO
   * @request POST:/api/v1/auth/sso_create_account
   */
  v1AuthSsoCreateAccountCreate = (
    data: {
      /** One-time linking code from mobile SSO onboarding redirect */
      linking_code: string;
      /** First name (overrides value from SSO provider if provided) */
      first_name?: string;
      /** Last name (overrides value from SSO provider if provided) */
      last_name?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        access_token?: string;
        refresh_token?: string;
        token_type?: string;
        expires_in?: number;
        created_at?: number;
        user?: {
          /** @format uuid */
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          ui_layout?: "dashboard" | "intro";
          ai_enabled?: boolean;
        };
      },
      | ErrorResponse
      | {
          errors?: string[];
        }
    >({
      path: `/api/v1/auth/sso_create_account`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name V1AuthEnableAiPartialUpdate
   * @summary Enable AI features for the authenticated user
   * @request PATCH:/api/v1/auth/enable_ai
   * @secure
   */
  v1AuthEnableAiPartialUpdate = (params: RequestParams = {}) =>
    this.request<
      {
        user?: {
          /** @format uuid */
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          ui_layout?: "dashboard" | "intro";
          ai_enabled?: boolean;
        };
      },
      ErrorResponse
    >({
      path: `/api/v1/auth/enable_ai`,
      method: "PATCH",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns the family balance sheet including net worth, total assets, and total liabilities with amounts converted to the family's primary currency.
   *
   * @tags Balance Sheet
   * @name V1BalanceSheetList
   * @summary Show balance sheet
   * @request GET:/api/v1/balance_sheet
   * @secure
   */
  v1BalanceSheetList = (params: RequestParams = {}) =>
    this.request<BalanceSheet, ErrorResponse>({
      path: `/api/v1/balance_sheet`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Balances
   * @name V1BalancesList
   * @summary List balance history records
   * @request GET:/api/v1/balances
   * @secure
   */
  v1BalancesList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /**
       * Filter by account ID
       * @format uuid
       */
      account_id?: string;
      /** Filter by currency code */
      currency?: string;
      /**
       * Filter balances from this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter balances until this date
       * @format date
       */
      end_date?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<BalanceCollection, ErrorResponse>({
      path: `/api/v1/balances`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Balances
   * @name V1BalancesDetail
   * @summary Retrieve a balance history record
   * @request GET:/api/v1/balances/{id}
   * @secure
   */
  v1BalancesDetail = (id: string, params: RequestParams = {}) =>
    this.request<Balance, ErrorResponse>({
      path: `/api/v1/balances/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Budget Categories
   * @name V1BudgetCategoriesList
   * @summary List budget categories
   * @request GET:/api/v1/budget_categories
   * @secure
   */
  v1BudgetCategoriesList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /**
       * Filter by budget ID
       * @format uuid
       */
      budget_id?: string;
      /**
       * Filter by category ID
       * @format uuid
       */
      category_id?: string;
      /**
       * Filter budget categories whose budget starts on or after this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter budget categories whose budget ends on or before this date
       * @format date
       */
      end_date?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<BudgetCategoryCollection, ErrorResponse>({
      path: `/api/v1/budget_categories`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Budget Categories
   * @name V1BudgetCategoriesDetail
   * @summary Retrieve a budget category
   * @request GET:/api/v1/budget_categories/{id}
   * @secure
   */
  v1BudgetCategoriesDetail = (id: string, params: RequestParams = {}) =>
    this.request<BudgetCategory, ErrorResponse>({
      path: `/api/v1/budget_categories/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Budgets
   * @name V1BudgetsList
   * @summary List budgets
   * @request GET:/api/v1/budgets
   * @secure
   */
  v1BudgetsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /**
       * Filter budgets starting on or after this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter budgets ending on or before this date
       * @format date
       */
      end_date?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<BudgetCollection, ErrorResponse>({
      path: `/api/v1/budgets`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Budgets
   * @name V1BudgetsDetail
   * @summary Retrieve a budget
   * @request GET:/api/v1/budgets/{id}
   * @secure
   */
  v1BudgetsDetail = (id: string, params: RequestParams = {}) =>
    this.request<Budget, ErrorResponse>({
      path: `/api/v1/budgets/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Categories
   * @name V1CategoriesList
   * @summary List categories
   * @request GET:/api/v1/categories
   * @secure
   */
  v1CategoriesList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Return only root categories (no parent) */
      roots_only?: boolean;
      /**
       * Filter by parent category ID
       * @format uuid
       */
      parent_id?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<CategoryCollection, any>({
      path: `/api/v1/categories`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Categories
   * @name V1CategoriesCreate
   * @summary Create category
   * @request POST:/api/v1/categories
   * @secure
   */
  v1CategoriesCreate = (
    data: CategoryCreateRequest,
    params: RequestParams = {},
  ) =>
    this.request<CategoryDetail, ErrorResponse>({
      path: `/api/v1/categories`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Categories
   * @name V1CategoriesDetail
   * @summary Retrieve a category
   * @request GET:/api/v1/categories/{id}
   * @secure
   */
  v1CategoriesDetail = (id: string, params: RequestParams = {}) =>
    this.request<CategoryDetail, ErrorResponse>({
      path: `/api/v1/categories/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chats
   * @name V1ChatsList
   * @summary List chats
   * @request GET:/api/v1/chats
   * @secure
   */
  v1ChatsList = (params: RequestParams = {}) =>
    this.request<ChatCollection, ErrorResponse>({
      path: `/api/v1/chats`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chats
   * @name V1ChatsCreate
   * @summary Create chat
   * @request POST:/api/v1/chats
   * @secure
   */
  v1ChatsCreate = (
    data: {
      /** @example "Monthly budget review" */
      title: string;
      /** Optional initial message in the chat */
      message?: string;
      /** Optional OpenAI model identifier */
      model?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ChatDetail, ErrorResponse>({
      path: `/api/v1/chats`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chats
   * @name V1ChatsDetail
   * @summary Retrieve a chat
   * @request GET:/api/v1/chats/{id}
   * @secure
   */
  v1ChatsDetail = (id: string, params: RequestParams = {}) =>
    this.request<ChatDetail, ErrorResponse>({
      path: `/api/v1/chats/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chats
   * @name V1ChatsPartialUpdate
   * @summary Update a chat
   * @request PATCH:/api/v1/chats/{id}
   * @secure
   */
  v1ChatsPartialUpdate = (
    id: string,
    data: {
      /** @example "Updated chat title" */
      title?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ChatDetail, ErrorResponse>({
      path: `/api/v1/chats/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chats
   * @name V1ChatsDelete
   * @summary Delete a chat
   * @request DELETE:/api/v1/chats/{id}
   * @secure
   */
  v1ChatsDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/api/v1/chats/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat Messages
   * @name V1ChatsMessagesCreate
   * @summary Create a message
   * @request POST:/api/v1/chats/{chat_id}/messages
   * @secure
   */
  v1ChatsMessagesCreate = (
    chatId: string,
    data: {
      content: string;
      model?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MessageResponse, ErrorResponse>({
      path: `/api/v1/chats/${chatId}/messages`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Chat Messages
   * @name V1ChatsMessagesRetryCreate
   * @summary Retry the last assistant response
   * @request POST:/api/v1/chats/{chat_id}/messages/retry
   * @secure
   */
  v1ChatsMessagesRetryCreate = (chatId: string, params: RequestParams = {}) =>
    this.request<RetryResponse, ErrorResponse>({
      path: `/api/v1/chats/${chatId}/messages/retry`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Family Exports
   * @name V1FamilyExportsList
   * @summary Lists family exports
   * @request GET:/api/v1/family_exports
   * @secure
   */
  v1FamilyExportsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<FamilyExportCollection, ErrorResponse>({
      path: `/api/v1/family_exports`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Family Exports
   * @name V1FamilyExportsCreate
   * @summary Queues a family export
   * @request POST:/api/v1/family_exports
   * @secure
   */
  v1FamilyExportsCreate = (data: object, params: RequestParams = {}) =>
    this.request<FamilyExportResponse, ErrorResponse>({
      path: `/api/v1/family_exports`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Family Exports
   * @name V1FamilyExportsDetail
   * @summary Shows a family export
   * @request GET:/api/v1/family_exports/{id}
   * @secure
   */
  v1FamilyExportsDetail = (id: string, params: RequestParams = {}) =>
    this.request<FamilyExportResponse, ErrorResponse>({
      path: `/api/v1/family_exports/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Family Exports
   * @name V1FamilyExportsDownloadList
   * @summary Downloads a completed family export
   * @request GET:/api/v1/family_exports/{id}/download
   * @secure
   */
  v1FamilyExportsDownloadList = (id: string, params: RequestParams = {}) =>
    this.request<any, void | ErrorResponse>({
      path: `/api/v1/family_exports/${id}/download`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Retrieve a read-only snapshot of non-secret family configuration.
   *
   * @tags Family Settings
   * @name V1FamilySettingsList
   * @summary Retrieve family settings
   * @request GET:/api/v1/family_settings
   * @secure
   */
  v1FamilySettingsList = (params: RequestParams = {}) =>
    this.request<FamilySettings, ErrorResponse>({
      path: `/api/v1/family_settings`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Holdings
   * @name V1HoldingsList
   * @summary List holdings
   * @request GET:/api/v1/holdings
   * @secure
   */
  v1HoldingsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by account ID */
      account_id?: string;
      /** Filter by multiple account IDs */
      account_ids?: string[];
      /**
       * Filter by exact date
       * @format date
       */
      date?: string;
      /**
       * Filter holdings from this date (inclusive)
       * @format date
       */
      start_date?: string;
      /**
       * Filter holdings until this date (inclusive)
       * @format date
       */
      end_date?: string;
      /** Filter by security ID */
      security_id?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<HoldingCollection, ErrorResponse>({
      path: `/api/v1/holdings`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Holdings
   * @name V1HoldingsDetail
   * @summary Retrieve holding
   * @request GET:/api/v1/holdings/{id}
   * @secure
   */
  v1HoldingsDetail = (id: string, params: RequestParams = {}) =>
    this.request<Holding, ErrorResponse>({
      path: `/api/v1/holdings/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List all imports for the user's family with pagination and filtering.
   *
   * @tags Imports
   * @name V1ImportsList
   * @summary List imports
   * @request GET:/api/v1/imports
   * @secure
   */
  v1ImportsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by status */
      status?:
        | "pending"
        | "complete"
        | "importing"
        | "reverting"
        | "revert_failed"
        | "failed";
      /** Filter by import type */
      type?:
        | "TransactionImport"
        | "TradeImport"
        | "AccountImport"
        | "MintImport"
        | "ActualImport"
        | "CategoryImport"
        | "RuleImport"
        | "SureImport";
    },
    params: RequestParams = {},
  ) =>
    this.request<ImportCollection, any>({
      path: `/api/v1/imports`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create a new import from raw CSV content, inline Sure NDJSON content, or an uploaded Sure NDJSON file. CSV content is limited to 10MB.
   *
   * @tags Imports
   * @name V1ImportsCreate
   * @summary Create import
   * @request POST:/api/v1/imports
   * @secure
   */
  v1ImportsCreate = (
    data: {
      /** Raw CSV or Sure NDJSON content as a string. CSV content is limited to 10MB. Required for SureImport unless a multipart file is uploaded. */
      raw_file_content?: string;
      /** Import type (defaults to TransactionImport) */
      type?:
        | "TransactionImport"
        | "TradeImport"
        | "AccountImport"
        | "MintImport"
        | "ActualImport"
        | "CategoryImport"
        | "RuleImport"
        | "SureImport";
      /**
       * Account ID to import into
       * @format uuid
       */
      account_id?: string;
      /** Set to "true" to automatically queue for processing if configuration is valid */
      publish?: string;
      /** CSV imports only. Header name for the date column */
      date_col_label?: string;
      /** CSV imports only. Header name for the amount column */
      amount_col_label?: string;
      /** CSV imports only. Header name for the transaction name column */
      name_col_label?: string;
      /** CSV imports only. Header name for the category column */
      category_col_label?: string;
      /** CSV imports only. Header name for the tags column */
      tags_col_label?: string;
      /** CSV imports only. Header name for the notes column */
      notes_col_label?: string;
      /** CSV imports only. Header name for the account column when importing rows across multiple accounts */
      account_col_label?: string;
      /** CSV trade imports only. Header name for the quantity column */
      qty_col_label?: string;
      /** CSV trade imports only. Header name for the ticker column */
      ticker_col_label?: string;
      /** CSV trade imports only. Header name for the price column */
      price_col_label?: string;
      /** CSV imports only. Header name for the entity type column */
      entity_type_col_label?: string;
      /** CSV imports only. Header name for the currency column */
      currency_col_label?: string;
      /** CSV trade imports only. Header name for the exchange operating MIC column */
      exchange_operating_mic_col_label?: string;
      /** CSV imports only. Date format pattern (e.g., "%m/%d/%Y") */
      date_format?: string;
      /** CSV imports only. Number format for parsing amounts */
      number_format?: "1,234.56" | "1.234,56" | "1 234,56" | "1,234";
      /** CSV imports only. How to interpret positive/negative amounts */
      signage_convention?: "inflows_positive" | "inflows_negative";
      /** CSV imports only. Column separator */
      col_sep?: "," | ";";
      /** CSV imports only. Amount parsing strategy */
      amount_type_strategy?: "signed_amount" | "custom_column";
      /** CSV imports only. Column value that marks an amount as an inflow when using custom_column strategy */
      amount_type_inflow_value?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      ImportResponse,
      (ErrorResponse | ErrorResponseWithImportId) | ErrorResponseWithImportId
    >({
      path: `/api/v1/imports`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Retrieve detailed information about a specific import, including configuration, row statistics, and SureImport readback verification when available.
   *
   * @tags Imports
   * @name V1ImportsDetail
   * @summary Retrieve an import
   * @request GET:/api/v1/imports/{id}
   * @secure
   */
  v1ImportsDetail = (id: string, params: RequestParams = {}) =>
    this.request<ImportResponse, ErrorResponse>({
      path: `/api/v1/imports/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List sanitized import rows with validation errors and mapping resolution state.
   *
   * @tags Imports
   * @name V1ImportsRowsList
   * @summary List import row diagnostics
   * @request GET:/api/v1/imports/{id}/rows
   * @secure
   */
  v1ImportsRowsList = (
    id: string,
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<ImportRowDiagnosticCollection, ErrorResponse>({
      path: `/api/v1/imports/${id}/rows`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Validate CSV or Sure NDJSON import content and return counts, headers, warnings, and validation errors without persisting an import or enqueueing jobs. CSV content is limited to 10MB.
   *
   * @tags Imports
   * @name V1ImportsPreflightCreate
   * @summary Validate import content without creating an import
   * @request POST:/api/v1/imports/preflight
   * @secure
   */
  v1ImportsPreflightCreate = (
    data: {
      /** Raw CSV or Sure NDJSON content as a string. CSV content is limited to 10MB. */
      raw_file_content?: string;
      /**
       * CSV or Sure NDJSON upload when using multipart/form-data. CSV files are limited to 10MB.
       * @format binary
       */
      file?: File;
      /** Import type to validate (defaults to TransactionImport) */
      type?:
        | "TransactionImport"
        | "TradeImport"
        | "AccountImport"
        | "MintImport"
        | "ActualImport"
        | "CategoryImport"
        | "RuleImport"
        | "SureImport";
      /**
       * Account ID used for account-scoped CSV import validation
       * @format uuid
       */
      account_id?: string;
      /** CSV imports only. Header name for the date column */
      date_col_label?: string;
      /** CSV imports only. Header name for the amount column */
      amount_col_label?: string;
      /** CSV imports only. Header name for the transaction name column */
      name_col_label?: string;
      /** CSV imports only. Header name for the category column */
      category_col_label?: string;
      /** CSV imports only. Header name for the tags column */
      tags_col_label?: string;
      /** CSV imports only. Header name for the notes column */
      notes_col_label?: string;
      /** CSV imports only. Header name for the account column */
      account_col_label?: string;
      /** CSV trade imports only. Header name for the quantity column */
      qty_col_label?: string;
      /** CSV trade imports only. Header name for the ticker column */
      ticker_col_label?: string;
      /** CSV trade imports only. Header name for the price column */
      price_col_label?: string;
      /** CSV imports only. Header name for the entity type column */
      entity_type_col_label?: string;
      /** CSV imports only. Header name for the currency column */
      currency_col_label?: string;
      /** CSV trade imports only. Header name for the exchange operating MIC column */
      exchange_operating_mic_col_label?: string;
      /** CSV imports only. Date format pattern */
      date_format?: string;
      /** CSV imports only. Number format for parsing amounts */
      number_format?: "1,234.56" | "1.234,56" | "1 234,56" | "1,234";
      /** CSV imports only. How to interpret positive/negative amounts */
      signage_convention?: "inflows_positive" | "inflows_negative";
      /** CSV imports only. Column separator */
      col_sep?: "," | ";";
      /**
       * CSV imports only. Number of leading rows to skip before reading headers
       * @min 0
       */
      rows_to_skip?: number;
      /** CSV imports only. Amount parsing strategy */
      amount_type_strategy?: "signed_amount" | "custom_column";
      /** CSV imports only. Column value that marks an amount as an inflow when using custom_column strategy */
      amount_type_inflow_value?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ImportPreflightResponse, ErrorResponse>({
      path: `/api/v1/imports/preflight`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Merchants
   * @name V1MerchantsList
   * @summary List merchants
   * @request GET:/api/v1/merchants
   * @secure
   */
  v1MerchantsList = (params: RequestParams = {}) =>
    this.request<MerchantDetail[], any>({
      path: `/api/v1/merchants`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Merchants
   * @name V1MerchantsDetail
   * @summary Retrieve a merchant
   * @request GET:/api/v1/merchants/{id}
   * @secure
   */
  v1MerchantsDetail = (id: string, params: RequestParams = {}) =>
    this.request<MerchantDetail, ErrorResponse>({
      path: `/api/v1/merchants/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List safe provider connection status metadata for the authenticated user's family without exposing credentials, raw provider payloads, or raw sync errors.
   *
   * @tags Provider Connections
   * @name V1ProviderConnectionsList
   * @summary Lists provider connection status summaries
   * @request GET:/api/v1/provider_connections
   * @secure
   */
  v1ProviderConnectionsList = (params: RequestParams = {}) =>
    this.request<ProviderConnectionCollection, ErrorResponse>({
      path: `/api/v1/provider_connections`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Recurring Transactions
   * @name V1RecurringTransactionsList
   * @summary List recurring transactions
   * @request GET:/api/v1/recurring_transactions
   * @secure
   */
  v1RecurringTransactionsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by recurring status */
      status?: "active" | "inactive";
      /**
       * Filter by account ID
       * @format uuid
       */
      account_id?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<RecurringTransactionCollection, ErrorResponse>({
      path: `/api/v1/recurring_transactions`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Recurring Transactions
   * @name V1RecurringTransactionsCreate
   * @summary Create recurring transaction
   * @request POST:/api/v1/recurring_transactions
   * @secure
   */
  v1RecurringTransactionsCreate = (
    data: {
      recurring_transaction: {
        /** @format uuid */
        account_id?: string | null;
        /** @format uuid */
        merchant_id?: string | null;
        name?: string | null;
        amount: number;
        currency: string;
        /**
         * @min 1
         * @max 31
         */
        expected_day_of_month: number;
        /** @format date */
        last_occurrence_date: string;
        /** @format date */
        next_expected_date: string;
        status?: "active" | "inactive";
        /** @min 0 */
        occurrence_count?: number;
        manual?: boolean;
        expected_amount_min?: number | null;
        expected_amount_max?: number | null;
        expected_amount_avg?: number | null;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<RecurringTransaction, ErrorResponse>({
      path: `/api/v1/recurring_transactions`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Recurring Transactions
   * @name V1RecurringTransactionsDetail
   * @summary Retrieve recurring transaction
   * @request GET:/api/v1/recurring_transactions/{id}
   * @secure
   */
  v1RecurringTransactionsDetail = (id: string, params: RequestParams = {}) =>
    this.request<RecurringTransaction, ErrorResponse>({
      path: `/api/v1/recurring_transactions/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Recurring Transactions
   * @name V1RecurringTransactionsPartialUpdate
   * @summary Update recurring transaction
   * @request PATCH:/api/v1/recurring_transactions/{id}
   * @secure
   */
  v1RecurringTransactionsPartialUpdate = (
    id: string,
    data: {
      recurring_transaction?: {
        status?: "active" | "inactive";
        /**
         * @min 1
         * @max 31
         */
        expected_day_of_month?: number;
        /** @format date */
        next_expected_date?: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<RecurringTransaction, ErrorResponse>({
      path: `/api/v1/recurring_transactions/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Recurring Transactions
   * @name V1RecurringTransactionsDelete
   * @summary Delete recurring transaction
   * @request DELETE:/api/v1/recurring_transactions/{id}
   * @secure
   */
  v1RecurringTransactionsDelete = (id: string, params: RequestParams = {}) =>
    this.request<SuccessMessage, ErrorResponse>({
      path: `/api/v1/recurring_transactions/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Rejected Transfers
   * @name V1RejectedTransfersList
   * @summary List rejected transfers
   * @request GET:/api/v1/rejected_transfers
   * @secure
   */
  v1RejectedTransfersList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /**
       * Filter rejected transfers involving this account
       * @format uuid
       */
      account_id?: string;
      /**
       * Filter rejected transfers from this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter rejected transfers until this date
       * @format date
       */
      end_date?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<RejectedTransferCollection, ErrorResponse>({
      path: `/api/v1/rejected_transfers`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Rejected Transfers
   * @name V1RejectedTransfersDetail
   * @summary Retrieve a rejected transfer
   * @request GET:/api/v1/rejected_transfers/{id}
   * @secure
   */
  v1RejectedTransfersDetail = (id: string, params: RequestParams = {}) =>
    this.request<RejectedTransfer, ErrorResponse>({
      path: `/api/v1/rejected_transfers/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List rule run history for the authenticated user family.
   *
   * @tags Rule Runs
   * @name V1RuleRunsList
   * @summary List rule runs
   * @request GET:/api/v1/rule_runs
   * @secure
   */
  v1RuleRunsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /**
       * Filter by rule ID
       * @format uuid
       */
      rule_id?: string;
      /** Filter by run status */
      status?: "pending" | "success" | "failed";
      /** Filter by execution type */
      execution_type?: "manual" | "scheduled";
      /**
       * Filter runs executed at or after this timestamp
       * @format date-time
       */
      start_executed_at?: string;
      /**
       * Filter runs executed at or before this timestamp
       * @format date-time
       */
      end_executed_at?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<RuleRunCollection, ErrorResponse>({
      path: `/api/v1/rule_runs`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Retrieve one rule run from the authenticated user family.
   *
   * @tags Rule Runs
   * @name V1RuleRunsDetail
   * @summary Retrieve a rule run
   * @request GET:/api/v1/rule_runs/{id}
   * @secure
   */
  v1RuleRunsDetail = (id: string, params: RequestParams = {}) =>
    this.request<RuleRunResponse, ErrorResponse>({
      path: `/api/v1/rule_runs/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Rules
   * @name V1RulesList
   * @summary List rules
   * @request GET:/api/v1/rules
   * @secure
   */
  v1RulesList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by rule resource type */
      resource_type?: "transaction";
      /** Filter by active status */
      active?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<RuleCollection, ErrorResponse>({
      path: `/api/v1/rules`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Rules
   * @name V1RulesDetail
   * @summary Retrieve a rule
   * @request GET:/api/v1/rules/{id}
   * @secure
   */
  v1RulesDetail = (id: string, params: RequestParams = {}) =>
    this.request<RuleResponse, ErrorResponse>({
      path: `/api/v1/rules/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Securities
   * @name V1SecuritiesList
   * @summary List securities referenced by family investment data
   * @request GET:/api/v1/securities
   * @secure
   */
  v1SecuritiesList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by ticker symbol */
      ticker?: string;
      /** Filter by exchange operating MIC */
      exchange_operating_mic?: string;
      /** Filter by security kind */
      kind?: "standard" | "cash";
      /** Filter by offline status. When supplied, must be true or false. */
      offline?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<SecurityCollection, ErrorResponse>({
      path: `/api/v1/securities`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Securities
   * @name V1SecuritiesDetail
   * @summary Retrieve a security referenced by family investment data
   * @request GET:/api/v1/securities/{id}
   * @secure
   */
  v1SecuritiesDetail = (id: string, params: RequestParams = {}) =>
    this.request<Security, ErrorResponse>({
      path: `/api/v1/securities/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Security Prices
   * @name V1SecurityPricesList
   * @summary List security price history referenced by family investment data
   * @request GET:/api/v1/security_prices
   * @secure
   */
  v1SecurityPricesList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /**
       * Filter by security ID
       * @format uuid
       */
      security_id?: string;
      /** Filter by currency code */
      currency?: string;
      /**
       * Filter prices from this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter prices until this date
       * @format date
       */
      end_date?: string;
      /** Filter by provisional price status. When supplied, must be true or false. */
      provisional?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<SecurityPriceCollection, ErrorResponse>({
      path: `/api/v1/security_prices`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Security Prices
   * @name V1SecurityPricesDetail
   * @summary Retrieve a security price referenced by family investment data
   * @request GET:/api/v1/security_prices/{id}
   * @secure
   */
  v1SecurityPricesDetail = (id: string, params: RequestParams = {}) =>
    this.request<SecurityPrice, ErrorResponse>({
      path: `/api/v1/security_prices/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List sanitized sync status history for the authenticated user's family, accounts, and provider connections.
   *
   * @tags Syncs
   * @name V1SyncsList
   * @summary Lists sync history
   * @request GET:/api/v1/syncs
   * @secure
   */
  v1SyncsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<SyncCollection, ErrorResponse>({
      path: `/api/v1/syncs`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Return the most recently created sanitized sync status for the authenticated user's family, or data: null when no sync exists.
   *
   * @tags Syncs
   * @name V1SyncsLatestList
   * @summary Shows the latest sync
   * @request GET:/api/v1/syncs/latest
   * @secure
   */
  v1SyncsLatestList = (params: RequestParams = {}) =>
    this.request<SyncResponse, ErrorResponse>({
      path: `/api/v1/syncs/latest`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Return sanitized status metadata for a single family-scoped sync.
   *
   * @tags Syncs
   * @name V1SyncsDetail
   * @summary Shows a sync
   * @request GET:/api/v1/syncs/{id}
   * @secure
   */
  v1SyncsDetail = (id: string, params: RequestParams = {}) =>
    this.request<SyncResponse, ErrorResponse>({
      path: `/api/v1/syncs/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Tags
   * @name V1TagsList
   * @summary List tags
   * @request GET:/api/v1/tags
   * @secure
   */
  v1TagsList = (params: RequestParams = {}) =>
    this.request<TagCollection, any>({
      path: `/api/v1/tags`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Tags
   * @name V1TagsCreate
   * @summary Create tag
   * @request POST:/api/v1/tags
   * @secure
   */
  v1TagsCreate = (
    data: {
      tag: {
        /** Tag name (required) */
        name: string;
        /** Hex color code (optional, auto-assigned if not provided) */
        color?: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<TagDetail, ErrorResponse>({
      path: `/api/v1/tags`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Tags
   * @name V1TagsDetail
   * @summary Retrieve a tag
   * @request GET:/api/v1/tags/{id}
   * @secure
   */
  v1TagsDetail = (id: string, params: RequestParams = {}) =>
    this.request<TagDetail, ErrorResponse>({
      path: `/api/v1/tags/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Tags
   * @name V1TagsPartialUpdate
   * @summary Update a tag
   * @request PATCH:/api/v1/tags/{id}
   * @secure
   */
  v1TagsPartialUpdate = (
    id: string,
    data: {
      tag?: {
        name?: string;
        color?: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<TagDetail, ErrorResponse>({
      path: `/api/v1/tags/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Tags
   * @name V1TagsDelete
   * @summary Delete a tag
   * @request DELETE:/api/v1/tags/{id}
   * @secure
   */
  v1TagsDelete = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/api/v1/tags/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Trades
   * @name V1TradesList
   * @summary List trades
   * @request GET:/api/v1/trades
   * @secure
   */
  v1TradesList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by account ID */
      account_id?: string;
      /** Filter by multiple account IDs */
      account_ids?: string[];
      /**
       * Filter trades from this date (inclusive)
       * @format date
       */
      start_date?: string;
      /**
       * Filter trades until this date (inclusive)
       * @format date
       */
      end_date?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<TradeCollection, ErrorResponse>({
      path: `/api/v1/trades`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Trades
   * @name V1TradesCreate
   * @summary Create trade
   * @request POST:/api/v1/trades
   * @secure
   */
  v1TradesCreate = (
    data: {
      trade: {
        /**
         * Account ID (required)
         * @format uuid
         */
        account_id: string;
        /**
         * Trade date (required)
         * @format date
         */
        date: string;
        /** Quantity (required) */
        qty: number;
        /** Price (required) */
        price: number;
        /** Trade type (required) */
        type: "buy" | "sell";
        /**
         * Security ID (one of security_id, ticker, manual_ticker required)
         * @format uuid
         */
        security_id?: string;
        /** Ticker symbol */
        ticker?: string;
        /** Manual ticker for offline securities */
        manual_ticker?: string;
        /** Currency (defaults to account currency) */
        currency?: string;
        /** Activity label (e.g. Buy, Sell) */
        investment_activity_label?: string;
        /**
         * Category ID
         * @format uuid
         */
        category_id?: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<Trade, ErrorResponse>({
      path: `/api/v1/trades`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Trades
   * @name V1TradesDetail
   * @summary Retrieve trade
   * @request GET:/api/v1/trades/{id}
   * @secure
   */
  v1TradesDetail = (id: string, params: RequestParams = {}) =>
    this.request<Trade, ErrorResponse>({
      path: `/api/v1/trades/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Trades
   * @name V1TradesPartialUpdate
   * @summary Update trade
   * @request PATCH:/api/v1/trades/{id}
   * @secure
   */
  v1TradesPartialUpdate = (
    id: string,
    data: {
      trade?: {
        /** @format date */
        date?: string;
        qty?: number;
        price?: number;
        type?: "buy" | "sell";
        nature?: "inflow" | "outflow";
        name?: string;
        notes?: string;
        currency?: string;
        investment_activity_label?: string;
        /** @format uuid */
        category_id?: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<Trade, ErrorResponse>({
      path: `/api/v1/trades/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Trades
   * @name V1TradesDelete
   * @summary Delete trade
   * @request DELETE:/api/v1/trades/{id}
   * @secure
   */
  v1TradesDelete = (id: string, params: RequestParams = {}) =>
    this.request<DeleteResponse, ErrorResponse>({
      path: `/api/v1/trades/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns global ledger history for accessible accounts, including disabled accounts but excluding accounts pending deletion.
   *
   * @tags Transactions
   * @name V1TransactionsList
   * @summary List transactions
   * @request GET:/api/v1/transactions
   * @secure
   */
  v1TransactionsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by account ID */
      account_id?: string;
      /** Filter by category ID */
      category_id?: string;
      /** Filter by merchant ID */
      merchant_id?: string;
      /**
       * Filter transactions from this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter transactions until this date
       * @format date
       */
      end_date?: string;
      /** Filter by minimum amount */
      min_amount?: number;
      /** Filter by maximum amount */
      max_amount?: number;
      /** Filter by transaction type */
      type?: "income" | "expense";
      /** Search by name, notes, or merchant name */
      search?: string;
      /** Filter by multiple account IDs */
      account_ids?: string[];
      /** Filter by multiple category IDs */
      category_ids?: string[];
      /** Filter by multiple merchant IDs */
      merchant_ids?: string[];
      /** Filter by tag IDs */
      tag_ids?: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<TransactionCollection, any>({
      path: `/api/v1/transactions`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Transactions
   * @name V1TransactionsCreate
   * @summary Create transaction
   * @request POST:/api/v1/transactions
   * @secure
   */
  v1TransactionsCreate = (
    data: {
      transaction: {
        /**
         * Account ID (required)
         * @format uuid
         */
        account_id: string;
        /**
         * Transaction date
         * @format date
         */
        date: string;
        /** Transaction amount */
        amount: number;
        /** Transaction name/description */
        name: string;
        /** Alternative to name field */
        description?: string;
        /** Additional notes */
        notes?: string;
        /** Currency code (defaults to family currency) */
        currency?: string;
        /**
         * Category ID
         * @format uuid
         */
        category_id?: string;
        /**
         * Merchant ID
         * @format uuid
         */
        merchant_id?: string;
        /** Transaction nature (determines sign) */
        nature?: "income" | "expense" | "inflow" | "outflow";
        /** Optional external idempotency key scoped to account and source */
        external_id?: string;
        /** Optional source namespace for external_id. Requires external_id and defaults to api when external_id is provided */
        source?: string;
        /** Array of tag IDs */
        tag_ids?: string[];
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<Transaction, ErrorResponse>({
      path: `/api/v1/transactions`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Transactions
   * @name V1TransactionsDetail
   * @summary Retrieve a transaction
   * @request GET:/api/v1/transactions/{id}
   * @secure
   */
  v1TransactionsDetail = (id: string, params: RequestParams = {}) =>
    this.request<Transaction, ErrorResponse>({
      path: `/api/v1/transactions/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Transactions
   * @name V1TransactionsPartialUpdate
   * @summary Update a transaction
   * @request PATCH:/api/v1/transactions/{id}
   * @secure
   */
  v1TransactionsPartialUpdate = (
    id: string,
    data: {
      transaction?: {
        /** @format date */
        date?: string;
        amount?: number;
        name?: string;
        /** Alternative to name field */
        description?: string;
        notes?: string;
        /** Currency code */
        currency?: string;
        /** @format uuid */
        category_id?: string;
        /** @format uuid */
        merchant_id?: string;
        nature?: "income" | "expense" | "inflow" | "outflow";
        /** Array of tag IDs to assign. Omit to preserve existing tags; use [] to clear all tags. */
        tag_ids?: string[];
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<Transaction, ErrorResponse>({
      path: `/api/v1/transactions/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Transactions
   * @name V1TransactionsDelete
   * @summary Delete a transaction
   * @request DELETE:/api/v1/transactions/{id}
   * @secure
   */
  v1TransactionsDelete = (id: string, params: RequestParams = {}) =>
    this.request<DeleteResponse, ErrorResponse>({
      path: `/api/v1/transactions/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Transfers
   * @name V1TransfersList
   * @summary List transfers
   * @request GET:/api/v1/transfers
   * @secure
   */
  v1TransfersList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /** Filter by transfer status */
      status?: "pending" | "confirmed";
      /**
       * Filter transfers involving this account
       * @format uuid
       */
      account_id?: string;
      /**
       * Filter transfers from this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter transfers until this date
       * @format date
       */
      end_date?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<TransferDecisionCollection, ErrorResponse>({
      path: `/api/v1/transfers`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Transfers
   * @name V1TransfersDetail
   * @summary Retrieve a transfer
   * @request GET:/api/v1/transfers/{id}
   * @secure
   */
  v1TransfersDetail = (id: string, params: RequestParams = {}) =>
    this.request<TransferDecision, ErrorResponse>({
      path: `/api/v1/transfers/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Resets all financial data (accounts, categories, merchants, tags, etc.) for the current user's family while keeping the user account intact. The reset runs asynchronously in the background. The returned job_id is informational only; reset status is family-scoped, not job-scoped. Requires admin role.
   *
   * @tags Users
   * @name V1UsersResetDelete
   * @summary Reset account
   * @request DELETE:/api/v1/users/reset
   * @secure
   */
  v1UsersResetDelete = (params: RequestParams = {}) =>
    this.request<ResetInitiatedResponse, ErrorResponse>({
      path: `/api/v1/users/reset`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns counts of family-owned data targeted by account reset. Use this after DELETE /api/v1/users/reset to decide whether reset materialization has completed. Completion is a counts-based family snapshot and may change if new data is created after reset.
   *
   * @tags Users
   * @name V1UsersResetStatusList
   * @summary Retrieve reset status
   * @request GET:/api/v1/users/reset/status
   * @secure
   */
  v1UsersResetStatusList = (params: RequestParams = {}) =>
    this.request<ResetStatusResponse, ErrorResponse>({
      path: `/api/v1/users/reset/status`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Permanently deactivates the current user account and all associated data. This action cannot be undone.
   *
   * @tags Users
   * @name V1UsersMeDelete
   * @summary Delete account
   * @request DELETE:/api/v1/users/me
   * @secure
   */
  v1UsersMeDelete = (params: RequestParams = {}) =>
    this.request<SuccessMessage, void | ErrorResponse>({
      path: `/api/v1/users/me`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Valuations
   * @name V1ValuationsList
   * @summary List valuations
   * @request GET:/api/v1/valuations
   * @secure
   */
  v1ValuationsList = (
    query?: {
      /** Page number (default: 1) */
      page?: number;
      /** Items per page (default: 25, max: 100) */
      per_page?: number;
      /**
       * Filter by account ID
       * @format uuid
       */
      account_id?: string;
      /**
       * Filter valuations from this date
       * @format date
       */
      start_date?: string;
      /**
       * Filter valuations until this date
       * @format date
       */
      end_date?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ValuationCollection, ErrorResponse>({
      path: `/api/v1/valuations`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Valuations
   * @name V1ValuationsCreate
   * @summary Create valuation
   * @request POST:/api/v1/valuations
   * @secure
   */
  v1ValuationsCreate = (
    data: {
      valuation: {
        /**
         * Account ID (required)
         * @format uuid
         */
        account_id: string;
        /** Valuation amount (required) */
        amount: number;
        /**
         * Valuation date (required)
         * @format date
         */
        date: string;
        /** Additional notes */
        notes?: string;
        /** Nested alternative to the top-level response-status flag. Top-level upsert takes precedence when both are provided. */
        upsert?: boolean;
      };
      /** Response-status signal only. When true and a same-account same-date valuation exists before the request, the endpoint returns 200 OK instead of 201 Created. The underlying reconciliation write path is unchanged; this flag does not add duplicate-prevention or safe-retry guarantees beyond existing same-date reconciliation behavior. */
      upsert?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<Valuation, ErrorResponse>({
      path: `/api/v1/valuations`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Valuations
   * @name V1ValuationsDetail
   * @summary Retrieve a valuation
   * @request GET:/api/v1/valuations/{id}
   * @secure
   */
  v1ValuationsDetail = (id: string, params: RequestParams = {}) =>
    this.request<Valuation, ErrorResponse>({
      path: `/api/v1/valuations/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Valuations
   * @name V1ValuationsPartialUpdate
   * @summary Update a valuation
   * @request PATCH:/api/v1/valuations/{id}
   * @secure
   */
  v1ValuationsPartialUpdate = (
    id: string,
    data: {
      valuation?: {
        /** New valuation amount (must provide with date) */
        amount?: number;
        /**
         * New valuation date (must provide with amount)
         * @format date
         */
        date?: string;
        /** Additional notes */
        notes?: string;
      };
    },
    params: RequestParams = {},
  ) =>
    this.request<Valuation, ErrorResponse>({
      path: `/api/v1/valuations/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
