import { StatementDocument, ReconciliationAudit, RowAuditStatus } from "./types";

/**
 * ============================================================================
 * 确定性分位整数平账校验引擎 (Auto-Reconciliation Engine)
 * ============================================================================
 * 全部转换为美分整数 (Integer Cents) 运算，彻底杜绝浮点数精度误差 (0.1 + 0.2 !== 0.3)。
 * 功能：
 * 1. 核对 期初余额 + 总收入 - 总支出 === 期末余额
 * 2. 逐行推算 Running Balance 并定位具体哪一行扫描出错
 * 3. 智能极性翻转诊断：如果某笔退款/支出正负号被扫反导致差额刚好为 2 倍金额，一键提示修复！
 */

function toCents(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}

function fromCents(cents: number): number {
  return Number((cents / 100).toFixed(2));
}

export function runReconciliationAudit(
  doc: StatementDocument
): ReconciliationAudit {
  const openingCents = toCents(doc.openingBalance);
  const expectedClosingCents = toCents(doc.closingBalance);

  let totalCreditsCents = 0;
  let totalDebitsCents = 0;
  let runningCents = openingCents;

  const rowStatuses: Record<string, RowAuditStatus> = {};
  const flaggedRowIds: string[] = [];

  for (const row of doc.rows) {
    const creditCents = toCents(Math.max(0, row.credit || 0));
    const debitCents = toCents(Math.max(0, row.debit || 0));

    totalCreditsCents += creditCents;
    totalDebitsCents += debitCents;
    runningCents = runningCents + creditCents - debitCents;

    let hasRunningMismatch = false;
    let runningDiffCents = 0;

    if (row.reportedBalance !== null && Number.isFinite(row.reportedBalance)) {
      const reportedCents = toCents(row.reportedBalance);
      runningDiffCents = runningCents - reportedCents;
      if (Math.abs(runningDiffCents) >= 1) {
        hasRunningMismatch = true;
        flaggedRowIds.push(row.id);
      }
    }

    rowStatuses[row.id] = {
      rowId: row.id,
      calculatedRunningBalance: fromCents(runningCents),
      hasRunningMismatch,
      runningDiff: fromCents(runningDiffCents),
    };
  }

  const calculatedClosingCents =
    openingCents + totalCreditsCents - totalDebitsCents;
  const discrepancyCents = calculatedClosingCents - expectedClosingCents;
  const isReconciled =
    Math.abs(discrepancyCents) === 0 && flaggedRowIds.length === 0;

  // Smart Polarity Flip Detection:
  // If calculatedClosing - expectedClosing === +2 * X, a debit of X was mistakenly entered as credit of X.
  // If calculatedClosing - expectedClosing === -2 * X, a credit of X was mistakenly entered as debit of X.
  let suggestedPolarityFlip: ReconciliationAudit["suggestedPolarityFlip"];
  if (Math.abs(discrepancyCents) >= 2 && Math.abs(discrepancyCents) % 2 === 0) {
    const targetAmountCents = Math.abs(discrepancyCents) / 2;

    doc.rows.forEach((row, index) => {
      if (suggestedPolarityFlip) return;
      const dCents = toCents(row.debit);
      const cCents = toCents(row.credit);

      if (discrepancyCents < 0 && dCents === targetAmountCents && cCents === 0) {
        suggestedPolarityFlip = {
          rowId: row.id,
          rowIndex: index + 1,
          description: row.description,
          amount: fromCents(targetAmountCents),
          direction: "debit_to_credit",
        };
      } else if (
        discrepancyCents > 0 &&
        cCents === targetAmountCents &&
        dCents === 0
      ) {
        suggestedPolarityFlip = {
          rowId: row.id,
          rowIndex: index + 1,
          description: row.description,
          amount: fromCents(targetAmountCents),
          direction: "credit_to_debit",
        };
      }
    });
  }

  return {
    openingBalance: fromCents(openingCents),
    totalCredits: fromCents(totalCreditsCents),
    totalDebits: fromCents(totalDebitsCents),
    calculatedClosingBalance: fromCents(calculatedClosingCents),
    expectedClosingBalance: fromCents(expectedClosingCents),
    discrepancy: fromCents(discrepancyCents),
    isReconciled,
    rowStatuses,
    flaggedRowIds,
    suggestedPolarityFlip,
  };
}
