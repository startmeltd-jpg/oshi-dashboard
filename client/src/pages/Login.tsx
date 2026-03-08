export default function Login() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#FFD700',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
          }}
        >
          OSHI Labs
        </div>
        <p
          style={{
            color: '#00FFFF',
            marginBottom: '2rem',
            fontSize: '1.2rem',
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          チームメンバー専用エリア
        </p>
        <a
          href="/api/auth/login"
          style={{
            display: 'inline-block',
            color: '#FFD700',
            padding: '14px 36px',
            border: '1px solid #FFD700',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 0 30px rgba(255, 215, 0, 0.5)';
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'rgba(255, 215, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 0 15px rgba(255, 215, 0, 0.2)';
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'transparent';
          }}
        >
          Login する
        </a>
      </div>
    </div>
  );
}
