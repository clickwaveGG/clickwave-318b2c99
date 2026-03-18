import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_profile?: { full_name: string } | null;
  client_name?: string | null;
}

interface Props {
  tasks: Task[];
}

export default function AdminTasksDeadlineList({ tasks }: Props) {
  const now = new Date();

  const isOverdue = (t: Task) => t.due_date && new Date(t.due_date) < now && t.status !== 'done';
  const isDone = (t: Task) => t.status === 'done';

  const sorted = [...tasks].sort((a, b) => {
    const aOver = isOverdue(a);
    const bOver = isOverdue(b);
    if (aOver && !bOver) return -1;
    if (!aOver && bOver) return 1;
    if (a.due_date && b.due_date) return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    if (a.due_date) return -1;
    return 1;
  });

  const statusLabel = (s: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      done: { label: 'CONCLUÍDO', cls: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
      in_progress: { label: 'EM PROGRESSO', cls: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
      review: { label: 'EM REVISÃO', cls: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' },
      todo: { label: 'A FAZER', cls: 'border-white/10 text-white/30' },
    };
    return map[s] || map.todo;
  };

  const priorityLabel = (p: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      high: { label: 'ALTA', cls: 'border-red-500/30 text-red-400 bg-red-500/10' },
      medium: { label: 'MÉDIA', cls: 'border-orange-500/30 text-orange-400 bg-orange-500/10' },
      low: { label: 'BAIXA', cls: 'border-white/10 text-white/30' },
    };
    return map[p] || map.medium;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Tarefa</th>
            <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Atribuído</th>
            <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Status</th>
            <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Prioridade</th>
            <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Prazo</th>
            <th className="text-left text-[10px] font-mono uppercase tracking-widest text-white/30 p-4">Situação</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan={6} className="p-8 text-center text-white/20 text-sm font-mono">Nenhuma tarefa encontrada</td></tr>
          ) : sorted.map((t) => {
            const overdue = isOverdue(t);
            const done = isDone(t);
            const st = statusLabel(t.status);
            const pr = priorityLabel(t.priority);

            return (
              <tr key={t.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${overdue ? 'bg-red-500/[0.03]' : ''}`}>
                <td className="p-4">
                  <p className="text-sm text-white">{t.title}</p>
                  {t.client_name && <span className="text-[9px] font-mono text-white/20">{t.client_name}</span>}
                </td>
                <td className="p-4 text-sm text-white/40">{t.assigned_profile?.full_name || '—'}</td>
                <td className="p-4">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${st.cls}`}>{st.label}</span>
                </td>
                <td className="p-4">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${pr.cls}`}>{pr.label}</span>
                </td>
                <td className="p-4 text-xs font-mono text-white/30">
                  {t.due_date ? new Date(t.due_date).toLocaleDateString('pt-BR') : '—'}
                </td>
                <td className="p-4">
                  {done ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> No prazo
                    </span>
                  ) : overdue ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5" /> Atrasado
                    </span>
                  ) : t.due_date ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-white/30">
                      <Clock className="w-3.5 h-3.5" /> Pendente
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-white/15">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
