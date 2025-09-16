export function seedState() {
    const now = new Date().toISOString()
    const statuses = ["New","Qualified","Converted","Follow-Up","Unqualified"]
    const users = [
    { id: 'u_john', name: 'John Doe', active: true },
    { id: 'u_jane', name: 'Jane Smith', active: true },
    { id: 'u_emily', name: 'Emily Davis', active: true }
    ]
    const picklists = {
    statuses,
    qualifications: ["High School","Bachelors","Masters","PhD","Other"],
    sources: ["Website","Social Media","Cold Call","Email Campaign","Referral","Other"],
    interestFields: ["Web Development","Mobile Development","Data Science","Digital Marketing","UI/UX Design","Other"]
    }
    const sampleLeads = Array.from({ length: 12 }).map((_, i) => ({
    id: crypto.randomUUID(),
    name: ['Kari Legros','Bridget Hayes','Rickey Swift','Raul Kub','Ashley Ebert','Miss Norma Predovic'][i%6] + ' #' + (i+1),
    phone: `8${i}7-555-01${String(i).padStart(2,'0')}`,
    email: `lead${i}@example.com`,
    status: statuses[i % statuses.length],
    qualification: picklists.qualifications[i % picklists.qualifications.length],
    interestField: picklists.interestFields[i % picklists.interestFields.length],
    source: picklists.sources[i % picklists.sources.length],
    assignedTo: users[i % users.length].name,
    createdAt: now,
    updatedAt: now
    }))
    return {
    leads: sampleLeads,
    settings: { users, picklists },
    ui: { theme: 'light' },
    meta: { version: 1 }
    }
    }
    
    
    export function migrateIfNeeded(state) {
    // Placeholder for future schema migrations
    return state
    }