import React, { useState, useEffect } from 'react'
import {
  X, User, Phone, Mail, MapPin, Heart, Calendar,
  Users, Briefcase, Loader2, Check, AlertCircle
} from 'lucide-react'
import { peopleModel, type PersonData } from '../models/peopleModel'

interface PersonFormProps {
  isOpen: boolean
  onClose: () => void
  editData?: PersonData | null  // If provided, form is in edit mode
  onSuccess?: () => void
}

type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | ''
type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | ''

interface FormState {
  full_name: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  phone: string
  address_line: string
  locality_area: string
  blood_group: BloodGroup
  is_blood_donor: boolean
  last_donation_date: string
  is_volunteer: boolean
  skills: string[]
  marital_status: MaritalStatus
  children_count: number
}

const initialFormState: FormState = {
  full_name: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  phone: '',
  address_line: '',
  locality_area: '',
  blood_group: '',
  is_blood_donor: false,
  last_donation_date: '',
  is_volunteer: false,
  skills: [],
  marital_status: '',
  children_count: 0,
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const MARITAL_STATUSES: { value: MaritalStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
]
const COMMON_SKILLS = ['First Aid', 'Driving', 'Cooking', 'Teaching', 'Medical', 'Administration', 'IT Support']

export function PersonForm({ isOpen, onClose, editData, onSuccess }: PersonFormProps) {
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skillInput, setSkillInput] = useState('')

  const isEditMode = !!editData?.id

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        full_name: editData.full_name || '',
        first_name: editData.first_name || '',
        middle_name: editData.middle_name || '',
        last_name: editData.last_name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        address_line: editData.address_line || '',
        locality_area: editData.locality_area || '',
        blood_group: (editData.blood_group as BloodGroup) || '',
        is_blood_donor: editData.is_blood_donor || false,
        last_donation_date: editData.last_donation_date || '',
        is_volunteer: editData.is_volunteer || false,
        skills: editData.skills || [],
        marital_status: (editData.marital_status as MaritalStatus) || '',
        children_count: editData.children_count || 0,
      })
    } else {
      setFormData(initialFormState)
    }
    setError(null)
  }, [editData, isOpen])

  // Auto-generate full_name from parts
  useEffect(() => {
    const parts = [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean)
    if (parts.length > 0) {
      setFormData(prev => ({ ...prev, full_name: parts.join(' ') }))
    }
  }, [formData.first_name, formData.middle_name, formData.last_name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required')
      }

      const payload: Partial<PersonData> = {
        full_name: formData.full_name.trim(),
        first_name: formData.first_name.trim() || undefined,
        middle_name: formData.middle_name.trim() || undefined,
        last_name: formData.last_name.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        address_line: formData.address_line.trim() || undefined,
        locality_area: formData.locality_area.trim() || undefined,
        blood_group: formData.blood_group || undefined,
        is_blood_donor: formData.is_blood_donor,
        last_donation_date: formData.last_donation_date || undefined,
        is_volunteer: formData.is_volunteer,
        skills: formData.skills.length > 0 ? formData.skills : undefined,
        marital_status: formData.marital_status || undefined,
        children_count: formData.children_count > 0 ? formData.children_count : undefined,
      }

      if (isEditMode && editData?.id) {
        await peopleModel.updateProfile(editData.id, payload)
      } else {
        await peopleModel.createPerson(payload as PersonData)
      }

      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }))
    }
    setSkillInput('')
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 ease-out border border-slate-200 dark:border-neutral-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-900/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditMode ? 'Edit Person' : 'Add Person'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditMode ? 'Update person details' : 'Register a new community member'}
              <span className="ml-2 text-rose-500">*</span>
              <span className="text-slate-400"> = Required</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Section: Basic Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Personal Information
            </h3>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="First Name"
                icon={<User className="w-4 h-4" />}
                placeholder="John"
                value={formData.first_name}
                onChange={(v) => updateField('first_name', v)}
              />
              <InputField
                label="Middle Name"
                placeholder="M."
                value={formData.middle_name}
                onChange={(v) => updateField('middle_name', v)}
              />
              <InputField
                label="Last Name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(v) => updateField('last_name', v)}
              />
            </div>

            {/* Full Name (auto-generated but editable) */}
            <InputField
              label="Full Name"
              required
              placeholder="Full display name"
              value={formData.full_name}
              onChange={(v) => updateField('full_name', v)}
              hint="Auto-generated from name parts, but you can edit it"
            />
          </section>

          {/* Section: Contact */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Email"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(v) => updateField('email', v)}
              />
              <InputField
                label="Phone"
                type="tel"
                icon={<Phone className="w-4 h-4" />}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(v) => updateField('phone', v)}
              />
            </div>
          </section>

          {/* Section: Address */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Address Line"
                icon={<MapPin className="w-4 h-4" />}
                placeholder="123 Main Street"
                value={formData.address_line}
                onChange={(v) => updateField('address_line', v)}
              />
              <InputField
                label="Locality / Area"
                placeholder="Suburb, City"
                value={formData.locality_area}
                onChange={(v) => updateField('locality_area', v)}
              />
            </div>
          </section>

          {/* Section: Blood Donation */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" /> Blood Donation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Blood Group */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Blood Group
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  value={formData.blood_group}
                  onChange={(e) => updateField('blood_group', e.target.value as BloodGroup)}
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Is Blood Donor Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Blood Donor?
                </label>
                <ToggleButton
                  value={formData.is_blood_donor}
                  onChange={(v) => updateField('is_blood_donor', v)}
                  labels={['No', 'Yes']}
                />
              </div>

              {/* Last Donation Date */}
              <InputField
                label="Last Donation"
                type="date"
                icon={<Calendar className="w-4 h-4" />}
                value={formData.last_donation_date}
                onChange={(v) => updateField('last_donation_date', v)}
              />
            </div>
          </section>

          {/* Section: Volunteer */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Volunteer Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Available as Volunteer?
                </label>
                <ToggleButton
                  value={formData.is_volunteer}
                  onChange={(v) => updateField('is_volunteer', v)}
                  labels={['No', 'Yes']}
                />
              </div>
            </div>

            {/* Skills (shown only if volunteer) */}
            {formData.is_volunteer && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Skills
                </label>

                {/* Quick add chips */}
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.filter(s => !formData.skills.includes(s)).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>

                {/* Custom skill input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Add custom skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(skillInput)}
                    className="px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Add
                  </button>
                </div>

                {/* Selected skills */}
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-medium rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-rose-900 dark:hover:text-rose-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Section: Family */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Family Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Marital Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Marital Status
                </label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  value={formData.marital_status}
                  onChange={(e) => updateField('marital_status', e.target.value as MaritalStatus)}
                >
                  <option value="">Select</option>
                  {MARITAL_STATUSES.map(ms => (
                    <option key={ms.value} value={ms.value}>{ms.label}</option>
                  ))}
                </select>
              </div>

              {/* Children Count */}
              <InputField
                label="Number of Children"
                type="number"
                placeholder="0"
                value={formData.children_count.toString()}
                onChange={(v) => updateField('children_count', parseInt(v) || 0)}
              />
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-neutral-900/50 border-t border-slate-100 dark:border-neutral-800 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] px-4 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditMode ? 'Saving...' : 'Adding...'}
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {isEditMode ? 'Save Changes' : 'Add Person'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Reusable Input Field Component
interface InputFieldProps {
  label: string
  required?: boolean
  type?: string
  icon?: React.ReactNode
  placeholder?: string
  value: string
  onChange: (value: string) => void
  hint?: string
}

function InputField({ label, required, type = 'text', icon, placeholder, value, onChange, hint }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          required={required}
          className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 transition-all placeholder:text-slate-400`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {hint && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  )
}

// Toggle Button Component
interface ToggleButtonProps {
  value: boolean
  onChange: (value: boolean) => void
  labels: [string, string]
}

function ToggleButton({ value, onChange, labels }: ToggleButtonProps) {
  return (
    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-neutral-800 rounded-lg">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`py-2 text-sm font-medium rounded-md transition-all ${!value
          ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`py-2 text-sm font-medium rounded-md transition-all ${value
          ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-white shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
      >
        {labels[1]}
      </button>
    </div>
  )
}