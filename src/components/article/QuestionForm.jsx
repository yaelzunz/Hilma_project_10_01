
// Styles
import { useState } from 'react';
import styles from '../../styles/components/question-form.module.css'


/**
 * Component renders an article question form
 */
export default function QuestionForm({ question, answer, opts }) {
    const [isShowingButton, setIsShowingButton] = useState(false);

    const toggleVisibility = () => {
        setIsShowingButton(!isShowingButton);
      };

    return (
        <form>
            <section className={styles["question"]}>
                <h4>שאלה:</h4>
                <span>{question}</span>
            </section>
            <section className={styles["answer"]}>
                <h4>{opts ? 'תשובות:' : 'תשובה:'}</h4>
                { !opts
                    ? <textarea cols="30" rows="10" placeholder='כתוב כאן' />
                    : <ol className={styles["options-list"]}>
                        { opts?.map((o,i) => 
                            <li key={i}>{o}</li>) }
                    </ol>
                }
            </section>

            <button type="button" onClick={toggleVisibility}>תשובות:</button>
            {isShowingButton && <section className={styles["question"]}>
                <span>{answer}</span>
            </section>}
        </form>
    )
}
