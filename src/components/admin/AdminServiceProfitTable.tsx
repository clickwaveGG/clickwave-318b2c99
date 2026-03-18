import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Service {
  id: string;
  service_name: string;
  price: number | null;
  profit: number | null;
  member_payment: number | null;
  client_name?: string;
  responsible_name?: string;
}

interface Props {
  services: Service[];
}

export default function AdminServiceProfitTable({ services }: Props) {
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState<Record<string, { profit?: string; member_payment?: string }>>({});

  const updateMutation = useMutation({
    mutationFn: async ({ id, profit, member_payment }: { id: string; profit: number; member_payment: number }) => {
      const { error } = await supabase
        .from('client_services')
        .update({ profit, member_payment })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast({ title: 'Valores atualizados!' });
    },
  });

  const fmt = (v: number | null) => (v ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const getEdit = (id: string) => edits[id] || {};
  const setEdit = (id: string, field: string, value: string) =>
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const handleSave = (s: Service) => {
    const e = getEdit(s.id);
    updateMutation.mutate({
      id: s.id,
      profit: e.profit !== undefined ? parseFloat(e.profit) || 0 : (s.profit ?? 0),
      member_payment: e.member_payment !== undefined ? parseFloat(e.member_payment) || 0 : (s.member_payment ?? 0),
    });
    setEdits(prev => { const n = { ...prev }; delete n[s.id]; return n; });
  };

  const inputClass = 'bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white w-24 focus:outline-none focus:border-brand-orange/40 font-mono';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-brand-orange" />
        <span className="text-sm font-mono text-white/50 uppercase tracking-wider">Lucro e Pagamentos por Serviço</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Cliente</th>
              <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Serviço</th>
              <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Responsável</th>
              <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Preço</th>
              <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Lucro</th>
              <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Pgto Membro</th>
              <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-white/20 text-sm font-mono">Nenhum serviço encontrado</td></tr>
            ) : services.map((s) => {
              const e = getEdit(s.id);
              const hasChanges = e.profit !== undefined || e.member_payment !== undefined;

              return (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-sm text-white">{s.client_name || '—'}</td>
                  <td className="p-4 text-sm text-white/70">{s.service_name}</td>
                  <td className="p-4 text-sm text-white/40">{s.responsible_name || '—'}</td>
                  <td className="p-4 text-sm font-mono text-white/50">R$ {fmt(s.price)}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      step="0.01"
                      className={inputClass}
                      value={e.profit !== undefined ? e.profit : (s.profit ?? 0)}
                      onChange={(ev) => setEdit(s.id, 'profit', ev.target.value)}
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      step="0.01"
                      className={inputClass}
                      value={e.member_payment !== undefined ? e.member_payment : (s.member_payment ?? 0)}
                      onChange={(ev) => setEdit(s.id, 'member_payment', ev.target.value)}
                    />
                  </td>
                  <td className="p-4">
                    {hasChanges && (
                      <button
                        onClick={() => handleSave(s)}
                        className="text-brand-orange hover:text-brand-orange/80 transition-colors"
                        title="Salvar"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
