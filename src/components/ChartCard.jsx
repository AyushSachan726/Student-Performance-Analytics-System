import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, actions, delay = 0, style }) {
  return (
    <motion.div
      className="white-card"
      style={style}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
    >
      <div className="card-header-flex">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </motion.div>
  );
}
