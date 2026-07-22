import { useState, useCallback, useRef } from 'react'
import {
  Copy,
  Bell,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShieldCheck,
  FolderOpen,
  Upload,
  Search,
  ChevronDown,
  Eye,
} from 'lucide-react'

type Lang = 'EN' | 'BG'

const t = {
  EN: {
    brand: 'DocuFetch',
    tagline: 'Secure Document Collection',
    disclaimerTitle: 'Demo Environment Notice',
    disclaimerBody:
      'This is a live demonstration of the DocuFetch platform by Core-Logic. All client data shown is fictitious and used solely for illustration purposes. By continuing, you acknowledge this is a non-production environment.',
    disclaimerNote:
      'Unauthorized use or reproduction of this interface is prohibited.',
    accept: 'Accept & Enter Demo',
    dashboard: 'Document Requests',
    dashboardSub: 'Track and manage secure file collection from your clients',
    search: 'Search clients or documents…',
    filter: 'All Statuses',
    copyLink: 'Copy Link',
    remind: 'Send Reminder',
    viewFiles: 'View Files',
    filesUploaded: 'files uploaded',
    due: 'Due',
    status: {
      complete: 'Complete',
      partial: 'Partial',
      pending: 'Pending',
      overdue: 'Overdue',
    },
    stats: {
      total: 'Total Requests',
      complete: 'Complete',
      pending: 'Awaiting Files',
      overdue: 'Overdue',
    },
    uploadZone: 'Drag & drop files here or click to browse',
    uploadSub: 'PDF, XLSX, DOCX up to 25 MB each',
    copiedMsg: 'Link copied!',
    reminderMsg: 'Reminder sent!',
  },
  BG: {
    brand: 'DocuFetch',
    tagline: 'Сигурно събиране на документи',
    disclaimerTitle: 'Демонстрационна среда',
    disclaimerBody:
      'Тази версия на DocuFetch от Core-Logic съдържа изцяло фиктивни данни за илюстративни цели. Продължавайки напред, Вие се съгласявате, че се намирате в тестова среда.',
    disclaimerNote:
      'Интелектуалната собственост принадлежи на Core Logic Ltd. Копирането и разпространението на този интерфейс са строго забранени.',
    accept: 'Приемам и влизам в демото',
    dashboard: 'Заявки за документи',
    dashboardSub: 'Проследявайте и управлявайте сигурното събиране на файлове от клиентите',
    search: 'Търсене на клиенти или документи…',
    filter: 'Всички статуси',
    copyLink: 'Копирай връзка',
    remind: 'Изпрати напомняне',
    viewFiles: 'Преглед на файлове',
    filesUploaded: 'файла качени',
    due: 'Краен срок',
    status: {
      complete: 'Завършен',
      partial: 'Частичен',
      pending: 'Изчакващ',
      overdue: 'Просрочен',
    },
    stats: {
      total: 'Общо заявки',
      complete: 'Завършени',
      pending: 'Очакват файлове',
      overdue: 'Просрочени',
    },
    uploadZone: 'Плъзнете файлове тук или кликнете за разглеждане',
    uploadSub: 'PDF, XLSX, DOCX до 25 МБ всеки',
    copiedMsg: 'Връзката е копирана!',
    reminderMsg: 'Напомнянето е изпратено!',
  },
}

type Status = 'complete' | 'partial' | 'pending' | 'overdue'

interface RequestItem {
  id: string
  client: string
  company: string
  docType: string
  uploaded: number
  required: number
  status: Status
  dueDate: string
  link: string
  avatar: string
}

const requests: RequestItem[] = [
  {
    id: '1',
    client: 'Elena Ivanova',
    company: 'Ivanova & Partners EOOD',
    docType: 'Q2 2024 Invoices & VAT Return',
    uploaded: 12,
    required: 12,
    status: 'complete',
    dueDate: '2024-07-15',
    link: 'https://docufetch.app/r/a1b2c3',
    avatar: 'EI',
  },
  {
    id: '2',
    client: 'Georgi Petkov',
    company: 'TechStar Solutions AD',
    docType: 'Payroll Records — June 2024',
    uploaded: 3,
    required: 8,
    status: 'partial',
    dueDate: '2024-07-20',
    link: 'https://docufetch.app/r/d4e5f6',
    avatar: 'GP',
  },
  {
    id: '3',
    client: 'Maria Stoyanova',
    company: 'Agro-Invest OOD',
    docType: 'Annual Tax Declaration 2023',
    uploaded: 0,
    required: 6,
    status: 'overdue',
    dueDate: '2024-06-30',
    link: 'https://docufetch.app/r/g7h8i9',
    avatar: 'MS',
  },
  {
    id: '4',
    client: 'Dimitar Kolev',
    company: 'Kolev Logistics EOOD',
    docType: 'Monthly Expenses — May & June',
    uploaded: 0,
    required: 10,
    status: 'pending',
    dueDate: '2024-07-25',
    link: 'https://docufetch.app/r/j1k2l3',
    avatar: 'DK',
  },
  {
    id: '5',
    client: 'Nadezhda Valkova',
    company: 'Studio Valkova Ltd',
    docType: 'Q1 2024 Financial Statements',
    uploaded: 5,
    required: 5,
    status: 'complete',
    dueDate: '2024-07-10',
    link: 'https://docufetch.app/r/m4n5o6',
    avatar: 'NV',
  },
  {
    id: '6',
    client: 'Stefan Angelov',
    company: 'Black Sea Trading AD',
    docType: 'Import Customs Declarations',
    uploaded: 2,
    required: 9,
    status: 'partial',
    dueDate: '2024-07-28',
    link: 'https://docufetch.app/r/p7q8r9',
    avatar: 'SA',
  },
]

