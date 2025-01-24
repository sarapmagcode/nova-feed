import { useEffect, useState } from 'react';
import styles from './Explore.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { truncateText } from '/src/utils/helpers.js';

const Explore = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState(() => {
        return searchParams.get('search') || '';
    });
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState(() => {
        return searchParams.get('search') || '';
    });

    /**
     * Fetches media items from NASA's API.
     * Updates the `mediaItems` state with the retrieved data.
     * Handles loading and error states during the fetch process.
     * 
     * @async
     * @function retrieveMediaItems
     * @throws {Error} If the fetch operation fails.
     */
    useEffect(() => {
        const retrieveMediaItems = async () => {
            try {
                const response = await fetch(`https://images-api.nasa.gov/search?q=${submittedSearchTerm}&media_type=image&page_size=10`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMediaItems(data.collection.items);
            } catch (error) {
                console.error('Failed to retrieve media items:', error);
            }
        };

        retrieveMediaItems();
    }, [submittedSearchTerm]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSubmittedSearchTerm(searchTerm);
        setSearchParams({
            search: searchTerm
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSubmittedSearchTerm('');
        setSearchParams({});
    };

    return (
        <>
            <main className={styles.container}>
                <header>
                    <h1>NASA Media Library</h1>
                    <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className={styles.search}
                            type="text"
                            placeholder="Search NASA's media library..."
                        />

                        {submittedSearchTerm && (
                            <button
                                onClick={clearSearch}
                                className={styles.clearSearchBtn}
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)">
                                    <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                                </svg>
                            </button>
                        )}

                        <button className={styles.searchBtn}>Search</button>
                    </form>

                    {/* TODO: Implement videos */}
                    <div className={styles.mediaTypeToggle}>
                        <button className={styles.active} data-type="image">Images</button>
                        <button data-type="videdo">Videos</button>
                    </div>
                </header>

                <div className={styles.resultsGrid}>
                    {mediaItems.length > 0 ? (
                        mediaItems.map((mediaItem, index) => (
                            <div key={index} className={styles.mediaItem}>
                                <img src={mediaItem.links[0].href} alt={mediaItem.data[0].title} />
                                <div className={styles.mediaInfo}>
                                    <h3>{mediaItem.data[0].title}</h3>
                                    <p>{truncateText(mediaItem.data[0].description)}</p>
                                </div>
                            </div>
                        ))  
                    ) : (
                        <div className={styles.loading}>Searching the cosmos...</div>
                    )}
                </div>
            </main>

            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <button className={styles.modalClose}>&times;</button>
                    <div className={styles.modalBody}></div>
                </div>
            </div>
        </>
    );
};

export default Explore;