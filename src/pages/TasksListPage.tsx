import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { TaskDetailModal } from '@/components/dashboard/TaskDetailModal';

const STATUS_META: Record<string, { label: string; dot: string; color: string }> = {
  pending: { label: 'Pendente', dot: 'bg-orange-400', color: 'text-orange-400' },
  todo: { label: 'A Fazer', dot: 'bg-white/30', color: 'text-white/40' },
  in_progress: { label: 'Em Progresso', dot: 'bg-blue-400', color: 'text-blue-400' },
  review: { label: 'Em Revisão', dot: 'bg-yellow-400', color: 'text-yellow-400' },
  done: { label: 'Concluído', dot: 'bg-emerald-400', color: 'text-emerald-400' },
};

const WEEKDAY_LABELS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function TasksListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'todo';
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data: tasks = [] } = useQuery({
    queryKey: ['my-tasks', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user!.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  // Filter logic: "pending" = tasks without dates; others = by status
  const filteredTasks = statusFilter === 'pending'
    ? tasks.filter(t => !t.capture_date && !t.due_date && t.status === 'todo')
    : tasks.filter(t => t.status === statusFilter);

  const meta = STATUS_META[statusFilter] || STATUS_META.todo;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-white/30 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${meta.dot}`} />
          <h1 className="text-2xl font-serif text-white">{meta.label}</h1>
          <span className="text-white/20 text-sm font-mono ml-2">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa' : 'tarefas'}
          </span>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(STATUS_META).map(([key, m]) => (
          <button
            key={key}
            onClick={() => navigate(`/dashboard/tasks?status=${key}`, { replace: true })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border ${
              statusFilter === key
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/5 text-white/30 hover:text-white/50 hover:border-white/10'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
            {m.label}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/20 text-sm font-mono">Nenhuma tarefa nesta categoria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const isOverdue = task.due_date && new Date(task.due_date).getTime() < Date.now() && task.status !== 'done';
            const isUrgent = task.due_date && !isOverdue && (new Date(task.due_date).getTime() - Date.now()) < 48 * 60 * 60 * 1000;

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`group rounded-2xl border bg-white/[0.03] p-5 cursor-pointer hover:bg-white/[0.06] transition-all ${
                  isOverdue ? 'border-red-500/30' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        task.priority === 'high' ? 'border-red-500/30 text-red-400 bg-red-500/10'
                          : task.priority === 'medium' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10'
                          : 'border-white/10 text-white/30'
                      }`}>
                        {task.priority === 'high' ? 'ALTA' : task.priority === 'medium' ? 'MÉDIA' : 'BAIXA'}
                      </span>
                      {task.client_name && (
                        <span className="text-[10px] font-mono text-white/30 truncate">
                          {task.client_name}
                        </span>
                      )}
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-red-400">
                          <AlertTriangle className="w-3 h-3" /> ATRASADA
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium">{task.title}</p>
                    {task.description && (
                      <p className="text-white/30 text-xs mt-1 line-clamp-2">{task.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {task.due_date && (
                      <div className={`flex items-center gap-1.5 text-[10px] font-mono ${
                        isOverdue ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-white/30'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    {task.weekday != null && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400">
                        <Clock className="w-3 h-3" />
                        {WEEKDAY_LABELS[task.weekday] || `Dia ${task.weekday}`}
                      </div>
                    )}
                    {task.capture_date && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400">
                        <Calendar className="w-3 h-3" />
                        Captação: {new Date(task.capture_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    {task.price != null && task.price > 0 && (
                      <span className="text-[10px] font-mono text-emerald-400">
                        R$ {Number(task.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
