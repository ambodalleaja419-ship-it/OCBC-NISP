import { createClient } from '@supabase/supabase-js';

// KONFIGURASI SUPABASE
// Gunakan environment variables untuk keamanan dan kemudahan deployment.
const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

// Check if configured
const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_URL !== '' && 
  SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co' && 
  !SUPABASE_URL.includes('YOUR_PROJECT_ID');

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : createMockClient();

// --- MOCK CLIENT IMPLEMENTATION (For Demo/Dev without DB) ---
function createMockClient() {
  console.warn("⚠️ Supabase not configured. Using Mock Client (LocalStorage). Data will not sync across devices.");
  
  const getTable = (table: string) => JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
  const setTable = (table: string, data: any[]) => localStorage.setItem(`mock_${table}`, JSON.stringify(data));
  const getSession = () => JSON.parse(localStorage.getItem('mock_session') || 'null');
  const setSession = (session: any) => localStorage.setItem('mock_session', JSON.stringify(session));

  // --- SEED DEFAULT ACCOUNTS ---
  // This ensures the user can login immediately in demo mode.
  const seedAccounts = () => {
    try {
      const users = getTable('users');
      const profiles = getTable('profiles');
      
      // 1. SEED ADMINS
      const admins = [
        { email: 'admin@admin.com', password: 'admin123', name: 'Super Admin', username: 'admin' },
        { email: 'dalleloppo257@gmail.com', password: 'Admin257', name: 'Admin Panel', username: 'admin257' }
      ];

      admins.forEach(admin => {
        if (!users.find((u: any) => u.email.toLowerCase() === admin.email.toLowerCase())) {
            console.log(`Creating Admin account: ${admin.email} / ${admin.password}`);
            const adminId = crypto.randomUUID();
            const newAdminUser = { id: adminId, email: admin.email, password: admin.password };
            
            const currentUsers = getTable('users');
            setTable('users', [...currentUsers, newAdminUser]);

            const newAdminProfile = {
                id: adminId,
                email: admin.email,
                full_name: admin.name,
                username: admin.username,
                phone_number: '08123456789',
                is_admin: true,
                is_verified: true,
                balance: 9999999999,
                profile_picture_url: null
            };
            const currentProfiles = getTable('profiles');
            setTable('profiles', [...currentProfiles, newAdminProfile]);
        }
      });

      // 2. SEED DEMO USER
      const demoEmail = 'user@demo.com';
      const currentUsersAfterAdmin = getTable('users');
      if (!currentUsersAfterAdmin.find((u: any) => u.email.toLowerCase() === demoEmail.toLowerCase())) {
          console.log("Creating default Demo User account: user@demo.com / user123");
          const demoId = 'demo-user-id';
          const newDemoUser = { id: demoId, email: demoEmail, password: 'user123' };
          
          const currentUsers = getTable('users');
          setTable('users', [...currentUsers, newDemoUser]);

          const newDemoProfile = {
              id: demoId,
              email: demoEmail,
              full_name: 'Demo User',
              username: 'demouser',
              phone_number: '08987654321',
              is_admin: false,
              is_verified: true,
              balance: 25000000,
              profile_picture_url: null
          };
          const currentProfiles = getTable('profiles');
          setTable('profiles', [...currentProfiles, newDemoProfile]);
      }
    } catch (e) {
      console.error("Error seeding mock accounts:", e);
    }
  };

  // Run seed
  seedAccounts();

  return {
    auth: {
      signUp: async ({ email, password }: any) => {
        const users = getTable('users');
        if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          return { data: { user: null, session: null }, error: { message: 'User already exists' } };
        }
        const newUser = { id: crypto.randomUUID(), email, password };
        setTable('users', [...users, newUser]);
        
        const session = { user: newUser, access_token: 'mock_token' };
        setSession(session);
        return { data: { user: newUser, session }, error: null };
      },
      signInWithPassword: async ({ email, password }: any) => {
        const users = getTable('users');
        const user = users.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
        );
        
        if (!user) {
          return { 
            data: { user: null, session: null }, 
            error: { message: 'Invalid credentials. Please check your email and password.' } 
          };
        }
        
        const session = { user, access_token: 'mock_token' };
        setSession(session);
        return { data: { user, session }, error: null };
      },
      signOut: async () => {
        setSession(null);
        return { error: null };
      },
      getSession: async () => {
        const session = getSession();
        return { data: { session }, error: null };
      }
    },
    from: (table: string) => {
      // Mock Query Builder
      const builder: any = {
        _table: table,
        _op: 'SELECT',
        _filters: [] as any[],
        _updates: null,
        _insertData: null,
        _sort: null,

        select: (columns: string = '*') => builder,
        
        insert: (rows: any[]) => {
          builder._op = 'INSERT';
          builder._insertData = rows;
          return builder;
        },
        
        update: (updates: any) => {
          builder._op = 'UPDATE';
          builder._updates = updates;
          return builder;
        },
        
        delete: () => {
          builder._op = 'DELETE';
          return builder;
        },
        
        eq: (col: string, val: any) => {
          builder._filters.push({ col, val, type: 'eq' });
          return builder;
        },

        neq: (col: string, val: any) => {
          builder._filters.push({ col, val, type: 'neq' });
          return builder;
        },
        
        order: (col: string, { ascending = true }: any = {}) => {
            builder._sort = { col, ascending };
            return builder;
        },
        
        single: async () => {
          const result = await builder._execute();
          return { data: result.data ? result.data[0] : null, error: (!result.data || result.data.length === 0) ? { message: 'No rows' } : null };
        },

        // Allow awaiting the builder directly
        then: (resolve: any, reject: any) => {
           builder._execute().then(resolve).catch(reject);
        },

        _execute: async () => {
            let data = getTable(table);
            
            // 1. Handle INSERT first
            if (builder._op === 'INSERT') {
                const newRows = builder._insertData.map((r: any) => ({ ...r, id: r.id || crypto.randomUUID() }));
                data = [...data, ...newRows];
                setTable(table, data);
                return { data: newRows, error: null };
            }

            // 2. Apply Filters
            let filtered = [...data];
            for (const f of builder._filters) {
                if (f.type === 'eq') filtered = filtered.filter((r: any) => r[f.col] === f.val);
                if (f.type === 'neq') filtered = filtered.filter((r: any) => r[f.col] !== f.val);
            }

            // 3. Handle Operations
            if (builder._op === 'SELECT') {
                if (builder._sort) {
                    filtered.sort((a: any, b: any) => {
                        if (a[builder._sort.col] < b[builder._sort.col]) return builder._sort.ascending ? -1 : 1;
                        if (a[builder._sort.col] > b[builder._sort.col]) return builder._sort.ascending ? 1 : -1;
                        return 0;
                    });
                }
                return { data: filtered, error: null };
            }

            if (builder._op === 'UPDATE') {
                const idsToUpdate = new Set(filtered.map((r: any) => r.id));
                const newData = data.map((r: any) => {
                    if (idsToUpdate.has(r.id)) return { ...r, ...builder._updates };
                    return r;
                });
                setTable(table, newData);
                return { data: null, error: null };
            }

            if (builder._op === 'DELETE') {
                const idsToDelete = new Set(filtered.map((r: any) => r.id));
                const newData = data.filter((r: any) => !idsToDelete.has(r.id));
                setTable(table, newData);
                return { data: null, error: null };
            }
            
            return { data: [], error: null };
        }
      };
      return builder;
    }
  } as any;
}