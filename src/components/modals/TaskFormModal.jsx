'use client'

import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ModalShell from './ModalShell'

const TaskFormModal = ({
  mode,
  initialValues,
  submitError,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const isEdit = mode === 'edit'
  const [titleSnapshot, setTitleSnapshot] = useState(initialValues?.title ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      stickyWall: false,
      ...initialValues,
    },
  })

  const titleRegister = useMemo(
    () =>
      register('title', {
        required: 'Title is required',
        minLength: { value: 3, message: 'Title must be at least 3 characters' },
        maxLength: {
          value: 80,
          message: 'Title must be at most 80 characters',
        },
      }),
    [register]
  )

  const canSubmitTitle =
    typeof titleSnapshot === 'string' && titleSnapshot.trim().length >= 3
  const isSubmitDisabled =
    isSubmitting ||
    !canSubmitTitle ||
    Boolean(errors.title || errors.description || errors.dueDate) ||
    (isEdit && !isDirty)

  return (
    <ModalShell title={isEdit ? 'Edit Task' : 'Add Task'} onClose={onClose}>
      <form
        onSubmit={handleSubmit(values => onSubmit(values))}
        className="space-y-4"
      >
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            className={[
              'mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none text-gray-900 placeholder:text-gray-300',
              errors.title ? 'border-red-400' : 'border-gray-200',
              'focus:border-gray-400',
            ].join(' ')}
            placeholder="e.g. Renew driver’s license"
            {...titleRegister}
            onChange={e => {
              titleRegister.onChange(e)
              setTitleSnapshot(e.target.value)
            }}
          />
          {errors.title && (
            <p className="mt-2 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="mt-2 w-full min-h-[90px] resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 text-gray-900 placeholder:text-gray-300"
            placeholder="Add details..."
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description must be at most 500 characters',
              },
            })}
          />
          {errors.description && (
            <p className="mt-2 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due date
          </label>
          <input
            type="date"
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 text-gray-900"
            {...register('dueDate', {
              validate: value =>
                !value ||
                /^\d{4}-\d{2}-\d{2}$/.test(value) ||
                /^\d{2}\/\d{2}\/\d{4}$/.test(value) ||
                /^\d{2}-\d{2}-\d{4}$/.test(value) ||
                'Invalid date',
            })}
          />
          {errors.dueDate && (
            <p className="mt-2 text-xs text-red-500">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 text-gray-900"
            {...register('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-800 select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            {...register('stickyWall')}
          />
          Add to Sticky Wall
        </label>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-60"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 active:bg-yellow-200 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

export default TaskFormModal
