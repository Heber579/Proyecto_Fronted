import { NavLink } from 'react-router-dom';

function Navbar() {
    const getStyle = ({ isActive }: { isActive: boolean }) => ({
        color: isActive ? '#ffffff' : '#94a3b8',
        textDecoration: 'none',
        fontWeight: isActive ? '600' : '400',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        transition: 'all 0.2s'
    });

    return (
        <header style={{ backgroundColor: '#0f172a', padding: '1rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                        .... Sistema Gimnasio....
                </h1>
                <nav style={{ display: 'flex', gap: '0.5rem' }}>
                    <NavLink to="/miembros" style={getStyle}>Miembros</NavLink>
                    <NavLink to="/planes" style={getStyle}>Planes</NavLink>
                    <NavLink to="/membresias" style={getStyle}>Membresías</NavLink>
                    <NavLink to="/pagos" style={getStyle}>Pagos</NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;