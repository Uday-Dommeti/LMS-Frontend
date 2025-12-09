import { useEffect, useState } from "react";
import { useAddQuizMutation, useEditQuizByIdMutation, useGetQuestionsQuery, useGetQuizByIdQuery, useLazyGetAllQuizzesQuery, useLazyGetQuizByIdQuery } from "../services/technology";
import parse from "html-react-parser";
import { TagsInput } from "react-tag-input-component";
import { useNavigate, useParams } from "react-router-dom";
import QuizPreview from "./QuizPreview";

function CreateQuiz() {
    const { Id } = useParams();
    const quizById = useGetQuizByIdQuery(Id);
    const [editQuizById] = useEditQuizByIdMutation();
    const [LazyGetQuizById] = useLazyGetQuizByIdQuery();
    const { isLoading, data } = useGetQuestionsQuery();
    const [addQuizFn] = useAddQuizMutation();
    const [LazyGetAllQuizzes] = useLazyGetAllQuizzesQuery();
    const [filQuestions, setFilQuestions] = useState([]);
    const navigate = useNavigate();
    const [searchTags, setSearchTags] = useState([]);
    const [newQuiz, setNewQuiz] = useState({
        quizTitle: "",
        quizTags: [],
        quizQuestions: []
    });

    useEffect(() => {
        // console.log(data?.questions);
        setFilQuestions(data?.questions);
    }, [data]);

    useEffect(() => {
        if (!Id) return;  // <-- DO NOT RUN WHEN CREATING

        if (quizById?.data) {
            setNewQuiz(quizById.data.requestedQuiz);
        }
    }, [Id, quizById?.data]);


    // useEffect(()=>{
    //     console.log(quizQuestions);
    // },[quizQuestions])

    // useEffect(()=>{
    //     console.log(quizTitle);
    // },[quizTitle])

    // useEffect(() => {
    //     console.log(newQuiz);
    // }, [newQuiz])

    useEffect(() => {
        const updatedQuestions = data?.questions.filter((que) => que.tags.some(tag =>
            searchTags.some(s => s.toLowerCase() === tag.toLowerCase())
        ));
        // console.log(searchTags);
        // console.log(data?.questions)
        setFilQuestions(() => searchTags.length > 0 ? updatedQuestions : data?.questions)
    }, [searchTags])

    const handleTitleChange = (e) => {
        // setQuizTitle(e.target.value);
        setNewQuiz({ ...newQuiz, quizTitle: e.target.value });
    }

    const handleCheckBox = (e, question) => {
        let updatedQuestions;
        let updatedTags = [];
        if (e.target.checked) {
            updatedQuestions = [...newQuiz.quizQuestions, question["_id"]];
            updatedTags = question.tags.filter((tag) => !newQuiz.quizTags.includes(tag));
            // console.log(updatedTags);
            // setQuizTags([...quizTags,...updatedTags]);
            // setNewQuiz({...newQuiz,quizTags:[...newQuiz.quizTags,...updatedTags]});
        }
        else {
            updatedQuestions = newQuiz.quizQuestions.filter((que) => que != question["_id"])
        }
        // updatedQuestions.sort((a,b)=>{
        // if()
        // })
        // setQuizQuestions(updatedQuestions);
        setNewQuiz({ ...newQuiz, quizQuestions: updatedQuestions, quizTags: [...newQuiz.quizTags, ...updatedTags] });
    }

    const createQuiz = async () => {
        // console.log(newQuiz);
        const submitFn = !Id ? addQuizFn : editQuizById;
        const res = await submitFn(newQuiz);
        // console.log("RES::", res);
        LazyGetAllQuizzes();
        if (Id) {
            LazyGetQuizById(Id);
        }
        navigate("/admin/quizes")
        setNewQuiz({
            quizTitle: "",
            quizTags: [],
            quizQuestions: []
        });
        setSearchTags([]);
        data?.questions?.map((que) => {
            document.getElementById(que["_id"]).checked = false;
        })
    }

    return (
        <div className="d-flex">
            <div className="m-2 w-75 d-flex flex-column align-items-center">
                <div className="d-flex justify-content-evenly w-100 align-items-center">
                    <div className="quiz-title-row  d-flex align-items-center justify-content-center">
                        <h5 className="p-0">Quiz Title: </h5>
                        <input type="text" id="quizTitle" name="quizTitle" value={newQuiz?.quizTitle} onChange={handleTitleChange} autoComplete="off" />
                    </div>

                    <TagsInput
                        value={searchTags}
                        onChange={setSearchTags}
                        placeHolder="Enter search tags for filtering questions"
                    ></TagsInput>
                </div>


                <div className="d-flex flex-wrap list-unstyled m-2">
                    {filQuestions?.map((que, index) => {
                        return <label htmlFor={que?._id} className="quiz-question-card" role="button">
                            <input type="checkbox" id={que?._id} checked={newQuiz?.quizQuestions?.includes(que["_id"])} onChange={(e) => { handleCheckBox(e, que) }} />
                            <span className="d-flex flex-wrap question-pr mx-2">{parse(que.question)}</span>
                        </label>
                    })}
                </div>
                <button className="btn btn-primary create-btn" onClick={createQuiz}>{Id ? "Edit Quiz" : "Create Quiz"}</button>
            </div>
            <div className="w-25">
                <QuizPreview quizQuestions={newQuiz?.quizQuestions}></QuizPreview>
            </div>
        </div>
    )
}

export default CreateQuiz;