function StatusBadge({ status, lang }: { status: Status; lang: Lang }) {
  const cfg = {
    complete: { icon: CheckCircle2, cls: 'bg-emerald-950 text-emerald-400 border-emerald-900' },
    partial:  { icon: Clock,         cls: 'bg-amber-950  text-amber-400  border-amber-900'  },
    pending:  { icon: AlertCircle,   cls: 'bg-blue-950   text-blue-400   border-blue-900'   },
    overdue:  { icon: XCircle,       cls: 'bg-red-950    text-red-400    border-red-900'    },
  }[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono font-medium ${cfg.cls}`}>
      <Icon size={11} />
      {t[lang].status[status]}
    </span>
  )
}

function CoreLogicLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz      = { sm: 'px-2 py-1 text-xs',    md: 'px-3 py-1.5 text-sm', lg: 'px-4 py-2 text-base' }[size]
  const termSz  = { sm: 'text-sm',               md: 'text-lg',             lg: 'text-2xl'             }[size]
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 ${sz}`}
      style={{ boxShadow: '0 0 12px rgba(59,130,246,0.10)' }}
    >
      <span className={`font-mono font-bold text-blue-400 ${termSz}`}>{'>'}_</span>
      <span className="font-semibold text-white tracking-tight">Core-Logic</span>
    </div>
  )
}

