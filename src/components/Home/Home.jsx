import styles from './Home.module.css';

const Home = () => {

    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <h4>APOD (Astronomy Picture of the Day)</h4>

                <div className={styles.imageContainer}>
                    <img src="https://placehold.co/600x400" alt="APOD Image" />
                </div>
                
                <div className={styles.info}>
                    <h2>Title</h2>
                    <p className={styles.date}>Date</p>
                    <p className={styles.explanation}>Explanation</p>
                    <p>Copyright</p>
                </div>
            </div>
        </main>
    );
};

export default Home;