import { useNavigate, useParams } from "react-router-dom";
import { useGetQuizByIdQuery, useLazyGetQuizByIdQuery, useSaveResultsMutation } from "../../services/quiz";
import { useFormik } from "formik";
import parse from "html-react-parser"
import { useEffect, useState } from "react";
import { notifySuccess } from "../../components/Toast";

function QuizAttempt({ type, quizId, currentResult }) {
    let { Id } = useParams();
    // const [currentId,setCurrentId] = useState("");
    // const { isLoading, data } = useGetQuizByIdQuery(Id);
    const [LazyGetQuizFn, { isLoading, data }] = useLazyGetQuizByIdQuery()
    const [saveResultsFn] = useSaveResultsMutation();
    const [quizResponse, setQuizResponse] = useState("");
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const navigate = useNavigate();

    const QuizForm = useFormik({
        initialValues: {},
        onSubmit: async (values) => {
            // console.log("Before:",values);
            for (var k in values) {
                // console.log(k);
                if (k != "quizId" && typeof values[k] == "string") {
                    values[k] = [values[k]];
                    console.log(k, typeof values[k], values[k])
                }
            }
            // console.log("After::",values);
            const res = await saveResultsFn(values);
            // console.log("Res::", res);
            // QuizForm.resetForm();
            setQuizResponse(res?.data?.result);
            notifySuccess("Quiz submitted");
        }
    })

    useEffect(() => {
        // console.log(data);
        QuizForm.setValues(data?.initialValues);
    }, [data])

    useEffect(() => {
        LazyGetQuizFn(Id);
    }, [])

    useEffect(() => {
        if (type && type == "Only result") {
            // Id = quizId;
            console.log(currentResult?.result)
            setQuizResponse(currentResult?.result);
            LazyGetQuizFn(currentResult?.quizId);
        }
    }, [currentResult])

    useEffect(() => {
        let tempScore = 0;
        let tempTotalScore = 0;
        for (var k in quizResponse) {
            // console.log(k,quizResponse[k]);
            if (quizResponse[k]) tempScore = tempScore + quizResponse[k].score;
            tempTotalScore = tempTotalScore + quizResponse[k].correctAnswer.length;
            // setTotalScore((totalScore + quizResponse[k].correctAnswer.length))
        }
        setScore(tempScore);
        setTotalScore(tempTotalScore)
    }, [quizResponse])

    return (
        <div className="d-flex">

            <div className="quiz-attempt-container">
                <h4>{data?.quizTitle}</h4>

                <div className="quiz-body-wrapper">
                    <form onSubmit={QuizForm.handleSubmit} className="overflow-y-auto w-75">

                        {data?.quizQuestions?.map((que, index) => (
                            <li className="quiz-question">
                                <div className="d-flex">
                                    {index + 1}) &nbsp;
                                    <span className="question-pr">{parse(que.question)}</span>
                                </div>
                                {que?.questionImage && <div className="d-flex justify-content-center">
                                    <img src={`http://localhost:3500${que?.questionImage}`} alt="" className="w-50" />
                                </div>}
                                <ul className="quiz-options">
                                    {que.options.map((opt, i) => (
                                        <li>
                                            <div className="quiz-option-row">
                                                <input
                                                    type={que?.optionType == "Multiple choice" ? "radio" : "checkbox"}
                                                    disabled={quizResponse}
                                                    id={`${que["_id"]}${i}`}
                                                    {...QuizForm.getFieldProps(que["_id"])}
                                                    value={opt}
                                                />

                                                <label htmlFor={`${que["_id"]}${i}`} className="question-pr">
                                                    {parse(opt)}
                                                </label>

                                                {quizResponse && quizResponse[que["_id"]]?.userAnswer?.includes(opt) &&
                                                    (quizResponse[que["_id"]].correctAnswer.includes(opt) ? (
                                                        <i className="bi bi-check2 text-success"></i>
                                                    ) : (
                                                        <i className="bi bi-x-lg text-danger"></i>
                                                    ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}

                        <button className={`quiz-submit-btn ${quizResponse ? "d-none" : ""}`} type="submit">
                            Submit
                        </button>
                    </form>

                </div>
            </div>
            {quizResponse && (
                <div className="quiz-score-box">
                    Score: {score}/{totalScore}
                </div>
            )}
        </div>
    );

}

export default QuizAttempt;