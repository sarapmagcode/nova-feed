import { useEffect, useState, useTransition } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { truncateText } from '/src/utils/helpers.js';
import styles from './Explore.module.css';

const Explore = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Media
    const [mediaType, setMediaType] = useState('image');
    const [mediaItems, setMediaItems] = useState([]);

    // Search Term
    const [searchTerm, setSearchTerm] = useState(() => {
        return searchParams.get('search') || '';
    });
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState(() => {
        return searchParams.get('search') || '';
    });

    // Keywords
    const MAX_KEYWORDS = 4;
    const [expandedItems, setExpandedItems] = useState({});

    const toggleKeywords = (itemId) => {
        setExpandedItems((prevExpandedItems) => ({
            ...prevExpandedItems,
            [itemId]: !prevExpandedItems[itemId]
        }));
    };

    // Pages
    const PAGE_SIZE = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(() => {
        const page = searchParams.get('page');
        const parsedPage = page ? parseInt(page) : 1;
        return parsedPage > 0 ? parsedPage : 1;
    });

    // Pagination
    const [isPaginationHidden, setIsPaginationHidden] = useState(true);
    const [isPrevHidden, setIsPrevHidden] = useState(false);
    const [isNextHidden, setIsNextHidden] = useState(false);

    useEffect(() => {
        const retrieveMediaItems = async () => {
            try {
                const response = await fetch(`https://images-api.nasa.gov/search?q=${submittedSearchTerm}&media_type=${mediaType}&page=${pageNumber}&page_size=${PAGE_SIZE}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMediaItems(data.collection.items);
                
                const totalHits = data.collection.metadata.total_hits;
                const calculatedTotalPages = Math.max(1, Math.ceil(totalHits / PAGE_SIZE));
                setTotalPages(calculatedTotalPages);

                if (totalHits > 0) {
                    setIsPrevHidden(pageNumber === 1);
                    setIsNextHidden(pageNumber >= calculatedTotalPages);
                    setIsPaginationHidden(false);
                } else {
                    setIsPaginationHidden(true);
                }
                
                if (searchParams.get('page') !== pageNumber.toString()) {
                    setSearchParams({
                        page: pageNumber.toString(),
                        ...(submittedSearchTerm && { search: submittedSearchTerm }),
                    });
                }

                window.scroll(0, 0);
            } catch (error) {
                console.error('Failed to retrieve media items:', error);
            }
        };

        retrieveMediaItems();
    }, [pageNumber, submittedSearchTerm, mediaType]);

    const handleMediaTypeSelection = (type) => {
        setMediaType(type);
        setExpandedItems({});

        setPageNumber(1);
        setSearchParams({
            page: '1',
            ...(submittedSearchTerm && { search: submittedSearchTerm }),
        })
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        setPageNumber(1);
        setSubmittedSearchTerm(searchTerm);
        setSearchParams({
            page: '1',
            ...(searchTerm && { search: searchTerm }),
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSubmittedSearchTerm('');
        setPageNumber(1);
        setSearchParams({ page: '1' });
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

    const decrementPageNumber = () => {
        if (pageNumber > 1) {
            setPageNumber((prevPageNumber) => prevPageNumber - 1);
        }
    };

    const incrementPageNumber = () => {
        if (pageNumber < totalPages) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
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
                        // Actual Items
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
                    ) : submittedSearchTerm ? (
                        <p className={styles.statusText}>No items found matching "{submittedSearchTerm}"</p>
                    ) : (
                        // Skeleton Items
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className={styles.mediaItemSkeleton}>
                                <div className={styles.imageSkeleton}></div>

                                <div className={styles.mediaInfoSkeleton}>
                                    <div className={styles.titleSkeleton}></div>
                                    <div className={styles.descriptionSkeleton}></div>

                                    <div className={styles.keywordListSkeleton}>
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className={styles.keywordSkeleton}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
            
            {!isPaginationHidden && (
                <div className={styles.pagination}>
                    {!isPrevHidden && (
                        <button onClick={decrementPageNumber} className={styles.prevBtn}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
                            </svg>
                            Prev
                        </button>
                    )}

                    <p>{pageNumber} of {totalPages}</p>

                    {!isNextHidden && (
                        <button onClick={incrementPageNumber} className={styles.nextBtn}>
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default Explore;