import styles from './BookshelfCover.module.css'

const books = [
  { color: '#e74c3c', height: '70%' },
  { color: '#3b82f6', height: '85%' },
  { color: '#22c55e', height: '60%' },
  { color: '#f59e0b', height: '90%' },
  { color: '#a855f7', height: '75%' },
  { color: '#06b6d4', height: '65%' },
  { color: '#ec4899', height: '80%' }
]

export function BookshelfCover() {
  return (
    <div className={styles.cover}>
      <div className={styles.books}>
        {books.map((book, i) => (
          <span
            key={i}
            className={styles.book}
            style={{
              background: book.color,
              height: book.height,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
      <h3 className={styles.title}>Bookshelf</h3>
    </div>
  )
}