function SplashModal({
  lang,
  setLang,
  onAccept,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  onAccept: () => void
}) {
  const tx = t[lang]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 0 60px rgba(59,130,246,0.07), 0 25px 50px rgba(0,0,0,0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blue top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="p-8">
          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            <CoreLogicLogo size="md" />
            <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1">
              {(['EN', 'BG'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all duration-150 ${
                    lang === l
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-blue-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-950 border border-blue-900 flex items-center justify-center">
              <ShieldCheck size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{tx.disclaimerTitle}</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">docufetch.app · demo</p>
            </div>
          </div>

          {/* Body */}
          <p className="text-sm text-slate-400 leading-relaxed mb-4">{tx.disclaimerBody}</p>

          {/* Warning note */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-900/50 bg-amber-950/30 px-3 py-2.5 mb-6">
            <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400/80">{tx.disclaimerNote}</p>
          </div>

          {/* CTA */}
          <button
            onClick={onAccept}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm tracking-wide transition-all duration-150 hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {tx.accept}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background:
            pct === 100
              ? 'linear-gradient(90deg, #059669, #10b981)'
              : pct > 50
              ? 'linear-gradient(90deg, #d97706, #f59e0b)'
              : pct > 0
              ? 'linear-gradient(90deg, #1d4ed8, #3b82f6)'
              : '#1e293b',
        }}
      />
    </div>
  )
}

function RequestCard({
  item,
  lang,
  onCopy,
  onRemind,
}: {
  item: RequestItem
  lang: Lang
  onCopy: (id: string) => void
  onRemind: (id: string) => void
}) {
  const tx = t[lang]
  const pct = item.required === 0 ? 0 : Math.round((item.uploaded / item.required) * 100)
  const due = new Date(item.dueDate).toLocaleDateString(lang === 'BG' ? 'bg-BG' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:border-slate-700 hover:shadow-lg hover:shadow-black/40">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-950 border border-blue-900 flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-blue-400">{item.avatar}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">{item.client}</p>
            <p className="text-xs text-slate-500 truncate">{item.company}</p>
          </div>
        </div>
        <StatusBadge status={item.status} lang={lang} />
      </div>

      {/* Doc type */}
      <div className="flex items-center gap-2 mb-3">
        <FileText size={13} className="text-slate-500 flex-shrink-0" />
        <p className="text-xs text-slate-400 font-mono truncate">{item.docType}</p>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <ProgressBar value={item.uploaded} max={item.required} />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs font-mono text-slate-500">
            <span className="text-slate-200 font-semibold">{item.uploaded}</span>
            {' / '}
            {item.required} {tx.filesUploaded}
          </span>
          <span className="text-xs font-mono text-slate-500">{pct}%</span>
        </div>
      </div>

      {/* Due date */}
      <div className="flex items-center gap-1.5 mb-4">
        <Clock size={12} className="text-slate-500" />
        <span className="text-xs text-slate-500">
          {tx.due}:{' '}
          <span className={`font-mono font-medium ${item.status === 'overdue' ? 'text-red-400' : 'text-slate-300'}`}>
            {due}
          </span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onCopy(item.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-400 font-mono hover:border-blue-700 hover:text-blue-400 transition-all duration-150 active:scale-95"
        >
          <Copy size={12} />
          {tx.copyLink}
        </button>
        <button
          onClick={() => onRemind(item.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-400 font-mono hover:border-amber-700 hover:text-amber-400 transition-all duration-150 active:scale-95"
        >
          <Bell size={12} />
          {tx.remind}
        </button>
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-400 font-mono hover:border-slate-500 hover:text-slate-200 transition-all duration-150 active:scale-95">
          <Eye size={12} />
          {tx.viewFiles}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>('EN')
  const [showSplash, setShowSplash] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all')
  const [toasts, setToasts] = useState<{ id: string; msg: string }[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  const tx = t[lang]

  const toast = useCallback((msg: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, msg }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500)
  }, [])

  const handleCopy = useCallback(
    (id: string) => {
      const item = requests.find((r) => r.id === id)
      if (item) {
        navigator.clipboard.writeText(item.link).catch(() => {})
        toast(tx.copiedMsg)
      }
    },
    [tx, toast],
  )

  const handleRemind = useCallback(
    (id: string) => {
      void id
      toast(tx.reminderMsg)
    },
    [tx, toast],
  )

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.client.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.docType.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: requests.length,
    complete: requests.filter((r) => r.status === 'complete').length,
    pending: requests.filter((r) => r.status === 'pending' || r.status === 'partial').length,
    overdue: requests.filter((r) => r.status === 'overdue').length,
  }

  const triggerSplash = () => {
    if (!showSplash) setShowSplash(true)
  }

  return (
    <div
      className="min-h-screen w-full relative bg-slate-950"
      style={{ background: 'radial-gradient(ellipse at 30% 0%, #0f172a 0%, #020617 70%)' }}
      onClick={triggerSplash}
    >
      {/* Ambient grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Blur overlay when splash shown */}
      {showSplash && (
        <div className="fixed inset-0 z-40 backdrop-blur-md bg-black/40" />
      )}

      {/* Main panel — stopPropagation so clicks inside don't retrigger splash */}
      <div
        ref={panelRef}
        className="relative z-10 mx-auto max-w-5xl px-4 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <FolderOpen size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
                {tx.brand}
              </h1>
              <p className="text-xs font-mono text-slate-500 leading-none mt-0.5">{tx.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1">
              {(['EN', 'BG'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all duration-150 ${
                    lang === l
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-blue-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: tx.stats.total,    value: stats.total,    color: 'text-slate-100'  },
            { label: tx.stats.complete, value: stats.complete, color: 'text-emerald-400' },
            { label: tx.stats.pending,  value: stats.pending,  color: 'text-amber-400'  },
            { label: tx.stats.overdue,  value: stats.overdue,  color: 'text-red-400'    },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard heading */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-100 mb-1">{tx.dashboard}</h2>
          <p className="text-sm text-slate-500">{tx.dashboardSub}</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col gap-3 mb-5 sm:flex-row">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tx.search}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-800 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | 'all')}
              className="appearance-none w-full sm:w-44 rounded-xl border border-slate-800 bg-slate-900 pl-4 pr-9 py-2.5 text-sm text-slate-300 font-mono focus:outline-none focus:border-blue-700 cursor-pointer"
            >
              <option value="all">{tx.filter}</option>
              <option value="complete">{tx.status.complete}</option>
              <option value="partial">{tx.status.partial}</option>
              <option value="pending">{tx.status.pending}</option>
              <option value="overdue">{tx.status.overdue}</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <RequestCard
              key={item.id}
              item={item}
              lang={lang}
              onCopy={handleCopy}
              onRemind={handleRemind}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <FolderOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-mono">No matching requests</p>
          </div>
        )}

        {/* Upload zone — clicking triggers the splash modal instead of uploading */}
        <div
          className="mt-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 px-6 py-8 text-center hover:border-slate-700 transition-colors duration-200 cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation()
            triggerSplash()
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            triggerSplash()
          }}
        >
          <Upload size={24} className="mx-auto mb-2 text-slate-600 group-hover:text-slate-400 transition-colors" />
          <p className="text-sm text-slate-400 font-medium">{tx.uploadZone}</p>
          <p className="text-xs text-slate-600 font-mono mt-1">{tx.uploadSub}</p>
        </div>
      </div>

      {/* Splash modal */}
      {showSplash && (
        <SplashModal
          lang={lang}
          setLang={setLang}
          onAccept={() => setShowSplash(false)}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="px-4 py-2.5 rounded-xl border border-blue-800 bg-slate-900 text-blue-400 text-xs font-mono shadow-lg"
            style={{ boxShadow: '0 0 20px rgba(59,130,246,0.12)' }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
