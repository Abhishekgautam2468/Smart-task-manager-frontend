'use client'

import React, { useMemo, useState } from 'react'
import {
  LuArrowUpRight,
  LuCircleCheck,
  LuRefreshCcw,
  LuSparkles,
  LuWandSparkles,
} from 'react-icons/lu'

const priorityClass = priority => {
  if (priority === 'high') return 'bg-red-100 text-red-700'
  if (priority === 'low') return 'bg-cyan-100 text-cyan-700'
  return 'bg-yellow-100 text-yellow-800'
}

const statusLabel = status => {
  if (status === 'in-progress') return 'In progress'
  if (status === 'done') return 'Done'
  return 'Todo'
}

const SmartPanel = ({
  tasks,
  aiPlan,
  aiError,
  isAnalyzing,
  isApplying,
  onAnalyze,
  onApply,
}) => {
  const [confirmingApply, setConfirmingApply] = useState(false)

  const tasksById = useMemo(() => {
    return new Map((tasks || []).map(task => [task._id, task]))
  }, [tasks])

  const recommendations = aiPlan?.recommendations || []
  const canApply = recommendations.length > 0 && !isApplying && !isAnalyzing

  const applyPlan = async () => {
    try {
      await onApply(recommendations)
      setConfirmingApply(false)
    } catch {
      // Redux keeps the visible error state.
    }
  }

  const topScore = recommendations[0]?.urgencyScore || 0

  return (
    <section className="flex-1 overflow-auto bg-[#fbfcfe] px-5 py-5 md:px-7">
      <div className="rounded-3xl bg-gray-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                <LuWandSparkles className="h-5 w-5 text-yellow-300" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                  AI workspace
                </p>
                <h2 className="mt-1 text-2xl font-black">Smart Plan</h2>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70">
              {aiPlan?.summary ||
                'Analyze your tasks to get an AI-ranked plan for what deserves attention first.'}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing || isApplying}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-bold text-white hover:bg-white/15 active:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuRefreshCcw
                className={['h-4 w-4', isAnalyzing ? 'animate-spin' : ''].join(' ')}
              />
              {isAnalyzing ? 'Analyzing' : 'Analyze'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingApply(true)}
              disabled={!canApply}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-yellow-300 px-4 text-sm font-black text-gray-950 hover:bg-yellow-200 active:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuCircleCheck className="h-4 w-4" />
              {isApplying ? 'Applying' : 'Apply plan'}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/45">
              Recommendations
            </p>
            <p className="mt-2 text-2xl font-black">{recommendations.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/45">
              Highest urgency
            </p>
            <p className="mt-2 text-2xl font-black">{topScore}/100</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/45">
              Review mode
            </p>
            <p className="mt-2 text-sm font-bold text-white">Confirm before apply</p>
          </div>
        </div>
      </div>

      {aiError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {aiError}
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[760px] space-y-3">
            {recommendations.map(rec => {
              const task = tasksById.get(rec.taskId)
              return (
                <div
                  key={rec.taskId}
                  className="grid grid-cols-[64px_1fr_104px_118px_142px] items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 text-sm shadow-sm transition hover:border-gray-200 hover:shadow-[0_16px_34px_rgba(15,23,42,0.07)]"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gray-950 text-sm font-black text-white">
                    #{rec.rank}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {task?.title || 'Unknown task'}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                      {rec.reason}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-black text-gray-800">
                      <LuArrowUpRight className="h-3.5 w-3.5" />
                      {rec.urgencyScore}/100
                    </span>
                  </div>
                  <div>
                    <span
                      className={[
                        'rounded-md px-2 py-1 text-xs font-semibold capitalize',
                        priorityClass(rec.suggestedPriority),
                      ].join(' ')}
                    >
                      {rec.suggestedPriority}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-gray-700">
                    {statusLabel(rec.suggestedStatus)}
                    {rec.suggestedStickyWall ? (
                      <span className="ml-2 rounded-full bg-yellow-100 px-2 py-1 text-yellow-700">Sticky</span>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mt-5 flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 text-center shadow-sm">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-yellow-100 text-yellow-700">
            <LuSparkles className="h-7 w-7" />
          </span>
          <p className="mt-4 text-base font-semibold text-gray-900">
            No smart plan yet
          </p>
          <p className="mt-2 max-w-md text-sm text-gray-600">
            Run an analysis to get a ranked plan with suggested priority and
            status updates.
          </p>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing || isApplying}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-bold text-white hover:bg-gray-800 active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuRefreshCcw
              className={['h-4 w-4', isAnalyzing ? 'animate-spin' : ''].join(' ')}
            />
            {isAnalyzing ? 'Analyzing' : 'Analyze tasks'}
          </button>
        </div>
      )}

      {confirmingApply && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-800">
            Apply AI priority, status, and sticky-wall updates to{' '}
            {recommendations.length} task{recommendations.length === 1 ? '' : 's'}?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmingApply(false)}
              disabled={isApplying}
              className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyPlan}
              disabled={isApplying}
              className="rounded-xl bg-gray-950 px-3 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {isApplying ? 'Applying' : 'Confirm apply'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default SmartPanel
