export function formatDateForInput(date?: string | null) {
	if (!date) return ''
	const d = new Date(date)
	if (Number.isNaN(d.getTime())) return ''
	// YYYY-MM-DD for input[type=date]
	const yyyy = d.getFullYear()
	const mm = String(d.getMonth() + 1).padStart(2, '0')
	const dd = String(d.getDate()).padStart(2, '0')
	return `${yyyy}-${mm}-${dd}`
}

export function formatDateForDisplay(date?: string | null) {
	if (!date) return ''
	// try to accept both ISO and YYYY-MM-DD
	const d = new Date(date)
	if (Number.isNaN(d.getTime())) return date
	return d.toISOString().split('T')[0]
}

export default { formatDateForInput, formatDateForDisplay }
