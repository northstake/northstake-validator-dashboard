import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './NotificationBar.module.css' // Import CSS module

interface NotificationBarProps {
  message: string
  rfqId: string
  onClose: () => void
}

const NotificationBar: React.FC<NotificationBarProps> = ({ message, rfqId, onClose }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    return () => setVisible(false)
  }, [])

  return (
    <div className={`${styles.notificationBar} ${visible ? styles.slideIn : styles.slideOut} ${styles.rightAlign}`}>
      <span>{message}</span>
      <Link href={`/rfq?expand=${rfqId}`} legacyBehavior>
        <a className="ml-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded">
          View RFQ
        </a>
      </Link>
      <button onClick={onClose} className="ml-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded">
        Close
      </button>
    </div>
  )
}

export default NotificationBar