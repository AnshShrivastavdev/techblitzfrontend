import { db, auth } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { User, upsertUser, deleteUserById, getAllUsers, exportToCSV } from '@/services/storageService';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://techblitzfrontend.onrender.com/api';

/**
 * Saves a student's real-time profile to:
 * 1. Firebase Firestore ('students' collection)
 * 2. MongoDB backend API (POST /students/sync)
 * 3. LocalStorage cache (upsertUser)
 */
export async function syncStudentToCloud(userData: Partial<User>): Promise<void> {
  if (!userData.email) return;

  const studentRecord: User = {
    id: userData.id || 'std_' + Math.random().toString(36).slice(2, 9),
    name: userData.name || userData.email.split('@')[0],
    email: userData.email.toLowerCase().trim(),
    role: userData.role === 'admin' ? 'admin' : 'student',
    college: userData.college || 'Jabalpur Engineering College',
    branch: userData.branch || 'CSE',
    semester: userData.semester || '',
    rollNumber: userData.rollNumber || '',
    phone: userData.phone || '',
    createdAt: userData.createdAt || new Date().toISOString(),
  };

  // 1. Save locally
  upsertUser(studentRecord);

  // 2. Save to Firebase Firestore
  try {
    const studentRef = doc(db, 'students', studentRecord.id);
    await setDoc(
      studentRef,
      {
        ...studentRecord,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[RealtimeSync] Firestore save notice:', err);
  }

  // 3. Save to MongoDB backend
  try {
    fetch(`${API_BASE}/students/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentRecord),
    }).catch((e) => console.warn('[RealtimeSync] MongoDB sync notice:', e));
  } catch {
    // Ignore offline errors
  }
}

/**
 * Subscribes to real-time student updates from Firebase Firestore & MongoDB.
 * Ensures zero dummy data or flashing mocks.
 */
export function subscribeToRealtimeStudents(
  onUpdate: (students: User[]) => void
): () => void {
  const studentMap = new Map<string, User>();

  const emitMerged = () => {
    // Merge any existing local students
    const local = getAllUsers().filter((u) => u.role !== 'admin');
    local.forEach((u) => {
      const key = u.email.toLowerCase().trim();
      if (!studentMap.has(key)) {
        studentMap.set(key, u);
      }
    });

    const result = Array.from(studentMap.values())
      .filter((u) => u.role !== 'admin' && !u.email.includes('@university.edu') && !u.email.includes('@college.edu'))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    onUpdate(result);
  };

  // 1. Firebase Firestore Real-Time listener
  let unsubscribeFirestore = () => {};
  try {
    const studentsCol = collection(db, 'students');
    unsubscribeFirestore = onSnapshot(
      studentsCol,
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data && data.email && data.role !== 'admin') {
            studentMap.set(data.email.toLowerCase().trim(), {
              id: docSnap.id,
              name: data.name || 'Participant',
              email: data.email,
              role: data.role || 'student',
              college: data.college || data.institution || 'Jabalpur Engineering College',
              branch: data.branch || '',
              semester: data.semester || '',
              rollNumber: data.rollNumber || data.collegeRoll || '',
              phone: data.phone || '',
              createdAt: data.createdAt || new Date().toISOString(),
            });
          }
        });
        emitMerged();
      },
      (err) => {
        console.warn('[RealtimeSync] Firestore listener fallback:', err);
        emitMerged();
      }
    );
  } catch (err) {
    console.warn('[RealtimeSync] Firestore snapshot attachment:', err);
    emitMerged();
  }

  // 2. Fetch from MongoDB backend
  const fetchMongoDB = async () => {
    try {
      let token = '';
      if (auth.currentUser) {
        try {
          token = await auth.currentUser.getIdToken();
        } catch {
          // Token unavailable
        }
      }
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_BASE}/admin/users`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          json.data.forEach((u: any) => {
            if (u.email && u.role !== 'admin') {
              const key = u.email.toLowerCase().trim();
              const existing = studentMap.get(key);
              studentMap.set(key, {
                id: u._id || u.id || existing?.id || key,
                name: u.name || existing?.name || 'Participant',
                email: u.email,
                role: u.role || 'student',
                college: u.institution || u.college || existing?.college || 'Jabalpur Engineering College',
                branch: u.branch || existing?.branch || '',
                semester: u.semester || existing?.semester || '',
                rollNumber: u.collegeRoll || u.rollNumber || existing?.rollNumber || '',
                phone: u.phone || existing?.phone || '',
                createdAt: u.createdAt || existing?.createdAt || new Date().toISOString(),
              });
            }
          });
          emitMerged();
        }
      }
    } catch (e) {
      console.warn('[RealtimeSync] MongoDB fetch notice:', e);
    }
  };

  fetchMongoDB();
  emitMerged();

  return () => {
    unsubscribeFirestore();
  };
}

/**
 * Permanently removes a student in real-time from:
 * 1. Firebase Firestore ('students' collection)
 * 2. MongoDB backend API (DELETE /admin/users/:id)
 * 3. LocalStorage
 */
export async function removeStudentFromCloud(studentId: string, studentEmail?: string): Promise<boolean> {
  // 1. Remove from local storage
  deleteUserById(studentId, studentEmail);

  // 2. Remove from Firebase Firestore
  try {
    const studentRef = doc(db, 'students', studentId);
    await deleteDoc(studentRef);
  } catch (err) {
    console.warn('[RealtimeSync] Firestore delete notice:', err);
  }

  // 3. Remove from MongoDB backend
  try {
    let token = '';
    if (auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
      } catch {}
    }
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`${API_BASE}/admin/users/${encodeURIComponent(studentId)}`, {
      method: 'DELETE',
      headers,
    }).catch(() => {});
  } catch (err) {
    console.warn('[RealtimeSync] MongoDB delete notice:', err);
  }

  return true;
}

/**
 * Exports current real-time students list to CSV with exact required fields:
 * Name, Email ID, Branch, College, Semester, Roll Number, Phone, Registration Date
 */
export function exportLiveStudentsCSV(students: User[]): boolean {
  if (!students || students.length === 0) {
    if (typeof window !== 'undefined') {
      alert('No real-time student records available to export.');
    }
    return false;
  }
  const formattedUsers = students.map((u, idx) => ({
    'S.No': idx + 1,
    'Participant Name': u.name || 'Participant',
    'Email Address': u.email || '',
    'College / Institution': u.college || u.institution || 'Jabalpur Engineering College',
    'Branch': u.branch || 'CSE',
    'Semester': u.semester || 'N/A',
    'Roll Number / College ID': u.rollNumber || 'N/A',
    'Phone': u.phone || 'N/A',
    'Registration Date': u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : 'N/A',
  }));
  exportToCSV(formattedUsers, `TechBlitz_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
  return true;
}
