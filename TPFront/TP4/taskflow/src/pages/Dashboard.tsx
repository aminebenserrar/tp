import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/authContext';
import api from '../api/axios';
import HeaderMUI from '../components/HeaderMUI';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';
import axios from 'axios';

interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function Dashboard() {
    const { state: authState, dispatch } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
  
//temporary {
    //Dans Dashboard, ajoutez ce test temporaire : 
      //❌NE FAITES JAMAIS ÇA avec des données utilisateur : 
<div dangerouslySetInnerHTML={{ __html: dangerousName }} />
const dangerousName = '<img src=x onerror=alert("HACK")>'; 
  
// Affichez-le dans le JSX : 
<p>{dangerousName}</p> 
//}
    // GET — charger les données au montage 
    useEffect(() => {
        async function fetchData() {
            try {
                const [projRes, colRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/columns'),
                ]);
                setProjects(projRes.data);
                setColumns(colRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        fetchData();
    }, []);

    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function addProject(name: string, color: string) {
        setSaving(true);
        setError(null);
        try {
            const { data } = await api.post('/projects', { name, color });
            setProjects(prev => [...prev, data]);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
            } else {
                setError('Erreur inconnue');
            }
        } finally {
            setSaving(false);
        }
    }

    // PUT — renommer un projet 
    async function renameProject(project: Project) {
        const newName = prompt('Nouveau nom du projet', project.name);
        if (!newName || newName === project.name) return;

        setSaving(true);
        setError(null);
        try {
            await api.put(`/projects/${project.id}`, { name: newName });
            setProjects(prev => prev.map(p => p.id === project.id ? { ...p, name: newName } : p));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
            } else {
                setError('Erreur inconnue');
            }
        } finally {
            setSaving(false);
        }
    }

    // DELETE — supprimer un projet 
    async function deleteProject(project: Project) {
        if (!window.confirm(`Supprimer le projet "${project.name}" ?`)) return;

        setSaving(true);
        setError(null);
        try {
            await api.delete(`/projects/${project.id}`);
            setProjects(prev => prev.filter(p => p.id !== project.id));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
            } else {
                setError('Erreur inconnue');
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className={styles.loading}>Chargement...</div>;

    return (
        <div className={styles.layout}>
            <HeaderMUI
                title="TaskFlow"
                onMenuClick={() => setSidebarOpen(p => !p)}
                userName={authState.user?.name}
                onLogout={() => dispatch({ type: 'LOGOUT' })}
            />
            <div className={styles.body}>
                <Sidebar projects={projects} isOpen={sidebarOpen} />
                <div className={styles.content}>
                    <div className={styles.toolbar}>
                        {error && <div className={styles.error}>{error}</div>}
                        {!showForm ? (
                            <button className={styles.addBtn}
                                disabled={saving}
                                onClick={() => setShowForm(true)}>
                                + Nouveau projet
                            </button>
                        ) : (
                            <ProjectForm
                                submitLabel="Créer"
                                onSubmit={(name, color) => {
                                    addProject(name, color);
                                    setShowForm(false);
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        )}
                    </div>
                    <MainContent columns={columns} />
                </div>
            </div>
        </div>
    );
}