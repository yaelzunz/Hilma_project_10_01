import React from 'react'
import { useEffect, useState } from 'react'
// firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, provider } from "../firebase/config";
 
// Assets
import { AiOutlineStar, AiFillStar } from 'react-icons/ai'
// Styles
import styles from '../styles/pages/article.module.css'
import { useParams } from 'react-router-dom'
// Utils
import { GPTClient } from '../utils/gptclient.util'
import { translateWord } from '../utils/translateWord.util';
// Components
import QuestionForm from '../components/article/QuestionForm'
// Configs
import { CHATGPT_API_URL, NEWS_API_URL } from '../configs/url.config'


export default function Questions() {

    const { title } = useParams()
    const [user, loading, error] = useAuthState(auth)
    const [articleData, setArticleData] = useState(null)
    const [questions, setQuestions] = useState([])
    const [isFavorite, setIsFavorite] = useState(false)
    const [favoriteArticles, setFavoriteArticles] = useState([])


    // Handlers
    const loadArticle = async () => {
        // Load article data
        const res = await fetch(NEWS_API_URL.by_title(title))
        console.log(res)
        const data = await res.json()
        console.log(data)
        const article = data.results?.[0]
        console.log(article)
        setArticleData(article)
        console.log(articleData)


    }


    const loadQuestions = async () => {
        // Get questions
        const data = await GPTClient.getQuestions(articleData.title, articleData.content)
        setQuestions(data)
        console.log(questions.map((q,i) => <QuestionForm key={i} {...q} />))
    }


     // Effects
     useEffect(() => {
        // On user load
        console.log(user)
        if (user) {
            // Load data on initial page load.
            loadArticle()
        }
    }, [user])
    useEffect(() => {
        // Load questions when data is loaded.
       
        if (articleData) {
            loadQuestions()
        }
        
    }, [articleData])



  return (

    <div className={styles["try"]}>
        <p>.</p>

    <div className={styles["Article"]}>
        <section className={styles["forms"]}>
            {questions?.map((q,i) => <QuestionForm key={i} {...q} />)}
        </section>
    </div>
    
    </div>
 



            
  )
}
