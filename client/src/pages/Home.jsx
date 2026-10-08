import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import JobForm from '../components/JobForm';
import JobCard from '../components/JobCard';

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api('/jobs');
      setJobs(data.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (body) => {
    if (editing) await api(`/jobs/${editing._id}`, { method: 'PUT', body });
    else await api('/jobs', { method: 'POST', body });
    setEditing(null);
    await load();
  };

  const remove = async (job) => {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    try {
      await api(`/jobs/${job._id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      {user ? (
        <JobForm key={editing?._id || 'new'} initial={editing} onSubmit={save} onCancel={editing ? () => setEditing(null) : null} />
      ) : (
        <div className="alert success">
          <Link to="/login">Log in</Link> or <Link to="/signup">create an account</Link> to post, edit or delete jobs.
        </div>
      )}
      <h2>Open positions</h2>
      {error && <div className="alert error" role="alert">{error}</div>}
      {loading ? <p className="muted">Loading jobs...</p> : jobs.length === 0 ? (
        <div className="empty">No jobs yet. Log in and post the first one.</div>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} canModify={!!user} onEdit={setEditing} onDelete={remove} />
          ))}
        </div>
      )}
    </main>
  );
}
