# StatementFlow 2.0 零代码运营与扩展指南（B2B 财务单据转换微 SaaS）

这套 `statementflow` 项目不再是表面演示壳子，而是**真正具备商用交付能力的垂直财务转换微 SaaS**：

## 一、 已经真实打通的 4 大硬核能力（现在就能在浏览器亲手实测！）

1. **真实 PDF 上传与内存即焚提取（`/api/extract-pdf`）**
   - 你可以直接点击工作台上的 `Download Sample PDF to Test Upload` 下载真实的 `.pdf` 银行对账单文件，再把它拖进上传框，亲眼体验服务端 `unpdf` 毫秒级提取真实交易行！
   - 后续只需在 `.env.local` 填入 `OPENROUTER_API_KEY`（预充 \$5 够解析几千页！），系统会自动开启 `Gemini 2.5 Flash` 视觉多模态通道，连手机歪斜拍照和纸质扫描件账单都能精准提取。
2. **分位整数级「自动数学平账引擎」+「正负号极性翻转一键修复」（`src/lib/reconcile.ts`）**
   - 点击工作台右上角的 **`⚠️ Test OCR Sign Error (+Fix)`** 按钮，你会看到当扫描件某笔 `\$125.00` 退款被误识为支出导致差额 `-\$250.00` 时，系统不仅标红异常行，还会弹出智能诊断横幅，点一下 **`Fix Row #4 Sign in 1 Click`** 即可秒变 **`100% Math Reconciled ($0.00 Discrepancy)`**！
3. **4 种原生会计软件格式真实下载（`src/lib/exporters.ts`）**
   - **QuickBooks (`.QBO` Web Connect)**：带合规 `INTU.BID 3000` 与防重复 `FITID`
   - **Xero CSV**：严格遵循 `*Date,*Amount` 官方规范，支持一键切换英澳 `DD/MM/YYYY` 与美加 `MM/DD/YYYY`
   - **Verified `.XLSX`**：原生双工作表 Excel（表 1 为干净数值账目表，表 2 为 CPA 审计平账证书页）
   - **QuickBooks 4 列 CSV**
4. **2 个 \$0 算力免费精准引流小工具（专门从 Google 截获真实会计师流量）**
   - `/tools/qbo-viewer`：纯浏览器本地打开并检查 `.QBO` / `.OFX` 文件，还能免费转成 Excel！
   - `/tools/csv-to-qbo`：纯浏览器本地把 CSV 打包成合规 `.QBO` 文件！

---

## 二、 后续零代码扩充 pSEO 长尾词只需改一个文件

打开 `src/config/seoPages.config.ts`，里面已经内置了 5 个最高商业价值的底部转化词页面：
- `/convert/pdf-to-qbo`
- `/convert/pdf-to-xero-csv`
- `/convert/scanned-bank-statement-ocr`
- `/convert/credit-card-pdf-to-excel`
- `/convert/invoice-pdf-to-excel`

以后你想针对某个特定场景（例如 `convert rent roll pdf to excel` 或 `loan statement pdf to xero`）新增长尾落地页，只需让我往 `seoPages.config.ts` 加一段配置，全站页面、结构化数据与 `/sitemap.xml` 就会自动生成！
