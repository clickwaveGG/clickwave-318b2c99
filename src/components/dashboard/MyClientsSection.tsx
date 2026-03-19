import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Users, CheckCircle2, Circle, ChevronDown, ChevronUp, X, Package, Video, Palette, Globe, Megaphone, Bot, LayoutGrid } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getServiceIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('vídeo') || n.includes('video')) return Video;
  if (n.includes('design') || n.includes('post') || n.includes('branding')) return Palette;
  if (n.includes('site') || n.includes('landing')) return Globe;
  if (n.includes('tráfego') || n.includes('trafego')) return Megaphone;
  if (n.includes('automação') || n.includes('automacao') || n.includes('chatbot')) return Bot;
  return Package;
}

function groupServices(services: any[]) {
  const groups: { label: string; items: any[]; isGroup: boolean }[] = [];
  const singles: any[] = [];
  const grouped = new Map<string, any[]>();

  services.forEach((s: any) => {
    // Detect patterns like "Vídeo 1/10", "Vídeo 2/10"
    const match = s.service_name.match(/^(.+?)\s*\d+\s*\/\s*\d+/);
    if (match) {
      const key = match[1].trim();
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(s);
    } else {
      singles.push(s);
    }
  });

  grouped.forEach((items, label) => {
    groups.push({ label, items, isGroup: true });
  });

  singles.forEach(s => {
    groups.push({ label: s.service_name, items: [s], isGroup: false });
  });

  return groups;
}

export function MyClientsSection() {
  const { user } = useAuth();
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const currentMonth = format(new Date(), 'yyyy-MM-01');

  const { data: services = [] } = useQuery({
    queryKey: ['my-client-services', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('client_services')
        .select('*, clients(name)')
        .eq('responsible_id', user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: completions = [] } = useQuery({
    queryKey: ['my-service-completions', user?.id, currentMonth],
    queryFn: async () => {
      const serviceIds = services.map((s: any) => s.id);
      if (serviceIds.length === 0) return [];
      const { data } = await supabase
        .from('service_completions')
        .select('*')
        .in('service_id', serviceIds)
        .eq('month', currentMonth);
      return data || [];
    },
    enabled: services.length > 0,
  });

  const clientMap = new Map<string, { name: string; services: any[] }>();
  services.forEach((s: any) => {
    const clientName = s.clients?.name || 'Sem cliente';
    const clientId = s.client_id;
    if (!clientMap.has(clientId)) {
      clientMap.set(clientId, { name: clientName, services: [] });
    }
    clientMap.get(clientId)!.services.push(s);
  });

  const completedServiceIds = new Set(completions.map((c: any) => c.service_id));

  const isServiceDone = (s: any) => {
    if (s.is_recurring) return completedServiceIds.has(s.id);
    return s.completed;
  };

  if (clientMap.size === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-brand-orange" />
        <h2 className="text-lg font-serif text-white">Meus Clientes</h2>
        <span className="text-[10px] font-mono text-white/30 ml-1">
          {format(new Date(), 'MMMM', { locale: ptBR })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from(clientMap.entries()).map(([clientId, { name, services: clientServices }]) => {
          const total = clientServices.length;
          const done = clientServices.filter(isServiceDone).length;
          const pending = total - done;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;
          const isExpanded = expandedClient === clientId;
          const groups = groupServices(clientServices);

          return (
            <div
              key={clientId}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'border-brand-orange/20 bg-white/[0.03] col-span-1 sm:col-span-2 lg:col-span-3'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] cursor-pointer'
              }`}
            >
              {/* Card header — always visible */}
              <div
                onClick={() => setExpandedClient(isExpanded ? null : clientId)}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white truncate">{name}</h3>
                  {isExpanded
                    ? <ChevronUp className="w-3.5 h-3.5 text-white/30 shrink-0" />
                    : <ChevronDown className="w-3.5 h-3.5 text-white/15 shrink-0" />
                  }
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/30">{progress}%</span>
                </div>

                {!isExpanded && (
                  <>
                    <div className="space-y-1.5">
                      {clientServices.slice(0, 4).map((s: any) => {
                        const isDone = isServiceDone(s);
                        return (
                          <div key={s.id} className="flex items-center gap-2">
                            {isDone
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              : <Circle className="w-3.5 h-3.5 text-white/20 shrink-0" />
                            }
                            <span className={`text-xs truncate ${isDone ? 'text-white/30 line-through' : 'text-white/60'}`}>
                              {s.service_name}
                            </span>
                          </div>
                        );
                      })}
                      {clientServices.length > 4 && (
                        <span className="text-[10px] font-mono text-white/20 pl-5">
                          +{clientServices.length - 4} serviços
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-emerald-400/70">{done} feitos</span>
                      <span className="text-[10px] font-mono text-white/20">•</span>
                      <span className="text-[10px] font-mono text-white/30">{pending} pendentes</span>
                    </div>
                  </>
                )}
              </div>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                      <p className="text-xl font-serif text-white">{total}</p>
                      <p className="text-[10px] font-mono text-white/30 uppercase">Total</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3 text-center">
                      <p className="text-xl font-serif text-emerald-400">{done}</p>
                      <p className="text-[10px] font-mono text-emerald-400/50 uppercase">Entregues</p>
                    </div>
                    <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.03] p-3 text-center">
                      <p className="text-xl font-serif text-orange-400">{pending}</p>
                      <p className="text-[10px] font-mono text-orange-400/50 uppercase">Pendentes</p>
                    </div>
                  </div>

                  {/* Grouped services detail */}
                  <div className="space-y-2">
                    {groups.map((group, gIdx) => {
                      const Icon = getServiceIcon(group.label);
                      const groupDone = group.items.filter(isServiceDone).length;
                      const groupTotal = group.items.length;

                      return (
                        <div key={gIdx} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                          <div className="flex items-center gap-2.5 mb-2">
                            <Icon className="w-4 h-4 text-brand-orange/70 shrink-0" />
                            <span className="text-sm text-white/80 font-medium flex-1">{group.label}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              groupDone === groupTotal
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-white/5 text-white/30 border border-white/10'
                            }`}>
                              {groupDone}/{groupTotal}
                            </span>
                          </div>

                          {group.isGroup && (
                            <div className="space-y-1 pl-6">
                              {group.items.map((s: any) => {
                                const isDone = isServiceDone(s);
                                return (
                                  <div key={s.id} className="flex items-center gap-2">
                                    {isDone
                                      ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                      : <Circle className="w-3 h-3 text-white/15 shrink-0" />
                                    }
                                    <span className={`text-[11px] ${isDone ? 'text-white/25 line-through' : 'text-white/50'}`}>
                                      {s.service_name}
                                    </span>
                                    {s.due_date && (
                                      <span className="text-[9px] font-mono text-white/20 ml-auto">
                                        {format(new Date(s.due_date), 'dd/MM')}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {!group.isGroup && group.items[0]?.notes && (
                            <p className="text-[10px] text-white/25 pl-6 mt-1">{group.items[0].notes}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
