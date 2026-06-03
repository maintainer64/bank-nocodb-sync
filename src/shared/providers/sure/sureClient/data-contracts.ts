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

export interface Pagination {
  /** @min 1 */
  page: number;
  /** @min 1 */
  per_page: number;
  /** @min 0 */
  total_count: number;
  /** @min 0 */
  total_pages: number;
}

export interface FamilyExportFile {
  attached: boolean;
  /** @min 0 */
  byte_size?: number | null;
  content_type?: string | null;
}

export interface FamilyExport {
  /** @format uuid */
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  filename: string;
  downloadable: boolean;
  download_path?: string | null;
  file: FamilyExportFile;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface FamilyExportResponse {
  data: FamilyExport;
}

export interface FamilyExportCollection {
  /** @maxItems 100 */
  data: FamilyExport[];
  meta: Pagination;
}

export interface ErrorResponse {
  error: string;
  message?: string | null;
  details?: string[] | object | null;
  /** Validation error messages (alternative to details used by trades, valuations, etc.) */
  errors?: string[] | null;
}

export interface ErrorResponseWithImportId {
  error: string;
  message?: string | null;
  /**
   * Import ID preserved for retry or inspection after upload succeeds but publish fails
   * @format uuid
   */
  import_id: string;
}

export interface MfaRequiredResponse {
  error: string;
  mfa_required: boolean;
}

export interface ToolCall {
  /** @format uuid */
  id: string;
  function_name: string;
  function_arguments: Record<string, any>;
  function_result?: Record<string, any> | null;
  /** @format date-time */
  created_at: string;
}

export interface Message {
  /** @format uuid */
  id: string;
  type: "user_message" | "assistant_message";
  role: "user" | "assistant";
  content: string;
  model?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  tool_calls?: ToolCall[] | null;
}

export type MessageResponse = Message & {
  /** @format uuid */
  chat_id: string;
  ai_response_status?: "pending" | "complete" | "failed" | null;
  ai_response_message?: string | null;
};

export interface ChatResource {
  /** @format uuid */
  id: string;
  title: string;
  error?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export type ChatSummary = ChatResource & {
  /** @min 0 */
  message_count: number;
  /** @format date-time */
  last_message_at?: string | null;
};

export type ChatDetail = ChatResource & {
  messages: Message[];
  pagination?: Pagination | null;
};

export interface ChatCollection {
  chats: ChatSummary[];
  pagination: Pagination;
}

export interface RetryResponse {
  message: string;
  /** @format uuid */
  message_id: string;
}

export interface Account {
  /** @format uuid */
  id: string;
  name: string;
  account_type: string | null;
  status?: string;
}

export interface AccountDetail {
  /** @format uuid */
  id: string;
  name: string;
  balance: string;
  /** Signed balance in minor currency units */
  balance_cents: number;
  cash_balance: string;
  /** Signed cash balance in minor currency units */
  cash_balance_cents: number;
  currency: string;
  classification: string;
  account_type: string | null;
  subtype?: string | null;
  status: "active" | "draft" | "disabled" | "pending_deletion";
  institution_name?: string | null;
  institution_domain?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface AccountCollection {
  accounts: AccountDetail[];
  pagination: Pagination;
}

export interface FamilySettings {
  /** @format uuid */
  id: string;
  name?: string | null;
  currency: string;
  locale: string;
  date_format: string;
  country?: string | null;
  timezone?: string | null;
  /**
   * @min 1
   * @max 28
   */
  month_start_day: number;
  moniker: "Family" | "Group";
  default_account_sharing: "shared" | "private";
  custom_enabled_currencies: boolean;
  enabled_currencies: string[];
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface BudgetSummary {
  /** @format uuid */
  id: string;
  /** @format date */
  start_date: string;
  /** @format date */
  end_date: string;
  name: string;
  currency: string;
  initialized: boolean;
  current: boolean;
  budgeted_spending?: string | null;
  budgeted_spending_cents?: number | null;
  expected_income?: string | null;
  expected_income_cents?: number | null;
  allocated_spending?: string;
  allocated_spending_cents?: number;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface Budget {
  /** @format uuid */
  id: string;
  /** @format date */
  start_date: string;
  /** @format date */
  end_date: string;
  name: string;
  currency: string;
  initialized: boolean;
  current: boolean;
  budgeted_spending?: string | null;
  budgeted_spending_cents?: number | null;
  expected_income?: string | null;
  expected_income_cents?: number | null;
  allocated_spending?: string;
  allocated_spending_cents?: number;
  actual_spending?: string;
  actual_spending_cents?: number;
  actual_income?: string;
  actual_income_cents?: number;
  available_to_spend?: string;
  available_to_spend_cents?: number;
  available_to_allocate?: string;
  available_to_allocate_cents?: number;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface BudgetCollection {
  budgets: BudgetSummary[];
  pagination: Pagination;
}

export interface BudgetCategorySummary {
  /** @format uuid */
  id: string;
  /** @format uuid */
  budget_id: string;
  currency: string;
  subcategory: boolean;
  inherits_parent_budget: boolean;
  budgeted_spending?: string;
  budgeted_spending_cents?: number;
  display_budgeted_spending?: string;
  display_budgeted_spending_cents?: number;
  category: {
    /** @format uuid */
    id: string;
    name: string;
    color: string;
    lucide_icon: string;
    /** @format uuid */
    parent_id?: string | null;
  };
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface BudgetCategory {
  /** @format uuid */
  id: string;
  /** @format uuid */
  budget_id: string;
  currency: string;
  subcategory: boolean;
  inherits_parent_budget: boolean;
  budgeted_spending?: string;
  budgeted_spending_cents?: number;
  display_budgeted_spending?: string;
  display_budgeted_spending_cents?: number;
  actual_spending?: string;
  actual_spending_cents?: number;
  available_to_spend?: string;
  available_to_spend_cents?: number;
  category: {
    /** @format uuid */
    id: string;
    name: string;
    color: string;
    lucide_icon: string;
    /** @format uuid */
    parent_id?: string | null;
  };
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface BudgetCategoryCollection {
  budget_categories: BudgetCategorySummary[];
  pagination: Pagination;
}

export interface Balance {
  /** @format uuid */
  id: string;
  /** @format date */
  date: string;
  currency: string;
  /** @format float */
  flows_factor: number;
  balance: string;
  /** Balance in currency minor units */
  balance_cents: number;
  cash_balance?: string | null;
  /** Cash balance in currency minor units */
  cash_balance_cents?: number | null;
  start_cash_balance?: string;
  /** Starting cash balance in currency minor units */
  start_cash_balance_cents?: number;
  start_non_cash_balance?: string;
  /** Starting non-cash balance in currency minor units */
  start_non_cash_balance_cents?: number;
  start_balance: string;
  /** Starting total balance in currency minor units */
  start_balance_cents: number;
  cash_inflows?: string;
  /** Cash inflows in currency minor units */
  cash_inflows_cents?: number;
  cash_outflows?: string;
  /** Cash outflows in currency minor units */
  cash_outflows_cents?: number;
  non_cash_inflows?: string;
  /** Non-cash inflows in currency minor units */
  non_cash_inflows_cents?: number;
  non_cash_outflows?: string;
  /** Non-cash outflows in currency minor units */
  non_cash_outflows_cents?: number;
  net_market_flows?: string;
  /** Net market flows in currency minor units */
  net_market_flows_cents?: number;
  cash_adjustments?: string;
  /** Cash adjustments in currency minor units */
  cash_adjustments_cents?: number;
  non_cash_adjustments?: string;
  /** Non-cash adjustments in currency minor units */
  non_cash_adjustments_cents?: number;
  end_cash_balance?: string;
  /** Ending cash balance in currency minor units */
  end_cash_balance_cents?: number;
  end_non_cash_balance?: string;
  /** Ending non-cash balance in currency minor units */
  end_non_cash_balance_cents?: number;
  end_balance: string;
  /** Ending total balance in currency minor units */
  end_balance_cents: number;
  account: BalanceAccount;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface BalanceAccount {
  /** @format uuid */
  id: string;
  name: string;
  account_type: string | null;
}

export interface BalanceCollection {
  balances: Balance[];
  pagination: Pagination;
}

export interface Category {
  /** @format uuid */
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CategoryParent {
  /** @format uuid */
  id: string;
  name: string;
}

export interface CategoryDetail {
  /** @format uuid */
  id: string;
  name: string;
  color: string;
  icon: string;
  parent?: CategoryParent | null;
  /** @min 0 */
  subcategories_count: number;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface CategoryCollection {
  categories: CategoryDetail[];
  pagination: Pagination;
}

export interface CategoryCreateRequest {
  category: {
    /** Category name (required, unique within family) */
    name: string;
    /** Hex color code (e.g. #22c55e). Defaults to #6172F3 if omitted; subcategories inherit parent color. */
    color?: string;
    /** Lucide icon name (e.g. "coffee"). Auto-suggested from the name when omitted. */
    icon?: string;
    /**
     * Parent category ID. Must belong to the same family. Categories support up to 2 levels of nesting.
     * @format uuid
     */
    parent_id?: string | null;
  };
}

export interface Merchant {
  /** @format uuid */
  id: string;
  name: string;
}

export interface MerchantDetail {
  /** @format uuid */
  id: string;
  name: string;
  type: "FamilyMerchant" | "ProviderMerchant";
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface Tag {
  /** @format uuid */
  id: string;
  name: string;
  color: string;
}

export interface TagDetail {
  /** @format uuid */
  id: string;
  name: string;
  color: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export type TagCollection = TagDetail[];

export interface RuleAction {
  /** @format uuid */
  id: string;
  action_type: string;
  value?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface RuleCondition {
  /** @format uuid */
  id: string;
  condition_type: string;
  operator: string;
  value?: string | null;
  sub_conditions: RuleCondition[];
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface Rule {
  /** @format uuid */
  id: string;
  name?: string | null;
  resource_type: "transaction";
  active: boolean;
  /** @format date */
  effective_date?: string | null;
  conditions: RuleCondition[];
  actions: RuleAction[];
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface RuleResponse {
  data: Rule;
}

export interface RuleCollection {
  data: Rule[];
  meta: {
    current_page: number;
    next_page?: number | null;
    prev_page?: number | null;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface RuleRun {
  /** @format uuid */
  id: string;
  /** @format uuid */
  rule_id: string;
  rule_name: string | null;
  execution_type: "manual" | "scheduled";
  status: "pending" | "success" | "failed";
  /** @min 0 */
  transactions_queued: number;
  /** @min 0 */
  transactions_processed: number;
  /** @min 0 */
  transactions_modified: number;
  /** @min 0 */
  pending_jobs_count: number;
  /** @format date-time */
  executed_at: string;
  error_message?: string | null;
  rule: {
    /** @format uuid */
    id: string;
    name?: string | null;
    resource_type: string;
    active: boolean;
  } | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface RuleRunResponse {
  data: RuleRun;
}

export interface RuleRunCollection {
  data: RuleRun[];
  meta: {
    current_page: number;
    next_page?: number | null;
    prev_page?: number | null;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface Transfer {
  /** @format uuid */
  id: string;
  amount: string;
  currency: string;
  other_account?: Account | null;
}

export interface RecurringTransaction {
  /** @format uuid */
  id: string;
  amount: string;
  /** Amount in currency minor units */
  amount_cents: number;
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
  status: "active" | "inactive";
  /** @min 0 */
  occurrence_count: number;
  name?: string | null;
  manual: boolean;
  expected_amount_min?: string | null;
  /** Minimum expected amount in currency minor units */
  expected_amount_min_cents?: number | null;
  expected_amount_max?: string | null;
  /** Maximum expected amount in currency minor units */
  expected_amount_max_cents?: number | null;
  expected_amount_avg?: string | null;
  /** Average expected amount in currency minor units */
  expected_amount_avg_cents?: number | null;
  account?: Account | null;
  merchant?: Merchant | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface RecurringTransactionCollection {
  recurring_transactions: RecurringTransaction[];
  pagination: Pagination;
}

export interface Transaction {
  /** @format uuid */
  id: string;
  /** @format date */
  date: string;
  amount: string;
  currency: string;
  name: string;
  notes?: string | null;
  external_id?: string | null;
  source?: string | null;
  classification: string;
  account: Account;
  category?: Category | null;
  merchant?: Merchant | null;
  tags: Tag[];
  transfer?: Transfer | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface TransactionCollection {
  transactions: Transaction[];
  pagination: Pagination;
}

export interface TransferTransactionSide {
  /** @format uuid */
  id: string;
  /** @format uuid */
  entry_id: string;
  /** @format date */
  date: string;
  amount: string;
  /** Signed amount in currency minor units */
  amount_cents: number;
  currency: string;
  name: string;
  kind: string;
  account: {
    /** @format uuid */
    id: string;
    name: string;
    account_type: string | null;
  };
}

export interface TransferDecision {
  /** @format uuid */
  id: string;
  status: "pending" | "confirmed";
  /** @format date */
  date: string;
  amount: string;
  /** Absolute transfer amount in currency minor units */
  amount_cents: number;
  currency: string;
  transfer_type: "transfer" | "liability_payment" | "loan_payment";
  notes?: string | null;
  inflow_transaction: TransferTransactionSide;
  outflow_transaction: TransferTransactionSide;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface TransferDecisionCollection {
  transfers: TransferDecision[];
  pagination: Pagination;
}

export interface RejectedTransfer {
  /** @format uuid */
  id: string;
  inflow_transaction: TransferTransactionSide;
  outflow_transaction: TransferTransactionSide;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface RejectedTransferCollection {
  rejected_transfers: RejectedTransfer[];
  pagination: Pagination;
}

export interface Valuation {
  /** @format uuid */
  id: string;
  /** @format date */
  date: string;
  amount: string;
  currency: string;
  notes?: string | null;
  kind: string;
  account: Account;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface ValuationCollection {
  valuations: Valuation[];
  pagination: Pagination;
}

export interface DeleteResponse {
  message: string;
}

export interface ImportConfiguration {
  date_col_label?: string | null;
  amount_col_label?: string | null;
  name_col_label?: string | null;
  category_col_label?: string | null;
  tags_col_label?: string | null;
  notes_col_label?: string | null;
  account_col_label?: string | null;
  date_format?: string | null;
  number_format?: string | null;
  signage_convention?: string | null;
}

export interface ImportStats {
  /** @min 0 */
  rows_count: number;
  /** @min 0 */
  valid_rows_count: number;
  /** @min 0 */
  invalid_rows_count: number;
  /** @min 0 */
  mappings_count: number;
  /** @min 0 */
  unassigned_mappings_count: number;
}

/** SureImport only. Expected NDJSON counts compared to family-scoped database readback after publish. */
export interface ImportVerificationReadback {
  status?: "not_verified" | "matched" | "mismatch" | "failed" | "reverted";
  /** @format date-time */
  checked_at?: string | null;
  expected_record_counts?: Record<string, number>;
  before_counts?: Record<string, number>;
  after_counts?: Record<string, number>;
  actual_delta_counts?: Record<string, number>;
  checked_counts?: Record<string, number>;
  mismatches?: Record<
    string,
    {
      expected: number;
      actual: number;
    }
  >;
  error?: string | null;
}

/** SureImport only. Captured at upload and completed after import publish. */
export interface ImportVerification {
  expected_record_counts: Record<string, number>;
  /** SureImport only. Expected NDJSON counts compared to family-scoped database readback after publish. */
  readback: ImportVerificationReadback;
}

export interface ImportPreflightContent {
  filename: string;
  content_type: string;
  /** @min 0 */
  byte_size: number;
}

export interface ImportPreflightError {
  code: string;
  message: string;
}

export interface ImportPreflightStats {
  /**
   * CSV parsed non-header rows, or nonblank Sure NDJSON lines.
   * @min 0
   */
  rows_count: number;
  /**
   * SureImport only. Valid NDJSON records.
   * @min 0
   */
  valid_rows_count?: number;
  /**
   * SureImport only. Invalid NDJSON records. CSV malformed content returns a 422 instead.
   * @min 0
   */
  invalid_rows_count?: number;
  entity_counts?: Record<string, number> | null;
  record_type_counts?: Record<string, number> | null;
}

export interface ImportPreflight {
  type:
    | "TransactionImport"
    | "TradeImport"
    | "AccountImport"
    | "MintImport"
    | "ActualImport"
    | "CategoryImport"
    | "RuleImport"
    | "SureImport";
  valid: boolean;
  content: ImportPreflightContent;
  stats: ImportPreflightStats;
  headers?: string[] | null;
  required_headers?: string[] | null;
  missing_required_headers?: string[] | null;
  errors: ImportPreflightError[];
  warnings: string[];
}

export interface ImportPreflightResponse {
  data: ImportPreflight;
}

export interface ImportStatusSummary {
  uploaded: boolean;
  configured: boolean;
  terminal: boolean;
}

export type ImportStatusDetail = ImportStatusSummary & {
  cleaned: boolean;
  publishable: boolean;
  revertable: boolean;
};

export interface ImportSummary {
  /** @format uuid */
  id: string;
  type:
    | "TransactionImport"
    | "TradeImport"
    | "AccountImport"
    | "MintImport"
    | "ActualImport"
    | "CategoryImport"
    | "RuleImport"
    | "SureImport";
  status:
    | "pending"
    | "complete"
    | "importing"
    | "reverting"
    | "revert_failed"
    | "failed";
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /** @format uuid */
  account_id?: string | null;
  /** @min 0 */
  rows_count?: number;
  error?: string | null;
  status_detail: ImportStatusSummary;
}

export interface ImportDetail {
  /** @format uuid */
  id: string;
  type:
    | "TransactionImport"
    | "TradeImport"
    | "AccountImport"
    | "MintImport"
    | "ActualImport"
    | "CategoryImport"
    | "RuleImport"
    | "SureImport";
  status:
    | "pending"
    | "complete"
    | "importing"
    | "reverting"
    | "revert_failed"
    | "failed";
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  /** @format uuid */
  account_id?: string | null;
  error?: string | null;
  status_detail: ImportStatusDetail;
  configuration: ImportConfiguration;
  stats: ImportStats;
  /** SureImport only. Captured at upload and completed after import publish. */
  verification?: ImportVerification;
}

export interface ImportCollection {
  data: ImportSummary[];
  meta: {
    /** @min 1 */
    current_page: number;
    next_page?: number | null;
    prev_page?: number | null;
    /** @min 0 */
    total_pages: number;
    /** @min 0 */
    total_count: number;
    /** @min 1 */
    per_page: number;
  };
}

export interface ImportResponse {
  data: ImportDetail;
}

export interface ProviderConnectionInstitution {
  name: string | null;
  domain?: string | null;
  url?: string | null;
}

export interface ProviderConnectionAccounts {
  /** @min 0 */
  total_count: number;
  /** @min 0 */
  linked_count: number;
  /** @min 0 */
  unlinked_count: number;
}

export interface ProviderConnectionSyncLatest {
  /** @format uuid */
  id: string;
  status: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  syncing_at?: string | null;
  /** @format date-time */
  completed_at?: string | null;
  /** @format date-time */
  failed_at?: string | null;
  /** Sanitized latest sync error summary. Null when the latest sync is not failed or stale. */
  error?: {
    /** Always true when this object is present. */
    present: boolean;
    /** Stable sanitized error category message; raw provider error text is never exposed. */
    message?: string | null;
  } | null;
}

export interface ProviderConnectionSync {
  syncing: boolean;
  status_summary?: string | null;
  /** @format date-time */
  last_synced_at?: string | null;
  latest?: ProviderConnectionSyncLatest | null;
}

export interface ProviderConnection {
  /** @format uuid */
  id: string;
  provider: string;
  provider_type: string;
  name: string;
  status: string | null;
  /** False when the provider item does not expose this status. */
  requires_update: boolean | null;
  /** False when credential readiness is unknown. */
  credentials_configured: boolean | null;
  /** False when the provider item does not expose this status. */
  scheduled_for_deletion: boolean | null;
  /** False when account setup state is unknown. */
  pending_account_setup: boolean | null;
  institution: ProviderConnectionInstitution;
  accounts: ProviderConnectionAccounts;
  sync: ProviderConnectionSync;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface ProviderConnectionCollection {
  data: ProviderConnection[];
}

export interface ImportRowMapping {
  key: string | null;
  type: string;
  value: string | null;
  create_when_empty: boolean;
  creatable: boolean;
  mappable: {
    /** @format uuid */
    id?: string;
    type?: string;
    name?: string | null;
  } | null;
}

export interface ImportRowDiagnostic {
  /** @format uuid */
  id: string;
  /** @min 1 */
  row_number: number;
  valid: boolean;
  errors: string[];
  fields: {
    account?: string | null;
    date?: string | null;
    qty?: string | null;
    ticker?: string | null;
    exchange_operating_mic?: string | null;
    price?: string | null;
    amount?: string | null;
    currency?: string | null;
    name?: string | null;
    category?: string | null;
    tags?: string | null;
    entity_type?: string | null;
    notes?: string | null;
    active?: boolean | null;
    effective_date?: string | null;
    conditions?: string | null;
    actions?: string | null;
  };
  mappings: {
    account?: ImportRowMapping;
    category?: ImportRowMapping;
    account_type?: ImportRowMapping;
    tags?: ImportRowMapping[];
  };
}

export interface ImportRowDiagnosticCollection {
  data: ImportRowDiagnostic[];
  meta: {
    /** @min 1 */
    current_page: number;
    next_page?: number | null;
    prev_page?: number | null;
    /** @min 0 */
    total_pages: number;
    /** @min 0 */
    total_count: number;
    /** @min 1 */
    per_page: number;
  };
}

export interface SyncableSummary {
  type: string;
  /** @format uuid */
  id: string;
  name?: string | null;
}

export interface SyncErrorSummary {
  message: string;
}

export interface SyncResource {
  /** @format uuid */
  id: string;
  status: "pending" | "syncing" | "completed" | "failed" | "stale";
  in_progress: boolean;
  terminal: boolean;
  syncable: SyncableSummary;
  /** @format uuid */
  parent_id?: string | null;
  /** @min 0 */
  children_count: number;
  /** @format date */
  window_start_date?: string | null;
  /** @format date */
  window_end_date?: string | null;
  /** @format date-time */
  pending_at?: string | null;
  /** @format date-time */
  syncing_at?: string | null;
  /** @format date-time */
  completed_at?: string | null;
  /** @format date-time */
  failed_at?: string | null;
  error?: SyncErrorSummary | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface SyncResponse {
  data: SyncResource | null;
}

export interface SyncCollection {
  /** @maxItems 100 */
  data: SyncResource[];
  meta: Pagination;
}

export interface Trade {
  /** @format uuid */
  id: string;
  /** @format date */
  date: string;
  amount: string;
  currency: string;
  name: string;
  notes?: string | null;
  qty: string;
  price: string;
  investment_activity_label?: string | null;
  account: Account;
  security?: {
    /** @format uuid */
    id?: string;
    ticker?: string;
    name?: string | null;
  } | null;
  category?: {
    /** @format uuid */
    id?: string;
    name?: string;
  } | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface TradeCollection {
  trades: Trade[];
  pagination: Pagination;
}

export interface Holding {
  /** @format uuid */
  id: string;
  /** @format date */
  date: string;
  /** Quantity of shares held */
  qty: string;
  /** Formatted price per share */
  price: string;
  amount: string;
  currency: string;
  cost_basis_source?: string | null;
  account: Account;
  security: {
    /** @format uuid */
    id: string;
    ticker: string;
    name: string | null;
  };
  avg_cost?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface HoldingCollection {
  holdings: Holding[];
  pagination: Pagination;
}

export interface Security {
  /** @format uuid */
  id: string;
  ticker: string;
  name?: string | null;
  kind: "standard" | "cash";
  country_code?: string | null;
  exchange_mic?: string | null;
  exchange_acronym?: string | null;
  exchange_operating_mic?: string | null;
  exchange_name?: string | null;
  offline: boolean;
  offline_reason?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  /** @format date */
  first_provider_price_on?: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface SecurityCollection {
  securities: Security[];
  pagination: Pagination;
}

export interface SecurityPrice {
  /** @format uuid */
  id: string;
  /** @format date */
  date: string;
  /** Formatted security price */
  price: string;
  /** Exact decimal security price */
  price_amount: string;
  currency: string;
  provisional: boolean;
  security: {
    /** @format uuid */
    id: string;
    ticker: string;
    name?: string | null;
    exchange_operating_mic?: string | null;
  };
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface SecurityPriceCollection {
  security_prices: SecurityPrice[];
  pagination: Pagination;
}

export interface Money {
  /** Numeric amount as string */
  amount: string;
  /** ISO 4217 currency code */
  currency: string;
  /** Locale-formatted money string */
  formatted: string;
}

export interface BalanceSheet {
  /** Family primary currency */
  currency: string;
  net_worth: Money;
  assets: Money;
  liabilities: Money;
}

export interface SuccessMessage {
  message: string;
}

export interface ResetInitiatedResponse {
  message: string;
  status: "queued";
  /** Informational Active Job identifier returned by the queue adapter; reset status is family-scoped, not job-scoped. */
  job_id: string;
  /**
   * UUID of the family being reset.
   * @format uuid
   */
  family_id: string;
  status_url: string;
}

export interface ResetStatusResponse {
  /** Counts-based family reset status at response time. */
  status: "complete" | "data_remaining";
  /**
   * UUID of the family whose reset target counts were checked.
   * @format uuid
   */
  family_id: string;
  /** True when all reset target counts are zero at response time. This is a family data snapshot, not a durable per-job completion record. */
  reset_complete: boolean;
  counts: {
    /** @min 0 */
    accounts: number;
    /** @min 0 */
    categories: number;
    /** @min 0 */
    tags: number;
    /** @min 0 */
    merchants: number;
    /** @min 0 */
    plaid_items: number;
    /** @min 0 */
    imports: number;
    /** @min 0 */
    budgets: number;
  };
}
