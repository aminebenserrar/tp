import { useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import useProjects from '../hooks/useProjects';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';

interface Project { id: string; name: string; color: string; }

// Mémoriser les composants enfants pour éviter les re-renders inutiles
const MemoizedSidebar = memo(Sidebar);
const MemoizedMainContent = memo(MainContent);

export default function Dashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { projects, columns, loading, addProject, renameProject, deleteProject } = useProjects();
    
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // useCallback pour garder une référence stable aux fonctions
    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    if (loading) return <div className={styles.loading}>Chargement...</div>;

    return (
        <div className={styles.layout}>
            <Header
                title="TaskFlow"
                onMenuClick={() => setSidebarOpen(p => !p)}
                userName={user?.name}
                onLogout={handleLogout}
            />
            <div className={styles.body}>
                <MemoizedSidebar 
                    projects={projects} 
                    isOpen={sidebarOpen}
                />
                <div className={styles.content}>
                    <div className={styles.toolbar}>
                        {!showForm ? (
                            <button className={styles.addBtn}
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
                    <MemoizedMainContent columns={columns} />
                </div>
            </div>
        </div>
    );
}