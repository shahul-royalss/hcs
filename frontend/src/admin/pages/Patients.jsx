import { useCallback, useEffect, useState } from 'react'
import { Eye, RefreshCw, StickyNote } from 'lucide-react'
import Seo from '@/components/common/Seo'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { adminService } from '@/services/adminService'
import { apiErrorMessage } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { formatDate, formatDateTime, titleCase, truncate } from '@/utils/formatters'

const asList = (data, ...keys) => {
  if (Array.isArray(data)) return data
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}

const idOf = (patient) => patient?.id || patient?._id

const emergencyContact = (patient) => {
  const contact = patient?.emergency_contact
  if (!contact) return '—'
  if (typeof contact === 'string') return contact
  return [contact?.name, contact?.phone].filter(Boolean).join(' · ') || '—'
}

const conditionOf = (patient) => patient?.medical_condition || patient?.condition || ''

function PatientDetailDialog({ patient, onClose, onChanged }) {
  const { toast } = useToast()
  const [record, setRecord] = useState(patient)
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const notes = [record?.care_notes, record?.notes].find(Array.isArray) || []

  const addNote = async () => {
    const note = noteText.trim()
    if (!note || savingNote) return
    setSavingNote(true)
    try {
      await adminService.addPatientNote(idOf(record), note)
      toast.success('Care note added')
      setNoteText('')
      try {
        const fresh = await adminService.getPatient(idOf(record))
        setRecord(fresh?.patient || fresh)
      } catch {
        // Refresh failed — show the note optimistically.
        setRecord((prev) => ({
          ...prev,
          care_notes: [...([prev?.care_notes, prev?.notes].find(Array.isArray) || []), { note, created_at: new Date().toISOString() }],
        }))
      }
      onChanged()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not add note.'))
    } finally {
      setSavingNote(false)
    }
  }

  return (
    <Dialog open onClose={onClose} title="Patient record" className="max-w-xl">
      <div className="mb-4 rounded-xl bg-surface p-4">
        <p className="font-heading text-lg font-bold text-ink">{record?.name || '—'}</p>
        <div className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <p>
            <span className="text-ink-light">Age / Gender: </span>
            <span className="font-medium text-ink">
              {record?.age ?? '—'} / {titleCase(record?.gender) || '—'}
            </span>
          </p>
          <p>
            <span className="text-ink-light">Emergency: </span>
            <span className="font-medium text-ink">{emergencyContact(record)}</span>
          </p>
          <p className="sm:col-span-2">
            <span className="text-ink-light">Condition: </span>
            <span className="font-medium text-ink">{conditionOf(record) || '—'}</span>
          </p>
          {record?.address && (
            <p className="sm:col-span-2">
              <span className="text-ink-light">Address: </span>
              <span className="font-medium text-ink">{record.address}</span>
            </p>
          )}
          <p className="sm:col-span-2">
            <span className="text-ink-light">Created: </span>
            <span className="font-medium text-ink">{formatDate(record?.created_at || record?.createdAt)}</span>
          </p>
        </div>
      </div>

      <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-light">
        <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
        Care notes
      </h4>
      {notes.length === 0 ? (
        <p className="mb-4 text-sm text-ink-light">No care notes yet.</p>
      ) : (
        <ul className="mb-4 space-y-3 border-l-2 border-primary-100 pl-4">
          {notes.map((note, index) => {
            const text = typeof note === 'string' ? note : note?.note || note?.text || '—'
            const when = typeof note === 'object' ? note?.created_at || note?.createdAt || note?.date : null
            const author = typeof note === 'object' ? note?.added_by || note?.by : null
            return (
              <li key={index} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-secondary"
                />
                <p className="whitespace-pre-wrap text-sm text-ink">{text}</p>
                <p className="mt-0.5 text-xs text-ink-light">
                  {when ? formatDateTime(when) : '—'}
                  {author ? ` · ${author}` : ''}
                </p>
              </li>
            )
          })}
        </ul>
      )}

      <div>
        <Label htmlFor="patient-note">Add note</Label>
        <Textarea
          id="patient-note"
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="e.g. Blood pressure stable, follow-up visit scheduled…"
          className="min-h-[80px]"
        />
        <div className="mt-3 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={addNote} disabled={savingNote || !noteText.trim()}>
            {savingNote ? 'Saving…' : 'Add note'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

/** Patient records with care-note timeline. */
export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.listPatients()
      setPatients(asList(data, 'patients', 'items', 'results'))
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <>
      <Seo title="Admin — Patients" />
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Patients</h1>
        <p className="text-sm text-ink-light">Patient records and care-note history</p>
      </div>

      {loading ? (
        <Card className="space-y-3 p-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </Card>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="font-medium text-ink">Could not reach the server — is the backend running?</p>
          <p className="mt-1 text-sm text-ink-light">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          {patients.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-light">No records yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age / Gender</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Emergency contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient, index) => (
                  <TableRow key={idOf(patient) || index}>
                    <TableCell className="font-medium text-ink">{patient?.name || '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {patient?.age ?? '—'} / {titleCase(patient?.gender) || '—'}
                    </TableCell>
                    <TableCell>{truncate(conditionOf(patient), 60) || '—'}</TableCell>
                    <TableCell>{emergencyContact(patient)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(patient?.created_at || patient?.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(patient)}
                        aria-label={`View record of ${patient?.name || 'patient'}`}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {selected && (
        <PatientDetailDialog patient={selected} onClose={() => setSelected(null)} onChanged={load} />
      )}
    </>
  )
}
