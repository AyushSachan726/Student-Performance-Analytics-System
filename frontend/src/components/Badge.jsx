export default function Badge({ status }) {
  const cls =
    status === 'Excellent'
      ? 'excellent'
      : status === 'Good'
        ? 'good'
        : status === 'Average'
          ? 'average'
          : 'at-risk';

  return <span className={`badge ${cls}`}>{status}</span>;
}
