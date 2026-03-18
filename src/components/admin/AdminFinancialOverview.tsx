import { DollarSign, TrendingUp, Users, Wallet } from 'lucide-react';

interface FinancialOverviewProps {
  totalRevenue: number;
  totalProfit: number;
  totalPayments: number;
  memberPayments: { name: string; total: number }[];
}

export default function AdminFinancialOverview({ totalRevenue, totalProfit, totalPayments, memberPayments }: FinancialOverviewProps) {
  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const cards = [
    { label: 'Faturamento Total', value: `R$ ${fmt(totalRevenue)}`, icon: DollarSign, accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Lucro Total', value: `R$ ${fmt(totalProfit)}`, icon: TrendingUp, accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Total a Pagar (Equipe)', value: `R$ ${fmt(totalPayments)}`, icon: Wallet, accent: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${c.accent}`}>
                <c.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{c.label}</span>
            </div>
            <p className="text-2xl font-serif text-white">{c.value}</p>
          </div>
        ))}
      </div>

      {memberPayments.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-orange" />
            <span className="text-sm font-mono text-white/50 uppercase tracking-wider">Pagamento por Membro</span>
          </div>
          <div className="divide-y divide-white/5">
            {memberPayments.map((m) => (
              <div key={m.name} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-white">{m.name}</span>
                <span className="text-sm font-mono text-brand-orange">R$ {fmt(m.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
