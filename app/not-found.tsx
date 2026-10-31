import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0A1215', color: '#F5F0E8', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '2rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>404 - PATH NOT FOUND</h2>
      <Link href="/" style={{ color: '#D12C28', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.15em' }}>
        RETURN TO HOME WORLD &#8250;
      </Link>
    </div>
  );
}
