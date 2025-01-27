import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { truncateText } from '/src/utils/helpers.js';
import styles from './Explore.module.css';

const Explore = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [mediaType, setMediaType] = useState('image');
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState(() => {
        return searchParams.get('search') || '';
    });
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState(() => {
        return searchParams.get('search') || '';
    });

    const MAX_KEYWORDS = 4;
    const [expandedItems, setExpandedItems] = useState({});

    const toggleKeywords = (itemId) => {
        setExpandedItems((prevExpandedItems) => ({
            ...prevExpandedItems,
            [itemId]: !prevExpandedItems[itemId]
        }));
    };

    useEffect(() => {
        const retrieveMediaItems = async () => {
            try {
                const response = await fetch(`https://images-api.nasa.gov/search?q=${submittedSearchTerm}&media_type=${mediaType}&page_size=10`);
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
    }, [submittedSearchTerm, mediaType]);

    const handleMediaTypeSelection = (type) => {
        setMediaType(type);
    };

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

    const KeywordList = ({ keywords, itemId }) => {
        if (!keywords) {
            return null;
        }
    
        const isExpanded = expandedItems[itemId];
        const displayedKeywords = isExpanded ? keywords : keywords.slice(0, MAX_KEYWORDS);

        return (
            <div className={styles.keywordList}>
                {displayedKeywords.map((keyword, index) => (
                    <span key={index} className={styles.keyword}>
                        {keyword}
                    </span>
                ))}

                {keywords.length > MAX_KEYWORDS && (
                    <button
                        onClick={() => toggleKeywords(itemId)}
                        className={styles.showMoreBtn}
                    >
                        {isExpanded ? 'Show Less' : `+${keywords.length - MAX_KEYWORDS} more`}
                    </button>
                )}
            </div>
        );
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

                    <div className={styles.mediaTypeToggle}>
                        <button
                            onClick={() => handleMediaTypeSelection('image')}
                            className={mediaType === 'image' ? styles.active : ''}
                        >
                            Images
                        </button>
                        <button
                            onClick={() => handleMediaTypeSelection('video')}
                            className={mediaType === 'video' ? styles.active : ''}
                        >
                            Videos
                        </button>
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

                                    <KeywordList
                                        keywords={mediaItem.data[0].keywords}
                                        itemId={index}
                                    />
                                </div>
                            </div>
                        ))  
                    ) : (
                        <div className={styles.loading}>Searching the cosmos...</div>
                    )}
                </div>
            </main>
            
            
        </>
    );
};

export default Explore;