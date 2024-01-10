import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Assets
import { AiFillStar, AiOutlineSearch } from 'react-icons/ai'
// Styles
import styles from '../styles/pages/home.module.css'
// Components
import ArticleItem from '../components/article/ArticleItem'
// firebase
import { auth, db } from "../firebase/config";
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
// Configs
import { NEWS_DATA_API_KEY } from '../configs/apikeys.config'
import { NEWS_API_URL } from '../configs/url.config';


/**
 * Component renders the `404 not found` page.
 */
function Home() {
    
    // States
    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth)

    // Articles
    const [myArticles, setMyArticles] = useState([])
    const [interestingArticles, setInterestingArticles] = useState([])
    
    // Handlers
    const searchHandler = e => {
        // e.preventDefault()
        if (e.key === 'Enter') {
            navigate(`/search?q=${e.target.value}`)
        }
    }
    const getData = async () => {
        
        if (loading) {
            console.log('Loading user data')
            return
        }
        else if (error) {
            // An error occurred while fetching user data
            window.location.href = '/login';
        }
        else {
            // User is authenticated
            console.log('User is authenticated:', user.email);
            
            // Get user details
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            if (!userDoc.exists()) {
                // User document does not exist
                console.log('User document does not exist');
                return
            }
            
            // Get random interest from array.
            const interests = userDoc.data().interests
            const random_interest = Math.round(Math.random() * interests.length)
            // Get suggested articles
            const interests_as_str = interests[random_interest]
            const res = await fetch(NEWS_API_URL.search(interests_as_str))
            const data = await res.json()
            setInterestingArticles(data.results)

            // Get user articles
            const userArticles = userDoc.data().favoriteArticles ?? []
            console.log({userArticles})
            const _myArticles = []
            for (const title of userArticles) {
                // Get article data by title (as id)
                const res = await fetch(NEWS_API_URL.by_title(title))
                const data = await res.json()
                console.log('ufavorite articles from news api')
                console.log({data})
                if (data.results?.[0])
                    _myArticles.push(data.results?.[0])
            }
            setMyArticles(_myArticles)
        }
    }
    
    // Effects
    useEffect(() => {
        // Load data on initial page load.
        if (user) {
            getData()
        }
    }, [user])

    console.log({ myArticles, interestingArticles });

    return (
        <div className={styles["Home"]}>
            <div className={styles["modal"]}>
                <section className={styles["favorite-articles"]}>
                    <div className={styles["heading"]}>
                        <div className={styles["title"]}>
                            <AiFillStar size={32} />
                            <h1>המאמרים המועדפים שלי</h1>
                        </div>
                        <div className={styles["search"]}>
                            <AiOutlineSearch size={22} />
                            <input type="text" 
                                placeholder='חיפוש מאמר'
                                onKeyDown={searchHandler} />
                        </div>
                    </div>
                    <div className={styles["articles-list"]}>
                        {myArticles.map?.((a,i) => <ArticleItem key={i} {...a}/>)}
                    </div>
                </section>
                <section className={styles["interesting-articles"]}>
                    <div className={styles["heading"]}>
                        <div className={styles["title"]}>
                            <h3>מאמרים שיכולים לעניין אותך</h3>
                        </div>
                    </div>
                    <div className={styles["articles-list"]}>
                        {interestingArticles.map?.((a,i) => <ArticleItem key={i} {...a}/>)}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Home